import { Component, OnInit } from '@angular/core';
import { CollaborationRequest } from '../models/collaborationRequest';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {


  constructor(private userService:UserService) { }

  requests: CollaborationRequest[] = [];
  loggedUser: User

  showFinished: boolean=true;
  showActive: boolean=true;
  showRequests: boolean=true;

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser')); // Učitajte ulogovanog korisnika iz localStorage

    if (this.loggedUser) {
      this.getCollaborationRequests();
    }
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
