
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import Konva from 'konva'

@Component({
  selector: 'app-canvas-agency',
  templateUrl: './canvas-agency.component.html',
  styleUrls: ['./canvas-agency.component.css']
})
export class CanvasAgencyComponent{

  @ViewChild('canvasContainer', { static: false }) canvasContainer: ElementRef;
  @Input() sketch: any;
  @Input() hasEnoughWorkers: boolean;


  ngAfterViewInit() {
    this.renderSketch();
  }

  renderSketch() {
    const canvasContainer = this.canvasContainer.nativeElement;

    const stage = new Konva.Stage({
      container: canvasContainer,
      width: 800,
      height: 600,
    });

    const layer = new Konva.Layer();

    console.log(this.sketch);

    this.sketch.forEach((room) => {
      let color = 'white';

      if (this.hasEnoughWorkers) {
        if (room.status === 'radi se') {
          color = 'red';
        } else if (room.status === 'zavrseno') {
          color = 'green';
        }

      } else {
        color = 'yellow';
      }

      const rect = new Konva.Rect({
        x: room.x,
        y: room.y,
        width: room.width,
        height: room.height,
        fill: color,
        stroke: 'black',
        strokeWidth: 1,
      });

      layer.add(rect);

      const doorImage = new Image();
      doorImage.src = 'assets/door.png';

      doorImage.onload = () => {
        const door = new Konva.Image({
          x: room.door.x,
          y: room.door.y,
          image: doorImage,
          width: 50,
          height: 50,
        });

        layer.add(door);
        stage.add(layer);
        layer.draw();
      };
    });

  }

}
