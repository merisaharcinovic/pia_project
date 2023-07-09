import { Component, OnInit } from '@angular/core';
import { ObjectService } from '../object.service';
import { ClientObject } from '../models/user';

@Component({
  selector: 'app-objects',
  templateUrl: './objects.component.html',
  styleUrls: ['./objects.component.css']
})
export class ObjectsComponent implements OnInit {

  selectedObjectSketch: any;

  toggleSketch(object: any) {
    object.showSketch=!object.showSketch;
  }

  addMessage: string="";

  constructor(private objectService:ObjectService) { }

  objects: ClientObject[];
  objectsEdit:any


  displayForm: boolean = false;
  option: string;
  selectedFile: File;

  ngOnInit(): void {
    this.loadObjects();
    this.option='';
  }

  setOption(str: string) {
    this.option=str;
    console.log(this.option);

  }


  loadObjects() {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    const loggedUserId = loggedUser._id;
    this.objectService.getObjects(loggedUserId).subscribe((response: any) => {
        this.objects = response.objects;
        this.objectsEdit = response.objects.map(obj => ({ ...obj, editMode: false, showSketch:false }));
    });

}

  deleteObject(object) {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    const loggedUserId = loggedUser._id;
    console.log(object);


    this.objectService.deleteObject(loggedUserId, object).subscribe(() => {
      this.loadObjects();
      
    });
  }

  viewSketch(_t12: ClientObject) {
    throw new Error('Method not implemented.');
  }
  toggleEditMode(index: number) {
    this.objectsEdit[index].editMode = !this.objectsEdit[index].editMode;
  }

  saveChanges(index: number) {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    const loggedUserId = loggedUser._id;
    this.objectService.editObject(loggedUserId, this.objectsEdit[index]).subscribe((response:any) => {
        console.log(response);
        if(response['message']=='Objekat je uspesno azuriran.'){
          console.log(this.objectsEdit);
          this.loadObjects();
          console.log(this.objectsEdit);
        }

      }
    );

  }

  handleFileInput(event: any) {
    this.addMessage=""
    this.selectedFile = event.target.files[0];

    console.log(this.selectedFile);
    if (!this.selectedFile || this.selectedFile.type !== 'application/json') {
      this.addMessage='Morate odabrati JSON fajl.'
      this.selectedFile=null;
    }
  }

  addObjectJSON() {
    this.addMessage=""
    if (this.selectedFile) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        console.log('Fajl ucitan');
        const contents = fileReader.result as string;
        const objectToAdd = JSON.parse(contents);
        console.log(objectToAdd)

        if (!this.validateObject(objectToAdd)) {
          this.addMessage='Nisu validna sva trazena polja objekta.'
          this.selectedFile = null;
          return;
        }

        if (this.checkOverlap(objectToAdd)) {
          this.addMessage='Koordinate soba se preklapaju.'
          this.selectedFile = null;
          return;
        }
        console.log(objectToAdd)
        const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
        const loggedUserId = loggedUser._id;
        this.objectService.addObject(loggedUserId, objectToAdd).subscribe((response:any)=> {

          if(response['message']=='Objekat uspesno dodat korisniku.'){
            console.log(response['message']);
            this.selectedFile = null;
            this.addMessage=""
            this.loadObjects();
          }
          else{
            console.log('Greska:', response['message']);
            this.addMessage=""
          }

        }
      );
    };
      fileReader.readAsText(this.selectedFile);
    }
  }




  validateObject(objectToAdd: any): boolean {
    console.log(!objectToAdd.objectType,
      !objectToAdd.address,
      !objectToAdd.numRooms,
      !objectToAdd.area,
      !objectToAdd.sketch,
      objectToAdd.numRooms != objectToAdd.sketch.length,
      objectToAdd.numRooms>3)
    if (
      !objectToAdd.objectType ||
      !objectToAdd.address ||
      !objectToAdd.numRooms ||
      !objectToAdd.area ||
      !objectToAdd.sketch ||
      objectToAdd.numRooms != objectToAdd.sketch.length ||
      objectToAdd.numRooms>3
    ) {
      return false;
    }

    for (const room of objectToAdd.sketch) {
      if (
        room.x === undefined ||
        room.y === undefined ||
        room.width === undefined ||
        room.height === undefined ||
        room.door === undefined ||
        room.x === null ||
        room.y === null ||
        room.width === null ||
        room.height === null ||
        room.door === null||
        !this.checkDoorCoordinates(room)
      ) {
        console.log("Invalid room:", room);
        return false;
      }
    }

    return true;
  }


 checkOverlap(object: any): boolean {
  const sketch = object.sketch;
  const numRooms = sketch.length;

  for (let i = 0; i < numRooms - 1; i++) {
    const room1 = sketch[i];
    if (
      typeof room1.x !== "number" ||
      typeof room1.y !== "number" ||
      typeof room1.width !== "number" ||
      typeof room1.height !== "number" ||
      room1.x < 0 ||
      room1.y < 0 ||
      room1.width <= 0 ||
      room1.height <= 0
    ) {
      console.log("Invalid room type:", room1);
      return false;
    }

    for (let j = i + 1; j < numRooms; j++) {
      const room2 = sketch[j];

      if (
        typeof room2.x !== "number" ||
        typeof room2.y !== "number" ||
        typeof room2.width !== "number" ||
        typeof room2.height !== "number" ||
        room2.x < 0 ||
        room2.y < 0 ||
        room2.width <= 0 ||
        room2.height <= 0
      ) {
        console.log("Invalid room:", room2);
        return false;
      }

      if (
        room1.x + room1.width > room2.x &&
        room1.x < room2.x + room2.width &&
        room1.y + room1.height > room2.y &&
        room1.y < room2.y + room2.height
      ) {
        console.log("Invalid rooms:",room1, room2)
        return true;
      }
    }
  }

  return false;
}
  checkDoorCoordinates(room) {
  const { x, y, width, height, door } = room;

  if (
    (door.x >= x && door.x <= x + width && (door.y === y || door.y === y + height)) ||
    (door.y >= y && door.y <= y + height && (door.x === x || door.x === x + width))
  ) {
    return true;
  }

  return false;
}

}


