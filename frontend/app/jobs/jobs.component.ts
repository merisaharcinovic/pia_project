import { Component, OnInit } from '@angular/core';
import { CollaborationRequest } from '../models/collaborationRequest';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { Job } from '../models/job';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  constructor(private userService:UserService) { }

  requests: CollaborationRequest[] = [];
  jobs: Job[]=[];

  loggedUser: User

  showFinished: boolean=true;
  showActive: boolean=true;
  showRequests: boolean=true;

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    if (this.loggedUser) {
      this.getCollaborationRequests();
      this.getJobs();
    }
  }

  getJobs(){
    this.userService.getJobsForClient(this.loggedUser._id).subscribe((response) => {
      if (response['jobs']) {
        this.jobs = response['jobs'];
        console.log("JOBS:", this.jobs)

      } else if (response['message']) {
        console.log(response['message']);
      }
    });
  }

  getCollaborationRequests() {
    this.userService.getCollaborationsForClient(this.loggedUser._id).subscribe((response) => {
      if (response['requests']) {
        this.requests = response['requests'];
        console.log(this.requests)

      } else if (response['message']) {
        console.log(response['message']);
      }
    });
  }


  acceptOffer(request: CollaborationRequest) {
    console.log("ZAHTEV",request)
    this.userService.acceptOffer(request).subscribe((response) => {
      if(response['message']=='Ponuda prihvacena.'){
        this.getCollaborationRequests();
        this.getJobs();
      }
      else{
        console.log(response['message'])
      }
    });
  }


  declineOffer(request: CollaborationRequest) {
    this.userService.deleteRequest(request._id).subscribe((response) => {
      if(response['message']=='Zahtev obrisan.'){
        this.getCollaborationRequests();
      }
      else{
        console.log(response['message'])
      }

    }
  );
  }

}
