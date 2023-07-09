import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../models/user';
import { CollaborationRequest } from '../models/collaborationRequest';

@Component({
  selector: 'app-agency-jobs',
  templateUrl: './agency-jobs.component.html',
  styleUrls: ['./agency-jobs.component.css']
})
export class AgencyJobsComponent implements OnInit {


  checkWorkerAvailability(job:any): boolean {
    this.userService.checkWorkerAvailability(job).subscribe((response) => {
      if (response['numAvailable']) {
        let numAvailableWorkers= response['numAvailable'];
        if(numAvailableWorkers<job.numWorkers) return false;
        else return true;
      } else {
        console.log(response['message']);
        return false;
      }
    });
    return false;
  }

  updateRoomStatus(job: any,room: any) {
    this.userService.updateRoomStatus(job, room).subscribe((response) => {
      if (response['message']=='Status sobe je uspesno azuriran.') {
        console.log(response['message'])
        this.getJobs();
      } else {
        console.log(response['message']);
      }
    });
  }


  toggleSketch(job: any) {
    job.showSketch=!job.showSketch;
  }
  constructor(private userService:UserService) { }

  requests: any;
  jobs:any;
  loggedUser: User
  numWorkers: number;


  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    this.getCollaborationRequests();
    this.getJobs();
  }

  assignWorkers(job: any) {
    this.userService.assignWorkers(job._id, this.numWorkers).subscribe((response) => {
      if (response['message']=='Uspesno dodeljen broj radnika.') {
        console.log(response['message'])
        this.getJobs();

        job.hasEnoughWorkers = this.checkWorkerAvailability(job);

        if(job.hasEnoughWorkers){
          this.userService.takeWorkers(job).subscribe((response) => {
            console.log(response['message']);
          });

        }

      } else {
        console.log(response['message']);
      }
    });
  }

  getJobs(){
    this.userService.getJobsForAgency(this.loggedUser._id).subscribe((response) => {
      if (response['jobs']) {
        this.jobs = response['jobs'];
        this.jobs = response['jobs'].map(obj => ({ ...obj, showSketch:false, hasEnoughWorkers:false }));

        console.log("JOBS:", this.jobs)

      } else if (response['message']) {
        console.log(response['message']);
      }
    });
  }

  getCollaborationRequests() {

    this.userService.getCollaborationsForAgency(this.loggedUser._id).subscribe((response) => {
      if (response['requests']) {
        this.requests = response['requests'].map((request: CollaborationRequest) => {
          if (request.status === 'na cekanju') {
            return { ...request, isAccepted: false };
          }
          return request;
        });

        console.log(this.requests);

      } else if (response['message']) {
        console.log(response['message']);
      }
    });
  }

  declineRequest(request: CollaborationRequest) {
    this.userService.declineCollaborationRequest(request._id).subscribe((response) => {
        if(response['message']=='Zahtev odbijen.'){
          this.getCollaborationRequests();
        }
        else{
          console.log(response['message'])
        }

      }
    );
  }


  sendOffer(request: CollaborationRequest) {
    const offer= {
      requestId: request._id,
      price: request.price
    };
    this.userService.sendOffer(offer).subscribe((response) => {
        if(response['message']=='Ponuda je poslata.'){
          alert('Ponuda je uspesno poslata.');
          this.getCollaborationRequests();
        }
        else{
          console.log(response['message'])
        }
      }

    );
  }







}
