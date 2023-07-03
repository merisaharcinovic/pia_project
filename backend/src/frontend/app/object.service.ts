import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { ClientObject } from './models/user';


@Injectable({
  providedIn: 'root'
})
export class ObjectService {

  addObject(id:string, object:any){
    const data = {
      id:id,
      object: object
    };

    return this.http.post('http://localhost:4000/users/addObject', data);
  }

  deleteObject(id: string, object: any) {
    const data = {
      id: id,
      object: object
    };

    return this.http.post('http://localhost:4000/users/deleteObject', data);
  }

  getObjects(id: string) {
    return this.http.get(`http://localhost:4000/users/getObjects/${id}`);
  }

  editObject(id: string, editObject: any) {
    const data = {
      id: id,
      editObject: editObject
    };

    return this.http.post('http://localhost:4000/users/editObject', data);
  }

  constructor(private http:HttpClient) { }
}
