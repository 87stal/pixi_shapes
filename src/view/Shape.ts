import PIXI, {Graphics} from "pixi.js";
import {ShapeConfig, ShapeType} from "../model/ShapeModel";

export class Shape extends Graphics {
    type: number;
    color: number;
    size: number;
    getArea: () => number;

    constructor(config: ShapeConfig) {
        super();
        this.type = config.type;
        this.color = config.color;
        this.x = config.x;
        this.y = config.y;
        this.size = config.size;
        this.getArea = this.getAreaFunction();
    }

    /**
     * Draws a shape using predefined strategies based on shape type
     * @param {Graphics} shape
     * @private
     */
    drawShape(shape: Shape) {
        const drawingStrategies: Record<ShapeType, () => void> = {
            [ShapeType.Circle]: () => shape.circle(0, 0, shape.size),
            [ShapeType.Ellipse]: () => shape.ellipse(0, 0, shape.size, shape.size * 0.6),
            [ShapeType.Random]: () => this.drawRandomShape(shape),
            [ShapeType.Triangle]: () => this.drawPolygonShape(shape),
            [ShapeType.Square]: () => this.drawPolygonShape(shape),
            [ShapeType.Pentagon]: () => this.drawPolygonShape(shape),
            [ShapeType.Hexagon]: () => this.drawPolygonShape(shape),
        };

        drawingStrategies[shape.type as ShapeType]?.();
        shape.fill(shape.color);
        shape.x = shape.x;
        shape.y = shape.y;
        shape.eventMode = "static";
    }

    /**
     * Returns the function to calculate the area depending on the shape type
     * @private
     */
    private getAreaFunction(): () => number {
        switch (this.type) {
            case ShapeType.Circle:
                return () => Math.PI * this.size ** 2;
            case ShapeType.Ellipse:
                return () => Math.PI * this.size * this.size * 0.6;
            case ShapeType.Random:
                return () => Math.PI * this.size ** 2 * 0.5; // approximate area
            default:
                const angle = Math.PI / this.type;
                return () => (this.type * Math.pow(this.size, 2)) / (4 * Math.tan(angle));
        }
    }

    /**
     * Draws a regular polygon
     * @param {Graphics} shape
     * @private
     */
    private drawPolygonShape(shape: Shape) {
        const angleStep = (2 * Math.PI) / shape.type;
        shape.moveTo(shape.size * Math.cos(0), shape.size * Math.sin(0));

        for (let i = 1; i <= shape.type; i++) {
            shape.lineTo(
                shape.size * Math.cos(i * angleStep),
                shape.size * Math.sin(i * angleStep)
            );
        }
    }

    /**
     * Draws a randomly generated blob-like shape using quadratic curves
     * @param {Graphics} shape
     * @private
     */
    private drawRandomShape(shape: Shape) {
        const numPoints = 8 + Math.floor(Math.random() * 5);
        const points: PIXI.Point[] = [];

        for (let i = 0; i < numPoints; i++) {
            const radius = shape.size * (0.8 + Math.random() * 0.4);
            const angle = (i / numPoints) * Math.PI * 2;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            points.push(new PIXI.Point(x, y));
        }

        shape.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i += 2) {
            const cp = points[i];
            const ep = points[i + 1] || points[0];
            shape.quadraticCurveTo(cp.x, cp.y, ep.x, ep.y);
        }
        shape.quadraticCurveTo(points[points.length - 1].x, points[points.length - 1].y, points[0].x, points[0].y);
    }
}