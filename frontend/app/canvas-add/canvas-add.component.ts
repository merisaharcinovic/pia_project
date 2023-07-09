import { AfterViewInit, Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import Konva from 'konva'
import { ClientObject } from '../models/user';
import { ObjectService } from '../object.service';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-canvas-add',
  templateUrl: './canvas-add.component.html',
  styleUrls: ['./canvas-add.component.css']
})
export class CanvasAddComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasContainer', { static: false }) canvasContainer: ElementRef;
  @Output() objectAdded: EventEmitter<ClientObject> = new EventEmitter<ClientObject>();
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

    const doorImage = new Image();
    doorImage.src = 'assets/door.png';

    doorImage.onload = () => {
      const door1 = new Konva.Image({
        x: 150,
        y: 80,
        image: doorImage,
        width: 50,
        height: 50,
      });

      const door2 = new Konva.Image({
        x: 240,
        y: 100,
        image: doorImage,
        width: 50,
        height: 50,
      });

      const door3 = new Konva.Image({
        x: 150,
        y: 180,
        image: doorImage,
        width: 50,
        height: 50,
      });

      layer.add(rect1);
      layer.add(rect2);
      layer.add(rect3);
      layer.add(door1);
      layer.add(door2);
      layer.add(door3);

      this.stage.add(layer);

      layer.draw();
    };
  }




  constructor(private objectService:ObjectService, private router:Router) { }

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
    const doors=this.stage.find('Image')


    rectangles.forEach((rect, i) => {
      const x = rect.x();
      const y = rect.y();
      const width = rect.width();
      const height = rect.height();

      const door = doors[i];
      const doorX = door.x();
      const doorY = door.y();

      const room = {
        x: x,
        y: y,
        width: width,
        height: height,
        door: { x: doorX, y: doorY },
        status: 'nedovrseno',
      };

      sketch.push(room);
    });

    this.newObject['sketch']=sketch;

    console.log("OBJECT TO ADD:", this.newObject)

    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    const loggedUserId = loggedUser._id;

    this.objectService.addObject(loggedUserId, this.newObject).subscribe((response) => {
        if(response['message']=="Objekat uspesno dodat korisniku."){
          this.newObject = new ClientObject();
          this.objectAdded.emit(this.newObject);
        }
        else{
          console.log(response['message']);
        }
    });
  }

}
