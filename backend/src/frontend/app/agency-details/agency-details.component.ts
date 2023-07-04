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
  user:User
  deadline: Date;
  isLoggedIn: boolean;
  reqMessage: string;


  ngOnInit() {
    const currentUrl = this.router.url;
    const segments = currentUrl.split('/');
    const agencyId = segments[segments.length - 1];
    this.reqMessage="";


    this.getAgency(agencyId)

    this.user = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    this.isLoggedIn = !!this.user;
  }

  getAgency(agencyId:string) {
    this.userService.getAgency(agencyId).subscribe((agency: User) => {
      this.agency = agency;
    });
  }

  requestCollaboration() {
    this.reqMessage=""
    if(!this.selectedObject || !this.deadline ) {
      this.reqMessage="Morate uneti sva polja."
      return
    }
    console.log(this.selectedObject);

    const request = {
      client: this.user._id,
      object: this.selectedObject._id,
      deadline: this.deadline,
      status: 'pending',
      price: null
    };
    console.log(request);

    this.userService.requestCollaboration(this.agency, request).subscribe((response)=>{
      this.reqMessage=response['message']
    }
    );

  }

}