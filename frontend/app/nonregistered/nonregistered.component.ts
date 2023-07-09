import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nonregistered',
  templateUrl: './nonregistered.component.html',
  styleUrls: ['./nonregistered.component.css']
})
export class NonregisteredComponent implements OnInit {


  filteredAgencies: User[];
  allAgencies: User[];
  searchByAddress: boolean;
  searchByName: boolean;
  constructor(private adminService:AdminService, private userService:UserService, private router:Router) { }

  ngOnInit(): void {
    this.userService.allAgencies().subscribe((data: User[]) => {
      this.allAgencies=data;
      this.filteredAgencies = data;
      console.log(this.filteredAgencies)
    });
  }

  searchParam: string;

  search() {
    console.log(this.searchParam, this.searchByAddress, this.searchByName);
    let param=(this.searchParam).toLowerCase();

    if (this.searchByAddress && this.searchByName) {
      this.filteredAgencies = this.allAgencies.filter((agency) => {
        const { country, city, street, number } = agency.agency.address;
        return (
          agency.agency.name.toLowerCase().includes(param) ||
          country.toLowerCase().includes(param) ||
          city.toLowerCase().includes(param) ||
          street.toLowerCase().includes(param) ||
          number.toLowerCase().includes(param)
        );
      });
    } else if (this.searchByAddress) {
      this.filteredAgencies = this.allAgencies.filter((agency) => {
        const { country, city, street, number } = agency.agency.address;

        return (
          country.toLowerCase().includes(param) ||
          city.toLowerCase().includes(param) ||
          street.toLowerCase().includes(param) ||
          number.toLowerCase().includes(param)
        );
      });
    } else if (this.searchByName) {
      this.filteredAgencies = this.allAgencies.filter((agency) =>
        agency.agency.name.toLowerCase().includes(param)
      );
    } else {
      this.filteredAgencies = this.allAgencies;
    }
  }

  // sortAgencies() {
  //   if (this.sortBy === 'name') {
  //     this.filteredAgencies.sort((a, b) => {
  //       const nameA = a.agency.name.toLowerCase();
  //       const nameB = b.agency.name.toLowerCase();

  //       if (nameA < nameB) {
  //         return this.sortOrder === 'asc' ? -1 : 1;
  //       } else if (nameA > nameB) {
  //         return this.sortOrder === 'asc' ? 1 : -1;
  //       } else {
  //         return 0;
  //       }
  //     });
  //   } else if (this.sortBy === 'address') {
  //     this.filteredAgencies.sort((a, b) => {
  //       const addressA = a.agency.address.toLowerCase();
  //       const addressB = b.agency.address.toLowerCase();

  //       if (addressA < addressB) {
  //         return this.sortOrder === 'asc' ? -1 : 1;
  //       } else if (addressA > addressB) {
  //         return this.sortOrder === 'asc' ? 1 : -1;
  //       } else {
  //         return 0;
  //       }
  //     });
  //   }
  // }



  viewAgencyDetails(agency:User) {
    const agencyId = agency._id;
    this.router.navigate(['/agency-details', agencyId]);
  }

}
