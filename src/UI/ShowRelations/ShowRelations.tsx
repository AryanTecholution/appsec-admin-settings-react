import React, { useState, useRef, useEffect, useMemo } from "react";
import { Group } from "@visx/group";
import { Tree } from "@visx/hierarchy";
import { LinearGradient } from "@visx/gradient";
import { pointRadial } from "d3-shape";
import { Zoom } from "@visx/zoom";
import { localPoint } from "@visx/event";
import getLinkComponent from "./getLinkComponent";
import useForceUpdate from "./useForceUpdate";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import { hierarchy } from "d3-hierarchy";
import ZoomContent from "./ZoomContent";

export interface TreeNode {
  name?: string;
  type?: string;
  isExpanded?: boolean;
  children?: TreeNode[];
}

export type LinkTypesProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  handleDialogOpen: () => void;
  open: boolean;
  relationData: TreeNode;
};

const ShowRelations: React.FC<LinkTypesProps> = ({
  width: totalWidth,
  height: totalHeight,
  handleDialogOpen,
  open,
  relationData,
}) => {
  const [layout, setLayout] = useState<string>("cartesian");
  const [orientation, setOrientation] = useState<string>("horizontal");
  const [linkType, setLinkType] = useState<string>("diagonal");
  const [stepPercent, setStepPercent] = useState<number>(0.5);
  const [showMiniMap, setShowMiniMap] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const forceUpdate = useForceUpdate();
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<any>(null);
  const rootNodeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const root = hierarchy(relationData);
  const depth = root.height + 1;
  const leaves = root.leaves().length;
  const heightEstimate = leaves * 80;
  const widthEstimate = depth * 300;

  const dynamicHeight = Math.max(800, heightEstimate);
  const dynamicWidth = Math.max(1500, widthEstimate);

  const innerWidth = dynamicWidth;
  const innerHeight = dynamicHeight;

  let origin: { x: number; y: number };
  let sizeWidth: number;
  let sizeHeight: number;

  if (layout === "polar") {
    origin = {
      x: innerWidth / 2,
      y: innerHeight / 2,
    };
    sizeWidth = 2 * Math.PI;
    sizeHeight = Math.min(innerWidth, innerHeight) / 4; // Reduced for better radial layout
  } else {
    origin = { x: 0, y: 0 };
    if (orientation === "vertical") {
      sizeWidth = innerWidth;
      sizeHeight = innerHeight;
    } else {
      sizeWidth = innerHeight;
      sizeHeight = innerWidth;
    }
  }

  const LinkComponent = getLinkComponent({ layout, linkType, orientation });

  // Theme configuration
  const theme = {
    dark: {
      background: "from-slate-900 via-slate-800 to-slate-900",
      dialogBg: "#1a1d3a",
      headerBg: "bg-slate-800/50",
      panelBg: "bg-slate-800/90",
      border: "border-slate-700/50",
      text: "text-white",
      textSecondary: "text-slate-400",
      button: "bg-slate-700/50 hover:bg-slate-700",
      buttonHover: "hover:bg-blue-500/20",
      svgBg:
        "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
      gradients: {
        links: { from: "#ec4899", to: "#8b5cf6" },
        root: { from: "#f59e0b", to: "#ec4899" },
        node: { from: "#3b82f6", to: "#06b6d4" },
        bg: { from: "#0f172a", to: "#1e293b" },
      },
      nodeColors: {
        root: "white",
        label: "#10b981",
        branch: "#e2e8f0",
        leaf: "#a78bfa",
      },
    },
    light: {
      background: "from-gray-50 via-white to-gray-50",
      dialogBg: "#ffffff",
      headerBg: "bg-gray-100/90",
      panelBg: "bg-white/90",
      border: "border-gray-300/50",
      text: "text-gray-900",
      textSecondary: "text-gray-600",
      button: "bg-gray-200/50 hover:bg-gray-200",
      buttonHover: "hover:bg-blue-500/20",
      svgBg:
        "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
      gradients: {
        links: { from: "#ec4899", to: "#8b5cf6" },
        root: { from: "#f59e0b", to: "#ec4899" },
        node: { from: "#3b82f6", to: "#06b6d4" },
        bg: { from: "#f8fafc", to: "#e2e8f0" },
      },
      nodeColors: {
        root: "white",
        label: "#059669",
        branch: "#374151",
        leaf: "#7c3aed",
      },
    },
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: 0,
    },
    "& .MuiDialogActions-root": {
      padding: 0,
    },
    "& .MuiPaper-root": {
      width: "95vw",
      maxWidth: "95vw",
      height: "95vh",
      maxHeight: "95vh",
      borderRadius: "16px",
      backgroundColor: currentTheme.dialogBg,
      overflow: "hidden",
    },
  }));

  // Function to calculate text dimensions
  const getTextDimensions = (
    text: string,
    fontSize: number = 10
  ): { width: number; height: number } => {
    if (typeof window !== "undefined") {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        context.font = `${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
        const metrics = context.measureText(text || "");
        return {
          width: metrics.width,
          height: fontSize,
        };
      }
    }
    return { width: text ? text.length * 6 + 20 : 50, height: fontSize };
  };

  const rootNodeWidth = getTextDimensions(relationData.name || "").width + 40;
  const margin = {
    top: 60,
    left: Math.max(180, rootNodeWidth / 2 + 60) + 10,
    right: 60,
    bottom: 60,
  };

  const initialTransform = useMemo(
    () => ({
      scaleX: layout === "polar" ? 0.7 : 0.9,
      scaleY: layout === "polar" ? 0.7 : 0.9,
      translateX: 0,
      translateY: 0,
      skewX: 0,
      skewY: 0,
    }),
    [relationData, dynamicWidth, dynamicHeight, layout]
  );

  // Enhanced node click handler
  const handleNodeClick = (node: any) => {
    node.data.isExpanded = !node.data.isExpanded;
    forceUpdate();
  };

  // Reset to fit handler
  const handleResetToFit = (zoom: any) => {
    zoom.setTransformMatrix({
      scaleX: layout === "polar" ? 0.7 : 0.9,
      scaleY: layout === "polar" ? 0.7 : 0.9,
      translateX: 0,
      translateY: 0,
      skewX: 0,
      skewY: 0,
    });
  };

  // Center on root node
  const centerOnRoot = (zoom: any) => {
    if (rootNodeRef.current) {
      zoom.setTransformMatrix({
        scaleX: 1,
        scaleY: 1,
        translateX: innerWidth / 2 - margin.left,
        translateY: innerHeight / 2 - margin.top,
        skewX: 0,
        skewY: 0,
      });
    }
  };

  // Prevent browser zoom
  useEffect(() => {
    const preventZoom = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    const preventKeyboardZoom = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "+" || e.key === "-" || e.key === "0")
      ) {
        e.preventDefault();
      }
    };

    const preventTouchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    if (open) {
      document.addEventListener("wheel", preventZoom, { passive: false });
      document.addEventListener("keydown", preventKeyboardZoom);
      document.addEventListener("touchstart", preventTouchZoom, {
        passive: false,
      });
      document.addEventListener("touchmove", preventTouchZoom, {
        passive: false,
      });
    }

    return () => {
      document.removeEventListener("wheel", preventZoom);
      document.removeEventListener("keydown", preventKeyboardZoom);
      document.removeEventListener("touchstart", preventTouchZoom);
      document.removeEventListener("touchmove", preventTouchZoom);
    };
  }, [open]);

  return (
    <BootstrapDialog
      onClose={handleDialogOpen}
      aria-labelledby="relation-tree-dialog"
      open={open}
      maxWidth={false}
      fullWidth={false}
    >
      <div
        ref={containerRef}
        className={`relative bg-gradient-to-br ${currentTheme.background} flex flex-col`}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          touchAction: "none",
        }}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 ${currentTheme.headerBg} backdrop-blur-sm ${currentTheme.border} border-b`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
            <h2 className={`text-xl font-semibold ${currentTheme.text}`}>
              Relation Tree
            </h2>
            <span className={`text-sm ${currentTheme.textSecondary}`}>
              {leaves} nodes • {depth} levels
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-3 py-1.5 text-sm ${currentTheme.button} ${currentTheme.text} rounded-lg transition-colors flex items-center space-x-1`}
            >
              <span>{isDarkMode ? "☀️" : "🌙"}</span>
              <span>{isDarkMode ? "Light" : "Dark"}</span>
            </button>
            <button
              onClick={() => setShowMiniMap(!showMiniMap)}
              className={`px-3 py-1.5 text-sm ${currentTheme.button} ${currentTheme.text} rounded-lg transition-colors`}
            >
              {showMiniMap ? "Hide" : "Show"} Overview
            </button>
            <button
              onClick={handleDialogOpen}
              className={`w-8 h-8 flex items-center justify-center ${currentTheme.button} hover:bg-red-500/20 ${currentTheme.textSecondary} hover:text-red-400 rounded-lg transition-colors`}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 relative" style={{ touchAction: "none" }}>
          <Zoom<SVGSVGElement>
            width={dynamicWidth}
            height={dynamicHeight}
            scaleXMin={0.1}
            scaleXMax={3}
            scaleYMin={0.1}
            scaleYMax={3}
            initialTransformMatrix={initialTransform}
            constrain={(transform, prevTransform) => {
              const maxTranslateX = dynamicWidth * 0.5;
              const maxTranslateY = dynamicHeight * 0.5;
              const minTranslateX = -dynamicWidth * 0.5;
              const minTranslateY = -dynamicHeight * 0.5;

              return {
                ...transform,
                translateX: Math.max(
                  minTranslateX,
                  Math.min(maxTranslateX, transform.translateX)
                ),
                translateY: Math.max(
                  minTranslateY,
                  Math.min(maxTranslateY, transform.translateY)
                ),
              };
            }}
          >
            {(zoom: any) => {
              return (
                <div
                  className="w-full h-full"
                  style={{
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                  }}
                >
                  <ZoomContent
                    dynamicHeight={dynamicHeight}
                    dynamicWidth={dynamicWidth}
                    rootNodeRef={rootNodeRef}
                    zoom={zoom}
                    zoomRef={zoomRef}
                  />
                  <svg
                    width="100%"
                    height="100%"
                    ref={svgRef}
                    viewBox={`0 0 ${dynamicWidth} ${dynamicHeight}`}
                    style={{
                      cursor: zoom.isDragging ? "grabbing" : "grab",
                      background: currentTheme.svgBg,
                      touchAction: "none",
                      userSelect: "none",
                      WebkitUserSelect: "none",
                      MozUserSelect: "none",
                      msUserSelect: "none",
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      zoom.dragStart(e);
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      zoom.dragMove(e);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      zoom.dragEnd(e);
                    }}
                    onWheel={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      // Only allow zoom if not using ctrl/cmd key (prevents browser zoom)
                      if (!event.ctrlKey && !event.metaKey) {
                        zoom.handleWheel(event);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      zoom.dragStart(e);
                    }}
                    onMouseMove={zoom.dragMove}
                    onMouseUp={zoom.dragEnd}
                    onMouseLeave={() => {
                      if (zoom.isDragging) zoom.dragEnd();
                    }}
                    onDoubleClick={(event) => {
                      event.preventDefault();
                      const point = localPoint(event) || { x: 0, y: 0 };
                      zoom.scale({ scaleX: 1.5, scaleY: 1.5, point });
                    }}
                  >
                    <defs>
                      <LinearGradient
                        id="links-gradient"
                        from={currentTheme.gradients.links.from}
                        to={currentTheme.gradients.links.to}
                      />
                      <LinearGradient
                        id="root-gradient"
                        from={currentTheme.gradients.root.from}
                        to={currentTheme.gradients.root.to}
                      />
                      <LinearGradient
                        id="node-gradient"
                        from={currentTheme.gradients.node.from}
                        to={currentTheme.gradients.node.to}
                      />
                      <LinearGradient
                        id="bg-gradient"
                        from={currentTheme.gradients.bg.from}
                        to={currentTheme.gradients.bg.to}
                      />
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <filter id="shadow">
                        <feDropShadow
                          dx="0"
                          dy="2"
                          stdDeviation="3"
                          floodColor={
                            isDarkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"
                          }
                        />
                      </filter>
                    </defs>

                    <rect
                      width={dynamicWidth}
                      height={dynamicHeight}
                      fill="url(#bg-gradient)"
                    />

                    <g ref={zoomRef} transform={zoom.toString()}>
                      <Group top={margin.top} left={margin.left}>
                        <Tree
                          root={hierarchy(relationData, (d: any) =>
                            d?.isExpanded ? null : d?.children
                          )}
                          size={[sizeWidth, sizeHeight]}
                          separation={(a: any, b: any) => {
                            const aHeight = getTextDimensions(
                              a.data.name || ""
                            ).height;
                            const bHeight = getTextDimensions(
                              b.data.name || ""
                            ).height;
                            const minSep = layout === "polar" ? 1.5 : 2;
                            const heightFactor = (aHeight + bHeight) / 50;
                            const depthAdjustment =
                              1 + Math.abs(a.depth - b.depth) * 0.3;
                            const layoutAdjustment =
                              layout === "polar" ? 0.8 : 1;
                            return (
                              Math.max(minSep, heightFactor) *
                              depthAdjustment *
                              layoutAdjustment
                            );
                          }}
                        >
                          {(tree: any) => (
                            <Group top={origin.y} left={origin.x}>
                              {/* Connecting Lines */}
                              {tree.links().map((link: any, i: any) => (
                                <LinkComponent
                                  key={i}
                                  data={link}
                                  percent={stepPercent}
                                  stroke="#ec4899"
                                  strokeWidth="2"
                                  fill="none"
                                  opacity={0.8}
                                />
                              ))}

                              {/* Fallback lines if LinkComponent fails */}
                              {tree.links().map((link: any, i: any) => {
                                const { source, target } = link;
                                let sourceX, sourceY, targetX, targetY;

                                if (layout === "polar") {
                                  const [sourceRadialX, sourceRadialY] =
                                    pointRadial(source.x, source.y);
                                  const [targetRadialX, targetRadialY] =
                                    pointRadial(target.x, target.y);
                                  sourceX = sourceRadialX;
                                  sourceY = sourceRadialY;
                                  targetX = targetRadialX;
                                  targetY = targetRadialY;
                                } else if (orientation === "vertical") {
                                  sourceX = source.x;
                                  sourceY = source.y;
                                  targetX = target.x;
                                  targetY = target.y;
                                } else {
                                  sourceX = source.y;
                                  sourceY = source.x;
                                  targetX = target.y;
                                  targetY = target.x;
                                }

                                return (
                                  <line
                                    key={`fallback-${i}`}
                                    x1={sourceX}
                                    y1={sourceY}
                                    x2={targetX}
                                    y2={targetY}
                                    stroke="#8b5cf6"
                                    strokeWidth="1.5"
                                    opacity={0.6}
                                    strokeDasharray="none"
                                  />
                                );
                              })}

                              {tree.descendants().map((node: any, key: any) => {
                                const nodeName = node.data.name || "";
                                const isLabel = node.data?.type === "label";
                                const textDimensions = getTextDimensions(
                                  nodeName,
                                  11
                                );
                                const paddingX = 20;
                                const paddingY = 12;
                                const width = Math.max(
                                  100,
                                  textDimensions.width + 2 * paddingX
                                );
                                const height = Math.max(
                                  36,
                                  textDimensions.height + 2 * paddingY
                                );

                                let top: number;
                                let left: number;
                                if (layout === "polar") {
                                  const [radialX, radialY] = pointRadial(
                                    node.x,
                                    node.y
                                  );
                                  top = radialY;
                                  left = radialX;
                                } else if (orientation === "vertical") {
                                  top = node.y;
                                  left = node.x;
                                } else {
                                  top = node.x;
                                  left = node.y;
                                }

                                return (
                                  <Group top={top} left={left} key={key}>
                                    {node.depth === 0 ? (
                                      <rect
                                        ref={rootNodeRef}
                                        width={width}
                                        height={height}
                                        x={-width / 2}
                                        y={-height / 2}
                                        fill="url(#root-gradient)"
                                        rx={height / 2}
                                        style={{
                                          filter: "url(#shadow)",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => handleNodeClick(node)}
                                      />
                                    ) : (
                                      <rect
                                        height={height}
                                        width={width}
                                        y={-height / 2}
                                        x={-width / 2}
                                        fill={
                                          isLabel
                                            ? isDarkMode
                                              ? "rgba(15, 23, 42, 0.9)"
                                              : "rgba(255, 255, 255, 0.9)"
                                            : isDarkMode
                                            ? "rgba(30, 41, 59, 0.9)"
                                            : "rgba(248, 250, 252, 0.9)"
                                        }
                                        stroke={
                                          isLabel
                                            ? "#10b981"
                                            : node.data.children
                                            ? "#06b6d4"
                                            : "#8b5cf6"
                                        }
                                        strokeWidth={2}
                                        strokeDasharray={
                                          node.data.children ? "0" : "4,4"
                                        }
                                        rx={
                                          isLabel
                                            ? 8
                                            : node.data.children
                                            ? 8
                                            : 18
                                        }
                                        style={{
                                          filter: "url(#shadow)",
                                          cursor: "pointer",
                                          transition: "all 0.2s ease",
                                        }}
                                        onClick={() => handleNodeClick(node)}
                                      />
                                    )}
                                    <text
                                      dy=".33em"
                                      fontSize={isLabel ? 12 : 11}
                                      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                                      fontWeight={
                                        node.depth === 0 ? "600" : "500"
                                      }
                                      textAnchor="middle"
                                      style={{
                                        pointerEvents: "none",
                                        textShadow: isDarkMode
                                          ? "0 1px 2px rgba(0,0,0,0.5)"
                                          : "0 1px 2px rgba(255,255,255,0.5)",
                                      }}
                                      fill={
                                        isLabel
                                          ? currentTheme.nodeColors.label
                                          : node.depth === 0
                                          ? currentTheme.nodeColors.root
                                          : node.children
                                          ? currentTheme.nodeColors.branch
                                          : currentTheme.nodeColors.leaf
                                      }
                                    >
                                      {nodeName}
                                    </text>
                                    {node.data.children && (
                                      <circle
                                        cx={width / 2 - 8}
                                        cy={-height / 2 + 8}
                                        r={3}
                                        fill={
                                          node.data.isExpanded
                                            ? "#ef4444"
                                            : "#10b981"
                                        }
                                        style={{ pointerEvents: "none" }}
                                      />
                                    )}
                                  </Group>
                                );
                              })}
                            </Group>
                          )}
                        </Tree>
                      </Group>
                    </g>
                  </svg>

                  {/* Enhanced Control Panel */}
                  <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
                    <div
                      className={`flex items-center space-x-2 ${currentTheme.panelBg} backdrop-blur-sm rounded-lg p-2 ${currentTheme.border} border`}
                    >
                      <button
                        onClick={() => zoom.scale({ scaleX: 1.3, scaleY: 1.3 })}
                        className={`w-8 h-8 flex items-center justify-center ${currentTheme.button} ${currentTheme.buttonHover} ${currentTheme.text} rounded-md transition-colors`}
                        title="Zoom In"
                      >
                        +
                      </button>
                      <button
                        onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}
                        className={`w-8 h-8 flex items-center justify-center ${currentTheme.button} ${currentTheme.buttonHover} ${currentTheme.text} rounded-md transition-colors`}
                        title="Zoom Out"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleResetToFit(zoom)}
                        className={`px-3 py-1.5 text-sm ${currentTheme.button} ${currentTheme.buttonHover} ${currentTheme.text} rounded-md transition-colors`}
                        title="Reset View"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => centerOnRoot(zoom)}
                        className={`px-3 py-1.5 text-sm ${currentTheme.button} hover:bg-purple-500/20 ${currentTheme.text} rounded-md transition-colors`}
                        title="Center on Root"
                      >
                        🎯
                      </button>
                    </div>
                  </div>

                  {/* Layout Controls */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <div
                      className={`${currentTheme.panelBg} backdrop-blur-sm rounded-lg p-3 ${currentTheme.border} border`}
                    >
                      <div
                        className={`text-sm ${currentTheme.textSecondary} mb-2`}
                      >
                        Layout
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setLayout("cartesian")}
                          className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                            layout === "cartesian"
                              ? "bg-blue-500 text-white"
                              : `${currentTheme.button} ${currentTheme.textSecondary} hover:bg-slate-700`
                          }`}
                        >
                          Tree
                        </button>
                        <button
                          onClick={() => setLayout("polar")}
                          className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                            layout === "polar"
                              ? "bg-blue-500 text-white"
                              : `${currentTheme.button} ${currentTheme.textSecondary} hover:bg-slate-700`
                          }`}
                        >
                          Radial
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mini Map */}
                  {showMiniMap && (
                    <div
                      className={`absolute top-20 right-4 w-48 h-32 ${currentTheme.panelBg} backdrop-blur-sm rounded-lg ${currentTheme.border} border overflow-hidden`}
                    >
                      <div className="w-full h-full relative">
                        <svg
                          width="100%"
                          height="100%"
                          viewBox={`0 0 ${dynamicWidth} ${dynamicHeight}`}
                          className="opacity-60"
                        >
                          <rect
                            width={dynamicWidth}
                            height={dynamicHeight}
                            fill={isDarkMode ? "#1e293b" : "#f1f5f9"}
                          />
                          <g
                            transform={`translate(${margin.left}, ${margin.top})`}
                          >
                            {/* Simplified tree structure for minimap */}
                            <circle cx={0} cy={0} r={4} fill="#ec4899" />
                          </g>
                        </svg>
                        <div
                          className={`absolute top-1 left-1 text-xs ${currentTheme.textSecondary}`}
                        >
                          Overview
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Bar */}
                  <div
                    className={`absolute bottom-4 right-4 ${currentTheme.panelBg} backdrop-blur-sm rounded-lg px-3 py-1.5 ${currentTheme.border} border`}
                  >
                    <div className={`text-xs ${currentTheme.textSecondary}`}>
                      Scale: {(zoom.transformMatrix.scaleX * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              );
            }}
          </Zoom>
        </div>
      </div>
    </BootstrapDialog>
  );
};

export default ShowRelations;
