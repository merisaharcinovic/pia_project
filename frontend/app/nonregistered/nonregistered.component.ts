import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-nonregistered',
  templateUrl: './nonregistered.component.html',
  styleUrls: ['./nonregistered.component.css']
})
export class NonregisteredComponent implements OnInit {


  allAgencies:User[];
  searchQuery: string;
  filteredAgencies: User[];
  constructor(private adminService:AdminService) { }

  ngOnInit(): void {
    this.adminService.allAgencies().subscribe((data: User[]) => {
      this.allAgencies = data;
      console.log(this.allAgencies)
    });
  }

  viewAgencyDetails(agency:User) {

  }


}
