import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
registrationType: string = 'client';
username: string;
password: string;
confirmPassword: string;
phoneNumber: string;
email: string;
firstName: string;
lastName: string;
agencyName: string;
agencyAddress: {'country':string, 'city':string, 'street':string, 'number':number};
agencyPIB: string;
agencyDescription: string;

  constructor() { }

  ngOnInit(): void {
  }

}
