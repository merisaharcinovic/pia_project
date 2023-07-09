import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Konva from 'konva'
import { ClientObject } from '../models/user';
import { ObjectService } from '../object.service';

@Component({
  selector: 'app-canvas-add',
  templateUrl: './canvas-add.component.html',
  styleUrls: ['./canvas-add.component.css']
})
export class CanvasAddComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasContainer', { static: false }) canvasContainer: ElementRef;

  newObject: ClientObject;
  stage:Konva.Stage;


  ngAfterViewInit(): void {

    const canvasContainer = this.canvasContainer.nativeElement;
    console.log(canvasContainer);

    if (canvasContainer) {
      console.log("INIT CANVAS");

      this.initCanvas();
    }

  }

  initCanvas() {
    const canvasContainer = this.canvasContainer.nativeElement;

    this.stage = new Konva.Stage({
      container: canvasContainer,
      width: 800,
      height: 600,
    });

    const layer = new Konva.Layer();

    const rect1 = new Konva.Rect({
      x: 50,
      y: 50,
      width: 100,
      height: 200,
      stroke: 'black',
      strokeWidth: 1,
    });

    const rect2 = new Konva.Rect({
      x: 150,
      y: 50,
      width: 200,
      height: 100,
      stroke: 'black',
      strokeWidth: 1,
    });

    const rect3 = new Konva.Rect({
      x: 150,
      y: 150,
      width: 150,
      height: 200,
      stroke: 'black',
      strokeWidth: 1,
    });

    layer.add(rect1);
    layer.add(rect2);
    layer.add(rect3);

    this.stage.add(layer);

    layer.draw();
  }


  constructor(private objectService:ObjectService) { }

  ngOnInit(): void {
    this.newObject = new ClientObject();

  }

  addObject() {
    console.log("ADD OBJECT");

    if (!this.newObject.objectType || !this.newObject.address || !this.newObject.numRooms || !this.newObject.area) {
      alert("Morate uneti sve informacije o objektu.");
      return;
    }

    const sketch = [];

    const rectangles = this.stage.find('Rect');

    rectangles.forEach((rect) => {
      const x = rect.x();
      const y = rect.y();
      const width = rect.width();
      const height = rect.height();

      const room = {
        x: x,
        y: y,
        width: width,
        height: height,
        door: { x: 0, y: 0 },
        status: 'nedovrseno',
      };
      console.log("SOBA: ",room);


      sketch.push(room);
    });

    this.newObject['sketch']=sketch;

    console.log("OBJECT TO ADD:", this.newObject)

    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    const loggedUserId = loggedUser._id;

    this.objectService.addObject(loggedUserId, this.newObject).subscribe((response) => {
        if(response['message']=="Objekat je uspesno sacuvan."){
          this.newObject = new ClientObject();
        }
        else{
          console.log(response['message']);
        }
    });
  }

}
