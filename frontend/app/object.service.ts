import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { ClientObject } from './models/user';


@Injectable({
  providedIn: 'root'
})
export class ObjectService {
  deleteObject(id: string, object: ClientObject) {
    const data = {
      id: id,
      object: object
    };

    return this.http.post('http://localhost:4000/users/deleteObject', data);
  }

  getObjects(id: string) {
    return this.http.get(`http://localhost:4000/users/getObjects/${id}`);
}

  constructor(private http:HttpClient) { }
}
