import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { User } from './models/user';
import { CollaborationRequest } from './models/collaborationRequest';
import { Job, Review } from './models/job';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  hasEnough(job: any) {
    return this.http.post('http://localhost:4000/job/hasEnough', {job:job})
  }
  takeWorkers(job: any) {
    return this.http.post('http://localhost:4000/job/takeWorkers', {job:job})
  }
  checkWorkerAvailability(job: any) {
    return this.http.post('http://localhost:4000/job/checkWorkerAvailability', {job:job})
  }
  updateRoomStatus(job: any, room: any) {
    return this.http.post('http://localhost:4000/job/updateRoomStatus', {job:job, room:room})
  }
  payAndFinish(job: Job) {
    return this.http.post('http://localhost:4000/job/payAndFinish', {job:job})
  }
  editReview(job: Job, review: { rating: number; comment: string; }) {
    const data={
      'job':job,
      'review':review
    }

    return this.http.post('http://localhost:4000/job/editReview', data)
  }
  deleteReview(job: Job) {
    return this.http.post('http://localhost:4000/job/deleteReview', {job:job})
  }
  addReview(job: Job, review: Review) {
    const data={
      'job':job,
      'review':review
    }

    return this.http.post('http://localhost:4000/job/addReview', data)

  }


  assignWorkers(id: string, numWorkers: number) {
    const data={
      'id':id,
      'numWorkers':numWorkers
    }
    return this.http.post('http://localhost:4000/job/assignWorkers', data)

  }


  updateAgencyProfile(username: string, updatedProfile: {name: string; description:string;
    address: {country: string;city: string;street: string;number: string;}; email: string;phone: string;}) {
      const data={
        'username':username,
        'updatedProfile':updatedProfile
      }
      return this.http.post('http://localhost:4000/users/updateAgencyProfile', data)
  }
  changePassword(username: string, newPassword: any) {
    const data={
      'username':username,
      'newPassword':newPassword
    }
    return this.http.post('http://localhost:4000/users/changePassword', data)
  }


  constructor(private http:HttpClient) { }

  login(username, password){
    const data={
      'username':username,
      'password':password
    }
    return this.http.post('http://localhost:4000/users/login', data)
  }

  registerClient(username: string, password: string, phoneNumber: string, email: string, firstName: string, lastName: string, profilePicture:string) {
    const data={
      'username':username,
      'password':password,
      'phone':phoneNumber,
      'email':email,
      'firstname':firstName,
      'lastname':lastName,
      'profilePicture':profilePicture
    }
    return this.http.post('http://localhost:4000/users/registerClient', data)
  }

  registerAgency(username: string, password: string, phoneNumber: string, email: string, agencyName: string, agencyAddress: { country: string; city: string; street: string; number: string; }, agencyPIB: string, agencyDescription: string, profilePicture:string) {
    const data={
      'username':username,
      'password':password,
      'phone':phoneNumber,
      'email':email,
      'agencyName':agencyName,
      'agencyAddress':agencyAddress,
      'agencyPIB':agencyPIB,
      'agencyDescription':agencyDescription,
      'profilePicture':profilePicture
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


  updateProfile(username: string,
    updatedProfile :{firstname: string,lastname: string,email: string,phone: string,profilePicture:string}) {
    const data={
      'username':username,
      'updatedProfile':updatedProfile
    }
    return this.http.post('http://localhost:4000/users/updateProfile', data)
  }

  getAgency(id:string){
    return this.http.post('http://localhost:4000/users/getAgency', {id:id})
  }

  requestCollaboration(request:any){
    const data={
      request:request
    }
    return this.http.post('http://localhost:4000/collaboration/requestCollaboration', data)
  }

  getCollaborationsForAgency(id:string){
    return this.http.post('http://localhost:4000/collaboration/getCollaborationsForAgency', {id:id})
  }

  getCollaborationsForClient(id: string) {
    return this.http.post('http://localhost:4000/collaboration/getCollaborationsForClient', {id:id})
  }

  declineCollaborationRequest(id: string) {
    return this.http.post('http://localhost:4000/collaboration/declineCollaborationRequest', {id:id})

  }

  sendOffer(offer: { requestId: string; price: number; }) {
    return this.http.post('http://localhost:4000/collaboration/sendOffer', {offer:offer})
  }

  acceptOffer(request: CollaborationRequest) {
    return this.http.post('http://localhost:4000/collaboration/acceptOffer', {request:request})
  }

  deleteRequest(id: string) {
    return this.http.post('http://localhost:4000/collaboration/deleteRequest', {id:id})

  }

  getJobsForClient(id: string) {
    return this.http.post('http://localhost:4000/job/getJobsForClient', {id:id})
  }

  getJobsForAgency(id: string) {
    return this.http.post('http://localhost:4000/job/getJobsForAgency', {id:id})
  }

  getJobs(){
    return this.http.get('http://localhost:4000/job/getJobs')

  }

  uploadProfilePicture(profilePicture: File, username:string): Observable<any> {

    var formData = new FormData();
    if (profilePicture) {
      console.log("appending image");

      formData.append('profilePicture', profilePicture, `${username}.${profilePicture.name.split('.').pop()}`);
      formData.append('test','test');
    } else {
      const defaultImageFile = new File(['path/to/default/image.jpg'], 'default.jpg', { type: 'image/jpeg' });
      formData.append('profilePicture', defaultImageFile, `${username}_default.jpg`);
    }
    console.log(formData);
    return this.http.post<any>('http://localhost:4000/users/upload-profile-picture', formData);
  }


}
