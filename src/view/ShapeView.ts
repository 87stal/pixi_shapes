import {ShapeType} from '../model/ShapeModel';
import {AppController} from "../controller/ShapeController";
import {Shape} from "./Shape";

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
    createShape(x?: number, y?: number): Shape {
        const color = Math.random() * 0xffffff;
        const randomIndex = Math.floor(Math.random() * shapeTypes.length);
        const type = shapeTypes[randomIndex];
        const posX = x !== undefined ? x : Math.random() * this.controller.app.canvas.width;
        const posY = y !== undefined ? y : -SHAPE_SIZE;
        let shapeConfig = {
            size: SHAPE_SIZE,
            color: color,
            type: type,
            x: posX,
            y: posY
        };
        let shape: Shape = new Shape(shapeConfig);

        shape.drawShape(shape);
        this.controller.app.stage.addChild(shape);
        return shape;
    }

    /**
     * Updates the position of each shape based on gravity, and removes shapes out of bounds
     * @param {Shape[]} shapes
     * @param {number} gravityDelta
     */
    update(shapes: Shape[], gravityDelta: number) {
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
