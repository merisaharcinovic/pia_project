import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { RegistrationRequest } from './models/registrationRequest';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  deleteClient(username: String) {
    return this.http.post('http://localhost:4000/admin/deleteClient', {'username':username})
  }
  acceptRequest(toAccept: RegistrationRequest) {
    return this.http.post('http://localhost:4000/admin/acceptRequest',toAccept)
  }
  declineRequest(toDecline: RegistrationRequest) {
    return this.http.post('http://localhost:4000/admin/declineRequest',toDecline)
  }

  addClient(username: string, password: string, phone: string, email: string, firstname: string, lastname: string) {
    const data={
      'username':username,
      'password':password,
      'phone':phone,
      'email':email,
      'firstname':firstname,
      'lastname':lastname
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
