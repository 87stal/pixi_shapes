import { Application } from 'pixi.js';
import { AppController } from './controller/ShapeController';
import { ShapeModel } from './model/ShapeModel';

const appWidth: number = window.innerWidth;
const appHeight: number = window.innerHeight;

// Create a new application
(async () => {

    // Create a new application
    const app = new Application();
    app.stage.eventMode = 'static';

    // Initialize the application
    await app.init({ background: '#96d1e3', width: appWidth/2, height: appHeight/2, resizeTo: document.getElementById("shape-field") as HTMLDivElement});

    // Append the application canvas to the document body
    document.getElementById("shape-field")?.appendChild(app.canvas)

    const model = new ShapeModel();
    new AppController(app, model);
})()
