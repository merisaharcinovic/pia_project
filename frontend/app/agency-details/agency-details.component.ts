import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ClientObject, User } from '../models/user';
import { retryWhen } from 'rxjs';
import { ObjectService } from '../object.service';
import { Job, Review } from '../models/job';

@Component({
  selector: 'app-agency-details',
  templateUrl: './agency-details.component.html',
  styleUrls: ['./agency-details.component.css']
})
export class AgencyDetailsComponent implements OnInit {

  constructor(private router:Router, private userService:UserService, private objectService:ObjectService) { }

  agency:User
  showRequestForm:boolean=false;
  selectedObject:ClientObject;
  selectedObjectId: string | null = null;
  user:User
  deadline: Date;
  isLoggedIn: boolean;
  reqMessage: string;

  allJobs:any[];


  getAllJobs(agencyId:string){
    this.userService.getJobsForAgency(agencyId).subscribe((response) => {
      if (response['jobs']) {
        this.allJobs = response['jobs'];
        console.log(this.allJobs)

      } else if (response['message']) {
        console.log(response['message']);
      }
    });
  }

  ngOnInit() {
    this.isLoggedIn=false;
    const currentUrl = this.router.url;
    const segments = currentUrl.split('/');
    const agencyId = segments[segments.length - 1];
    this.reqMessage="";

    this.getAgency(agencyId)
    this.getAllJobs(agencyId)

    this.user = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    if(this.user.username) {
      this.isLoggedIn=true;
      console.log(this.user)
      this.objectService.getObjects(this.user._id).subscribe((response: any) => {
        this.user.client.objects = response.objects;
        this.user.client.objects = response.objects.map(obj => ({ ...obj, editMode: false, showSketch:false }));
    });
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
    console.log(this.selectedObjectId);

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
