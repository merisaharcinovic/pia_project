import { Component, OnInit } from '@angular/core';
import { CollaborationRequest } from '../models/collaborationRequest';
import { RoomSketch, User } from '../models/user';
import { UserService } from '../user.service';
import { Job, Review } from '../models/job';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  constructor(private userService:UserService) { }

  requests: CollaborationRequest[] = [];
  jobs: any=[];

  loggedUser: User

  showFinished: boolean=true;
  showActive: boolean=true;
  showRequests: boolean=true;

  showReviewForm: boolean;
  reviewRating: number;
  reviewComment: string;
  showEditForm: boolean;

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    if (this.loggedUser) {
      this.getCollaborationRequests();
      this.getJobs();
    }
  }

  toggleSketch(job: any) {
    job.showSketch=!job.showSketch;
  }

  getJobs(){
    this.userService.getJobsForClient(this.loggedUser._id).subscribe((response) => {
      if (response['jobs']) {
        this.jobs = response['jobs'];
        this.jobs = response['jobs'].map(job => ({ ...job, showSketch:false }));

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


  areAllRoomsCompleted(sketch: RoomSketch[]): boolean {
    for (const room of sketch) {
      if (room.status !== 'zavrseno') {
        return false;
      }
    }
    return true;
  }

  pay(job: Job) {
    this.userService.payAndFinish(job).subscribe((response) => {
      if (response['message'] === 'Posao placen i zavrsen.' ) {
        this.getJobs();

      } else {
        console.log(response['message']);
      }
    });
  }

  addReview(job: Job) {
    const review: Review = {
      rating: this.reviewRating,
      comment: this.reviewComment
    };

    this.userService.addReview(job, review).subscribe((response) => {
      if (response['message'] === 'Ocena je uspesno dodata.') {
        job.review = review;
        this.getJobs();
        this.reviewComment = null;
        this.reviewRating = null;
        this.showReviewForm = false;
      } else {
        console.log(response['message']);
      }
    });
  }

  editReview(job: Job) {
    const review: Review = {
      rating: this.reviewRating,
      comment: this.reviewComment
    };

    this.userService.editReview(job, review).subscribe((response) => {
      if (response['message'] === 'Ocena je uspesno izmenjena.') {
        job.review = review;
        this.getJobs();
        this.reviewRating = null;
        this.reviewComment = null;
        this.showEditForm = false;
      } else {
        console.log(response['message']);
      }
    });
  }

  deleteReview(job: Job) {
    this.userService.deleteReview(job).subscribe((response) => {
      if (response['message'] === 'Ocena je uspesno obrisana.') {
        job.review = null;
        this.getJobs();
      } else {
        console.log(response['message']);
      }
    });
  }

  cancelReview() {
    this.reviewComment = null;
    this.reviewRating = null;
    this.showReviewForm = false;
  }

}
