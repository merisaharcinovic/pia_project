import { Component, OnInit } from '@angular/core';
import { ObjectService } from '../object.service';
import { ClientObject } from '../models/user';

@Component({
  selector: 'app-objects',
  templateUrl: './objects.component.html',
  styleUrls: ['./objects.component.css']
})
export class ObjectsComponent implements OnInit {


  constructor(private objectService:ObjectService) { }

  objects: ClientObject[];

  ngOnInit(): void {
    this.loadObjects();
  }

  loadObjects() {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    const loggedUserId = loggedUser._id;
    this.objectService.getObjects(loggedUserId).subscribe((response: any) => {
        this.objects = response.objects;
    });
}

  deleteObject(object) {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    const loggedUserId = loggedUser._id;
    this.objectService.deleteObject(loggedUserId, object).subscribe(() => {
      this.loadObjects();
    });
  }

  viewSketch(_t12: ClientObject) {
    throw new Error('Method not implemented.');
  }
  editObject(_t12: ClientObject) {
    throw new Error('Method not implemented.');
  }




}
