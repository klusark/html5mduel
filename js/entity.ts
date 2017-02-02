import { Canvas } from "./canvas";

export interface Entity {
    Draw(canvas: Canvas): void;
    Update(deltaT: number): void;
}