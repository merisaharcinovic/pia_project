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


  filteredAgencies: User[];
  searchByAddress: boolean;
  searchByName: boolean;
  constructor(private adminService:AdminService, private userService:UserService) { }

  ngOnInit(): void {
    this.userService.allAgencies().subscribe((data: User[]) => {
      this.filteredAgencies = data;
      console.log(this.filteredAgencies)
    });
  }

  searchParam: string;

  search(){
    this.userService.searchAgencies(this.searchParam, this.searchByAddress, this.searchByName).subscribe((agencies: User[])=>{
      this.filteredAgencies = agencies;
      console.log(this.filteredAgencies)
    })
  }

  viewAgencyDetails(agency:User) {

  }


}
