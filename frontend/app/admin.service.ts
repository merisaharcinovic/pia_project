import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { RegistrationRequest } from './models/registrationRequest';
import { User, Worker } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  editWorker(agencyId: string, worker: Worker) {
    const data={
      'agencyId':agencyId,
      'worker':worker
    }
    return this.http.post('http://localhost:4000/admin/editWorker', data)

  }
  addWorker(selectedAgency:User, firstname: string, lastname: string, email: string, phone: string, specialization: string) {
    const data={
      'agency':selectedAgency,
      'firstname':firstname,
      'lastname':lastname,
      'phone':phone,
      'email':email,
      'specialization':specialization
    }
    return this.http.post('http://localhost:4000/admin/addWorker', data)
  }
  addAgency(username: string, password: string, phone: string, email: string, name: string, address:{country:string, city:string, street:string, number:string}, PIB: string, description: string, profilePicture: string) {
    const data={
      'username':username,
      'password':password,
      'phone':phone,
      'email':email,
      'name':name,
      'address':address,
      'PIB':PIB,
      'description':description,
      'profilePicture':profilePicture
    }
    return this.http.post('http://localhost:4000/admin/addAgency', data)
  }
  deleteUser(username: String) {
    return this.http.post('http://localhost:4000/admin/deleteUser', {'username':username})
  }

  deleteWorker(agencyId:string, worker: any) {
    return this.http.post('http://localhost:4000/admin/deleteWorker', {'agencyId':agencyId, 'worker':worker})
  }
  acceptRequest(toAccept: RegistrationRequest) {
    return this.http.post('http://localhost:4000/admin/acceptRequest',toAccept)
  }
  declineRequest(toDecline: RegistrationRequest) {
    return this.http.post('http://localhost:4000/admin/declineRequest',toDecline)
  }

  addClient(username: string, password: string, phone: string, email: string, firstname: string, lastname: string, profilePicture:string) {
    const data={
      'username':username,
      'password':password,
      'phone':phone,
      'email':email,
      'firstname':firstname,
      'lastname':lastname,
      'profilePicture':profilePicture
    }
    return this.http.post('http://localhost:4000/admin/addClient', data)
  }


  constructor(private http:HttpClient) { }

  pendingRequests() {
    return this.http.get('http://localhost:4000/admin/pendingRequests')
  }

  allClients() {
    return this.http.get('http://localhost:4000/admin/allClients')
  }
  allAgencies() {
    return this.http.get('http://localhost:4000/admin/allAgencies')
  }
}
