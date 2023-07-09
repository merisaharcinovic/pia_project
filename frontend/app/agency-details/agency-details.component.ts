import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ClientObject, User } from '../models/user';
import { retryWhen } from 'rxjs';

@Component({
  selector: 'app-agency-details',
  templateUrl: './agency-details.component.html',
  styleUrls: ['./agency-details.component.css']
})
export class AgencyDetailsComponent implements OnInit {

  constructor(private router:Router, private userService:UserService) { }

  agency:User
  showRequestForm:boolean=false;
  selectedObject:ClientObject;
  selectedObjectId: string | null = null;
  user:User
  deadline: Date;
  isLoggedIn: boolean;
  reqMessage: string;


  ngOnInit() {
    this.isLoggedIn=false;
    const currentUrl = this.router.url;
    const segments = currentUrl.split('/');
    const agencyId = segments[segments.length - 1];
    this.reqMessage="";

    this.getAgency(agencyId)

    this.user = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    if(this.user.username) {
      this.isLoggedIn=true;
      console.log(this.user)
    }
    else this.isLoggedIn=false;
  }

  getAgency(agencyId:string) {
    this.userService.getAgency(agencyId).subscribe((agency: User) => {
      this.agency = agency;
    });
  }

  requestCollaboration() {
    this.reqMessage=""
    if(!this.selectedObjectId || !this.deadline ) {
      this.reqMessage="Morate uneti sva polja."
      return
    }
    console.log(this.selectedObject);

    const request = {
      agency:this.agency._id,
      client: this.user._id,
      object: this.selectedObjectId,
      deadline: this.deadline,
      status: 'na cekanju',
      price: null
    };
    console.log(request);

    this.userService.requestCollaboration(request).subscribe((response)=>{
      this.reqMessage=response['message']
    }
    );

  }

}
