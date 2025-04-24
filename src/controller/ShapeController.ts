import PIXI, {Graphics} from 'pixi.js';
import {ShapeModel} from "../model/ShapeModel";
import {ShapeView} from "../view/ShapeView";
import {Shape} from "../view/Shape";

const GRAVITY_STEP = 0.2;
const SHAPE_PER_SEC_STEP = 1;

export class AppController {
    app: PIXI.Application;
    model: ShapeModel;
    view: ShapeView;

    private shapeTimer = 0;
    private shapeInterval: any;

    constructor(app: PIXI.Application, model: ShapeModel) {
        this.app = app;
        this.model = model;
        this.view = new ShapeView(this);

        // Enable interaction for the stage
        this.app.stage.eventMode = "static";
        app.stage.hitArea = app.screen;

        // Attach the main update loop
        this.app.ticker.add((delta) => this.update(delta.deltaTime));

        // Bind control buttons to UI
        this.bindControls();
        // Start shape generation at a fixed interval
        this.shapeInterval = setInterval(this.generateShape.bind(this), 1000 / this.model.getShapePerSecond());


        // Handle click to generate a new shape unless clicking on existing shape
        this.app.stage.on('pointerdown', (event: PIXI.FederatedPointerEvent) => {
            // Ignore clicks on shapes
            if (event.target && (event.target as any) instanceof Graphics) {
                return;
            }

            const x = event.global.x;
            const y = event.global.y;
            this.generateShape(x, y);
        });
        // Generate the first shape immediately
        this.generateShape();
    }

    // Binds control buttons to adjust shape rate and gravity
    private bindControls(): void {
        const increaseRate = document.getElementById('increase-rate');
        const decreaseRate = document.getElementById('decrease-rate');
        const increaseGravity = document.getElementById('increase-gravity');
        const decreaseGravity = document.getElementById('decrease-gravity');

        const shapePerSecValue = document.getElementById('shape-per-sec-count') as HTMLElement;
        const gravityValue = document.getElementById('gravity-value') as HTMLElement;

        increaseRate?.addEventListener('click', () => {
            let shapePerSec = this.model.getShapePerSecond();
            shapePerSec++;
            shapePerSecValue.textContent = shapePerSec.toString();
            this.model.setShapePerSecond(shapePerSec);
            this.updateShapeInterval();
        });

        decreaseRate?.addEventListener('click', () => {
            let shapePerSec = this.model.getShapePerSecond();
            if (shapePerSec > SHAPE_PER_SEC_STEP) {
                shapePerSec--;
                this.model.setShapePerSecond(shapePerSec);
                shapePerSecValue.textContent = shapePerSec.toString();
                this.updateShapeInterval();
            }
        });

        increaseGravity?.addEventListener('click', () => {
            let currentGravity = this.model.getGravity();
                currentGravity += GRAVITY_STEP;
                this.model.setGravity(currentGravity);
                gravityValue.textContent = currentGravity.toFixed(1);
        });

        decreaseGravity?.addEventListener('click', () => {
            let currentGravity = this.model.getGravity();
            if (currentGravity > GRAVITY_STEP) {
                currentGravity -= GRAVITY_STEP;
                this.model.setGravity(parseFloat(currentGravity.toFixed(1)));
                gravityValue.textContent = currentGravity.toFixed(1);
            }
        });
    }

    // Updates the shape generation interval based on the new rate
    private updateShapeInterval(): void {
        clearInterval(this.shapeInterval);
        this.shapeInterval = setInterval(this.generateShape.bind(this), 1000 / this.model.getShapePerSecond());
    }

    /**
     * Generates a shape at a specific position or at a random one
     * @param {number} x
     * @param {number} y
     */
    generateShape(x?: number, y?: number) {
        let shape: Shape = this.view.createShape(x, y);
        this.model.setShapes(shape);
        shape.on("pointerdown", () => {
            shape.removeFromParent();
            let shapes = this.model.getShapes();
            let shapeToRemove = shapes.indexOf(shape);
            this.model.removeShapeFromList(shapeToRemove);

        });
    }

    /**
     * Main update loop - moves shapes and updates stats
     * @param {number} delta
     */
    update(delta: number) {
        const shapes: Shape[] = this.model.getShapes();
        const gravity = this.model.getGravity();
        this.view.update(shapes, gravity * delta);

        this.shapeTimer += this.app.ticker.deltaMS;

        this.refreshStats();
    }

    // Updates the UI with current shape count and total area
    refreshStats() {
        const shapeAreaEl = document.getElementById('shape-area') as HTMLElement;
        const shapeCountEl = document.getElementById("shape-count") as HTMLDivElement;

        const shapes = this.model.getShapes();
        shapeCountEl.textContent = shapes.length.toString();

        let totalArea = 0;
        shapes.forEach((shape) => {
            if (shape.getArea()) {
                totalArea += shape.getArea();
            }
        });

        shapeAreaEl.textContent = totalArea.toFixed(0);
    }
}


