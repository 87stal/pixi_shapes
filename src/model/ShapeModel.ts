
import {Shape} from "../view/Shape";

/**
 * Enum representing different types of shapes.
 * - The number corresponds to the number of sides for polygons.
 * - Circle is 7, Ellipse is 8, and Random represents custom irregular shapes.
 */
export enum ShapeType {
    Triangle = 3,
    Square = 4,
    Pentagon = 5,
    Hexagon = 6,
    Circle = 7,
    Ellipse = 8,
    Random = 9
}

// Interface representing the shape configuration used for rendering.
export interface ShapeConfig {
    type: ShapeType;
    color: number;
    x: number;
    y: number;
    size: number;
    points?: { x: number, y: number }[];
}

export class ShapeModel {

    shapesPerSecond: number = 1;
    shapes: Shape[] = [];
    gravity: number = 1;

    constructor() {
    }

    /**
     * Set the number of shapes to be generated per second.
     * @param count number of shapes per second
     */
    setShapePerSecond(count: number) {
        this.shapesPerSecond = count;
    }

    /**
     * Get the current number of shapes to generate per second.
     * return number
     */

    getShapePerSecond() {
        return this.shapesPerSecond;
    }

    /**
     * Add a shape to the model's shape list.
     * @param {Shape}shape
     */
    setShapes(shape: Shape) {
        this.shapes.push(shape);
    }

    /**
     * Get all current shapes from the model.
     * @return {Shape[]}
     */
    getShapes(): Shape[] {
        return this.shapes;
    }

    /**
     * Remove a shape from the shape list by index.
     * @param index
     */
    removeShapeFromList(index: number) {
        this.shapes.splice(index, 1);
    }

    /**
     * Set the gravity value used to control falling speed.
     * @param {number} value
     */
    setGravity(value: number) {
        this.gravity = value;
    }

    /**
     * Get the current gravity value.
     * @return {number}
     */
    getGravity(): number {
        return this.gravity;
    }
}
