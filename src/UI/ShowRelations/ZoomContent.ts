import React, { useEffect } from 'react'

export type ZoomContentProps = {
    zoom: any,
    zoomRef: any,
    dynamicWidth: number,
    rootNodeRef: any
    dynamicHeight: number
};
const ZoomContent: React.FC<ZoomContentProps> = ({ dynamicHeight, zoom, zoomRef, dynamicWidth, rootNodeRef }) => {

    useEffect(() => {
        if (zoomRef.current) {
            const bbox = zoomRef.current.getBBox();
            const rootRect =
                rootNodeRef.current.getBoundingClientRect();
            const svgRect =
                zoomRef.current?.getBoundingClientRect();
            // Padding from left
            const paddingLeft = 100;

            // Always zoom to 0.8
            const scale = 0.8;

            if (rootRect && svgRect) {
                let rootLeft = Math.min(rootRect.left, 0);
                let translateX =
                    zoom.transformMatrix.translateX +
                    (-rootLeft + rootRect.width);
                translateX =
                    dynamicWidth < 1500
                        ? translateX
                        : translateX + paddingLeft;
                console.log(
                    "debug",
                    translateX,
                    svgRect,
                    rootRect
                );
                // Translate Y to center vertically
                const centerY =
                    (dynamicHeight - bbox.height * scale) /
                    2;
                const translateY =
                    -bbox.y * scale + centerY;

                zoom.setTransformMatrix({
                    scaleX: scale,
                    scaleY: scale,
                    translateX,
                    translateY,
                    skewX: 0,
                    skewY: 0,
                });
            }
        }
    }, []);
    return null
}

export default ZoomContent