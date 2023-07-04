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


  constructor(private userService:UserService) { }

  requests: any;
  loggedUser: User


  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    this.getCollaborationRequests();
  }

  getCollaborationRequests() {

    this.userService.getCollaborationsForAgency(this.loggedUser._id).subscribe((response) => {
      if (response['requests']) {
        this.requests = response['requests'].map((request: CollaborationRequest) => {
          if (request.status === 'pending') {
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

  rejectRequest(request: CollaborationRequest) {
    // Logika za odbijanje zahteva
    // Pozovite odgovarajuću metodu u servisu za agenciju
  }

  sendOffer(request: CollaborationRequest) {
    const offer= {
      requestId: request._id,
      price: request.price
    };
    this.userService.sendOffer(offer).subscribe(
      (response) => {
        // Obrada uspešnog slanja ponude
      },
      (error) => {
        // Obrada greške pri slanju ponude
      }
    );
  }







}
