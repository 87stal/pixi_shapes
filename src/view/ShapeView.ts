import {Shape, ShapeModel, ShapeType} from '../model/ShapeModel';
import {AppController} from "../controller/ShapeController";
import PIXI, {Graphics} from "pixi.js";

// List of possible shape types
const shapeTypes = [
    ShapeType.Circle,
    ShapeType.Ellipse,
    ShapeType.Triangle,
    ShapeType.Square,
    ShapeType.Pentagon,
    ShapeType.Hexagon,
    ShapeType.Random,
];

const SHAPE_SIZE = 30;

// Interface for shape graphics that includes an optional getArea function
export interface ShapeWithArea extends PIXI.Graphics {
    getArea?: () => number;
}

export class ShapeView {
    controller: AppController;

    constructor(controller: AppController) {
        this.controller = controller;
    }

    /**
     * Creates a new shape with a given (or random) position and adds it to the stage
     * @param {number} x
     * @param {number} y
     */
    createShape(x?: number, y?: number): Graphics {
        const color = Math.random() * 0xffffff;
        const randomIndex = Math.floor(Math.random() * shapeTypes.length);
        const type = shapeTypes[randomIndex];
        const posX = x !== undefined ? x : Math.random() * this.controller.app.canvas.width;
        const posY = y !== undefined ? y : -SHAPE_SIZE;
        let shape: Graphics = new Graphics();
        let shapeConfig = {
            size: SHAPE_SIZE,
            color: color,
            type: type,
            x: posX,
            y: posY
        };
        this.drawShape(shape, shapeConfig);
        this.controller.app.stage.addChild(shape);
        return shape;
    }

    /**
     * Draws a shape using predefined strategies based on shape type
     * @param {Graphics} shape
     * @param {Shape} config
     * @private
     */
    private drawShape(shape: Graphics, config: Shape) {
        const drawingStrategies: Record<ShapeType, () => void> = {
            [ShapeType.Circle]: () => shape.circle(0, 0, config.size),
            [ShapeType.Ellipse]: () => shape.ellipse(0, 0, config.size, config.size * 0.6),
            [ShapeType.Random]: () => this.drawRandomShape(shape, config),
            [ShapeType.Triangle]: () => this.drawPolygonShape(shape, config),
            [ShapeType.Square]: () => this.drawPolygonShape(shape, config),
            [ShapeType.Pentagon]: () => this.drawPolygonShape(shape, config),
            [ShapeType.Hexagon]: () => this.drawPolygonShape(shape, config),
        };

        drawingStrategies[config.type]?.();
        shape.fill(config.color);
        shape.x = config.x;
        shape.y = config.y;
        shape.eventMode = "static";

        // Assign area calculation function
        (shape as any).getArea = this.getAreaFunction(config);
    }

    /**
     * Returns the function to calculate the area depending on the shape type
     * @param {Shape} config
     * @private
     */
    private getAreaFunction(config: Shape): () => number {
        switch (config.type) {
            case ShapeType.Circle:
                return () => Math.PI * config.size ** 2;
            case ShapeType.Ellipse:
                return () => Math.PI * config.size * config.size * 0.6;
            case ShapeType.Random:
                return () => Math.PI * config.size ** 2 * 0.5; // приблизна площа
            default:
                const angle = Math.PI / config.type;
                return () => (config.type * Math.pow(config.size, 2)) / (4 * Math.tan(angle));
        }
    }

    /**
     * Draws a regular polygon
     * @param {Graphics} shape
     * @param {Shape} config
     * @private
     */
    private drawPolygonShape(shape: Graphics, config: Shape) {
        const angleStep = (2 * Math.PI) / config.type;
        shape.moveTo(config.size * Math.cos(0), config.size * Math.sin(0));

        for (let i = 1; i <= config.type; i++) {
            shape.lineTo(
                config.size * Math.cos(i * angleStep),
                config.size * Math.sin(i * angleStep)
            );
        }
    }

    /**
     * Draws a randomly generated blob-like shape using quadratic curves
     * @param {Graphics} shape
     * @param {Shape} config
     * @private
     */
    private drawRandomShape(shape: Graphics, config: Shape) {
        const numPoints = 8 + Math.floor(Math.random() * 5);
        const points: PIXI.Point[] = [];

        for (let i = 0; i < numPoints; i++) {
            const radius = config.size * (0.8 + Math.random() * 0.4);
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

    /**
     * Updates the position of each shape based on gravity, and removes shapes out of bounds
     * @param {Graphics[]} shapes
     * @param {number} gravityDelta
     */
    update(shapes: Graphics[], gravityDelta: number) {
        for (let i = shapes.length - 1; i >= 0; i--) {
            const shape = shapes[i];
            shape.y += gravityDelta;

            if (shape.y > this.controller.app.canvas.height) {
                shape.removeFromParent();
                shapes.splice(i, 1);
            }
        }
    }
}
