import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http:HttpClient) { }

  login(username, password){
    const data={
      'username':username,
      'password':password
    }
    return this.http.post('http://localhost:4000/users/login', data)
  }

  registerClient(username: string, password: string, phoneNumber: string, email: string, firstName: string, lastName: string) {
    const data={
      'username':username,
      'password':password,
      'phone':phoneNumber,
      'email':email,
      'firstname':firstName,
      'lastname':lastName
    }
    return this.http.post('http://localhost:4000/users/registerClient', data)
  }

  registerAgency(username: string, password: string, phoneNumber: string, email: string, agencyName: string, agencyAddress: { country: string; city: string; street: string; number: string; }, agencyPIB: string, agencyDescription: string) {
    const data={
      'username':username,
      'password':password,
      'phone':phoneNumber,
      'email':email,
      'agencyName':agencyName,
      'agencyAddress':agencyAddress,
      'agencyPIB':agencyPIB,
      'agencyDescription':agencyDescription
    }
    return this.http.post('http://localhost:4000/users/registerAgency', data)
  }


  checkUsernameAndEmail(username: string, email:string) {
    const data={'username':username, 'email':email}
    return this.http.post('http://localhost:4000/users/checkUsernameAndEmail', data)
  }

  allAgencies() {
    return this.http.get('http://localhost:4000/users/allAgencies')
  }

  searchAgencies(searchParam, searchByAddress:boolean, searchByName:boolean){
    let url = `http://localhost:4000/users/searchAgencies/?param=${searchParam}`;

    if (searchByAddress && searchByName) {
      url += '&address=true&name=true';
    } else if (searchByAddress) {
      url += '&address=true';
    } else if (searchByName) {
      url += '&name=true';
    }

  return this.http.get(url);
  }
}
