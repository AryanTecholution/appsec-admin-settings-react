import React, { useState, useRef, useEffect, useMemo } from "react";
import { Group } from "@visx/group";
import { hierarchy, Tree } from "@visx/hierarchy";
import { LinearGradient } from "@visx/gradient";
import { pointRadial } from "d3-shape";
import { Zoom } from "@visx/zoom";
import { localPoint } from "@visx/event";
import getLinkComponent from "./getLinkComponent";
import useForceUpdate from "./useForceUpdate";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import { tree } from "d3-hierarchy";
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
    // margin = defaultMargin,
    handleDialogOpen,
    open,
    relationData,
}) => {
    const [layout, setLayout] = useState<string>("cartesian");
    const [orientation, setOrientation] = useState<string>("horizontal");
    const [linkType, setLinkType] = useState<string>("diagonal");
    const [stepPercent, setStepPercent] = useState<number>(0.5);
    const forceUpdate = useForceUpdate();
    const svgRef = useRef<SVGSVGElement>(null);
    const zoomRef = useRef<any>(null);
    const rootNodeRef = useRef<any>(null);
    const root = hierarchy(relationData);
    const depth = root.height + 1;
    const leaves = root.leaves().length;
    const heightEstimate = leaves * 80; // vertical space per leaf
    const widthEstimate = depth * 300; // horizontal space per level

    const dynamicHeight = Math.max(600, heightEstimate);
    const dynamicWidth = Math.max(1300, widthEstimate);

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
        sizeHeight = Math.min(innerWidth, innerHeight) / 2;
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
    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        "& .MuiDialogContent-root": {
            padding: theme.spacing(2),
        },
        "& .MuiDialogActions-root": {
            padding: theme.spacing(1),
        },
        "& .MuiPaper-root": {
            width: "80vw", // Use most of the viewport width
            maxWidth: "80vw", // Remove default width restrictions
            height: "80vh", // Use most of the viewport height
            maxHeight: "80vh", // Allow for very tall trees
        },
    }));

    // Function to calculate text dimensions (safely for SSR/Client hydration)
    const getTextDimensions = (
        text: string,
        fontSize: number = 10
    ): { width: number; height: number } => {
        // Safe check for browser environment
        if (typeof window !== "undefined") {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            if (context) {
                context.font = `${fontSize}px Arial`;
                const metrics = context.measureText(text || "");
                return {
                    width: metrics.width,
                    height: fontSize, // Approximate height based on font size
                };
            }
        }
        // Default fallback for SSR or if canvas is not available
        return { width: text ? text.length * 5 + 20 : 50, height: fontSize };
    };

    const rootNodeWidth = getTextDimensions(relationData.name || "").width + 30;
    const margin = {
        top: 50,
        left: Math.max(150, rootNodeWidth / 2 + 50) + 10,
        right: 50,
        bottom: 50,
    };

    const initialTransform = useMemo(
        () => ({
            scaleX: 0.8,
            scaleY: 0.8,
            translateX: 0, // 20px left padding
            translateY: 0, // center vertically
            skewX: 0,
            skewY: 0,
        }),
        [relationData, dynamicWidth, dynamicHeight]
    );

    return (
        <BootstrapDialog
            onClose={handleDialogOpen}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <div
                className="tree-container relative bg-[#272b4d] flex justify-center items-center"
                style={{ width: "100%", height: "100%", overflow: "hidden" }}
            >
                <Zoom<SVGSVGElement>
                    width={dynamicWidth}
                    height={dynamicHeight}
                    scaleXMin={0.1}
                    scaleXMax={2}
                    scaleYMin={0.1}
                    scaleYMax={2}
                    initialTransformMatrix={initialTransform}
                    // ref={zoomRef}
                >
                    {(zoom) => {
                        
                        return (
                            <div>
                                <ZoomContent dynamicHeight={dynamicHeight} dynamicWidth={dynamicWidth} rootNodeRef={rootNodeRef} zoom={zoom} zoomRef={zoomRef}/>
                                <svg
                                    width={dynamicWidth}
                                    height={dynamicHeight}
                                    ref={
                                        svgRef as React.RefObject<SVGSVGElement>
                                    }
                                    style={{
                                        cursor: zoom.isDragging
                                            ? "grabbing"
                                            : "grab",
                                    }}
                                    onTouchStart={zoom.dragStart}
                                    onTouchMove={zoom.dragMove}
                                    onTouchEnd={zoom.dragEnd}
                                    onWheel={zoom.handleWheel}
                                    onMouseDown={zoom.dragStart}
                                    onMouseMove={zoom.dragMove}
                                    onMouseUp={zoom.dragEnd}
                                    onMouseLeave={() => {
                                        if (zoom.isDragging) zoom.dragEnd();
                                    }}
                                    onDoubleClick={(event) => {
                                        const point = localPoint(event) || {
                                            x: 0,
                                            y: 0,
                                        };
                                        zoom.scale({
                                            scaleX: 1.1,
                                            scaleY: 1.1,
                                            point,
                                        });
                                    }}
                                >
                                    <LinearGradient
                                        id="links-gradient"
                                        from="#fd9b93"
                                        to="#fe6e9e"
                                    />
                                    <rect
                                        width={dynamicWidth}
                                        height={dynamicHeight}
                                        rx={0}
                                        fill="#272b4d"
                                    />
                                    <g
                                        ref={zoomRef}
                                        transform={zoom.toString()}
                                    >
                                        <Group
                                            top={margin.top}
                                            left={margin.left}
                                        >
                                            <Tree
                                                root={hierarchy(
                                                    relationData,
                                                    (d) =>
                                                        d?.isExpanded
                                                            ? null
                                                            : d?.children
                                                )}
                                                size={[sizeWidth, sizeHeight]}
                                                separation={(a, b) => {
                                                    const aHeight =
                                                        getTextDimensions(
                                                            a.data.name || ""
                                                        ).height;
                                                    const bHeight =
                                                        getTextDimensions(
                                                            b.data.name || ""
                                                        ).height;

                                                    const minSep = 1.5;
                                                    const heightFactor =
                                                        (aHeight + bHeight) /
                                                        60; // Adjust spacing
                                                    const depthAdjustment =
                                                        1 +
                                                        Math.abs(
                                                            a.depth - b.depth
                                                        ) *
                                                            0.5;

                                                    return (
                                                        Math.max(
                                                            minSep,
                                                            heightFactor
                                                        ) * depthAdjustment
                                                    );
                                                }}
                                            >
                                                {(tree) => (
                                                    <Group
                                                        top={origin.y}
                                                        left={origin.x}
                                                    >
                                                        {tree
                                                            .links()
                                                            .map((link, i) => (
                                                                <LinkComponent
                                                                    key={i}
                                                                    data={link}
                                                                    percent={
                                                                        stepPercent
                                                                    }
                                                                    stroke="rgb(254,110,158,0.6)"
                                                                    strokeWidth="1"
                                                                    fill="none"
                                                                />
                                                            ))}

                                                        {tree
                                                            .descendants()
                                                            .map(
                                                                (node, key) => {
                                                                    const nodeName =
                                                                        node
                                                                            .data
                                                                            .name ||
                                                                        "";
                                                                    const isLabel =
                                                                        node
                                                                            .data
                                                                            ?.type as string;
                                                                    const textDimensions =
                                                                        getTextDimensions(
                                                                            nodeName,
                                                                            10
                                                                        );
                                                                    const paddingX = 15; // Padding on left and right
                                                                    const paddingY = 10; // Padding on top and bottom
                                                                    const width =
                                                                        Math.max(
                                                                            80,
                                                                            textDimensions.width +
                                                                                2 *
                                                                                    paddingX
                                                                        );
                                                                    const height =
                                                                        Math.max(
                                                                            30,
                                                                            textDimensions.height +
                                                                                2 *
                                                                                    paddingY
                                                                        );

                                                                    let top: number;
                                                                    let left: number;
                                                                    if (
                                                                        layout ===
                                                                        "polar"
                                                                    ) {
                                                                        const [
                                                                            radialX,
                                                                            radialY,
                                                                        ] =
                                                                            pointRadial(
                                                                                node.x,
                                                                                node.y
                                                                            );
                                                                        top =
                                                                            radialY;
                                                                        left =
                                                                            radialX;
                                                                    } else if (
                                                                        orientation ===
                                                                        "vertical"
                                                                    ) {
                                                                        top =
                                                                            node.y;
                                                                        left =
                                                                            node.x;
                                                                    } else {
                                                                        top =
                                                                            node.x;
                                                                        left =
                                                                            node.y;
                                                                    }

                                                                    const rectWidth =
                                                                        width;
                                                                    const rectHeight =
                                                                        height;

                                                                    return (
                                                                        <Group
                                                                            top={
                                                                                top
                                                                            }
                                                                            left={
                                                                                left
                                                                            }
                                                                            key={
                                                                                key
                                                                            }
                                                                        >
                                                                            {node.depth ===
                                                                            0 ? (
                                                                                <rect
                                                                                    ref={
                                                                                        rootNodeRef
                                                                                    }
                                                                                    width={
                                                                                        rectWidth
                                                                                    }
                                                                                    height={
                                                                                        rectHeight
                                                                                    }
                                                                                    x={
                                                                                        -rectWidth /
                                                                                        2
                                                                                    }
                                                                                    y={
                                                                                        -rectHeight /
                                                                                        2
                                                                                    }
                                                                                    fill="url('#links-gradient')"
                                                                                    rx={
                                                                                        20
                                                                                    }
                                                                                    // onClick={() => {
                                                                                    //     node.data.isExpanded = !node.data.isExpanded;
                                                                                    //     forceUpdate();
                                                                                    // }}
                                                                                />
                                                                            ) : (
                                                                                <rect
                                                                                    height={
                                                                                        rectHeight
                                                                                    }
                                                                                    width={
                                                                                        rectWidth
                                                                                    }
                                                                                    y={
                                                                                        -rectHeight /
                                                                                        2
                                                                                    }
                                                                                    x={
                                                                                        -rectWidth /
                                                                                        2
                                                                                    }
                                                                                    fill={
                                                                                        isLabel ===
                                                                                        "label"
                                                                                            ? "#272b4d"
                                                                                            : "#272b4d"
                                                                                    }
                                                                                    stroke={
                                                                                        isLabel ===
                                                                                        "label"
                                                                                            ? "green"
                                                                                            : node
                                                                                                  .data
                                                                                                  .children
                                                                                            ? "#03c0dc"
                                                                                            : "#26deb0"
                                                                                    }
                                                                                    strokeWidth={
                                                                                        1
                                                                                    }
                                                                                    strokeDasharray={
                                                                                        node
                                                                                            .data
                                                                                            .children
                                                                                            ? "0"
                                                                                            : "2,2"
                                                                                    }
                                                                                    strokeOpacity={
                                                                                        node
                                                                                            .data
                                                                                            .children
                                                                                            ? 1
                                                                                            : 0.6
                                                                                    }
                                                                                    rx={
                                                                                        node
                                                                                            .data
                                                                                            .children
                                                                                            ? 4
                                                                                            : 10
                                                                                    }
                                                                                    // onClick={() => {
                                                                                    //     node.data.isExpanded = !node.data.isExpanded;
                                                                                    //     forceUpdate();
                                                                                    // }}
                                                                                />
                                                                            )}
                                                                            <text
                                                                                dy=".33em"
                                                                                fontSize={
                                                                                    isLabel ===
                                                                                    "label"
                                                                                        ? 11
                                                                                        : 10
                                                                                }
                                                                                fontFamily="Arial"
                                                                                textAnchor="middle"
                                                                                style={{
                                                                                    pointerEvents:
                                                                                        "none",
                                                                                }}
                                                                                fill={
                                                                                    isLabel ===
                                                                                    "label"
                                                                                        ? "orange"
                                                                                        : node.depth ===
                                                                                          0
                                                                                        ? "white"
                                                                                        : node.children
                                                                                        ? "white"
                                                                                        : "#26deb0"
                                                                                }
                                                                            >
                                                                                {
                                                                                    nodeName
                                                                                }
                                                                            </text>
                                                                        </Group>
                                                                    );
                                                                }
                                                            )}
                                                    </Group>
                                                )}
                                            </Tree>
                                        </Group>
                                    </g>
                                </svg>
                                <div
                                    className="controls z-10"
                                    style={{
                                        position: "absolute",
                                        bottom: 10,
                                        left: 10,
                                    }}
                                >
                                    <button
                                        onClick={() =>
                                            zoom.scale({
                                                scaleX: 1.2,
                                                scaleY: 1.2,
                                            })
                                        }
                                        style={{
                                            margin: "0 5px",
                                            padding: "5px 10px",
                                            background: "#555",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "3px",
                                        }}
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() =>
                                            zoom.scale({
                                                scaleX: 0.8,
                                                scaleY: 0.8,
                                            })
                                        }
                                        style={{
                                            margin: "0 5px",
                                            padding: "5px 10px",
                                            background: "#555",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "3px",
                                        }}
                                    >
                                        -
                                    </button>
                                    {/* <button
                                        onClick={() => zoom.reset()}
                                        style={{
                                            margin: "0 5px",
                                            padding: "5px 10px",
                                            background: "#555",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "3px",
                                        }}
                                    >
                                        Reset
                                    </button> */}
                                </div>
                            </div>
                        );
                    }}
                </Zoom>
            </div>
        </BootstrapDialog>
    );
};

export default ShowRelations;
