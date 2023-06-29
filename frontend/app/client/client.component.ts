import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
showChangePassword: any;
oldPassword: any;
newPassword: any;
confirmPassword: any;
passMessage: string;
loggedUser: any;


  constructor(private userService:UserService, private router:Router) { }

  profile: {
    firstName:string,
    lastName: string,
    email: string,
    phoneNumber: string,
    profilePicture: string
  };

  editingFirstName = false;
  editingLastName = false;
  editingEmail = false;
  editingPhoneNumber = false;

  updatedFirstName: string;
  updatedLastName: string;
  updatedEmail: string;
  updatedPhone: string;

  showProfile: boolean=false;
  showObjects: boolean=false;
  showAgencies: boolean=false;
  showJobs: boolean=false;

  user:User

  ngOnInit(): void {

    this.profile= {
      firstName:"",
      lastName: "",
      email: "",
      phoneNumber: "",
      profilePicture: ""
    };
    this.loggedUser = localStorage.getItem('loggedUser');
    if (this.loggedUser) {
      this.user = JSON.parse(this.loggedUser);
      console.log(this.user)
      this.profile.firstName = this.user.client.firstname;
      this.profile.lastName = this.user.client.lastname;
      this.profile.email = this.user.email;
      this.profile.phoneNumber = this.user.phone;
      this.profile.profilePicture = this.user.profilePicture;
      console.log(this.profile)
    }

  }

  showComponent(componentId: string) {
    this.showProfile=false;
    this.showAgencies=false;
    this.showObjects=false;
    this.showJobs=false;
    if(componentId=='profil'){
      this.showProfile=true;
    }
    else if(componentId=='objekti'){
      this.showObjects=true;
    }
    else if(componentId=='agencije'){
      this.showAgencies=true;
    }
    else if(componentId=='poslovi'){
      this.showJobs=true;
    }
  }

  editFirstName() {
    this.editingFirstName = true;
    this.updatedFirstName = this.profile.firstName;
  }

  updateFirstName() {
    this.profile.firstName = this.updatedFirstName;
    this.editingFirstName = false;
  }

  editLastName() {
    this.editingLastName = true;
    this.updatedLastName = this.profile.lastName;
  }

  updateLastName() {
    this.profile.lastName = this.updatedLastName;
    this.editingLastName = false;
  }

  editEmail() {
    this.editingEmail = true;
    this.updatedEmail = this.profile.email;
  }

  updateEmail() {
    this.profile.email = this.updatedEmail;
    this.editingEmail = false;
  }

  editPhoneNumber() {
    this.editingPhoneNumber = true;
    this.updatedPhone = this.profile.phoneNumber;
  }

  updatePhoneNumber() {
    this.profile.phoneNumber = this.updatedPhone;
    this.editingPhoneNumber = false;
  }

  onProfilePictureChange(event: any) {
    const file = event.target.files[0];
    // Ovde izvršiti dalju obradu slike, npr. upload na server
  }

  updateProfile() {

    console.log(this.profile);
    const updatedProfile = {
      firstname: this.profile.firstName,
      lastname: this.profile.lastName,
      email: this.profile.email,
      phone: this.profile.phoneNumber,
      profilePicture: ""
    };

    this.userService.updateProfile(this.user.username, updatedProfile).subscribe((resp) => {
      console.log(resp['message']);
      if (resp['message'] == 'Uspesno azuriran profil') {

        this.profile.firstName = resp['updatedProfile'].firstname;
        this.profile.lastName = resp['updatedProfile'].lastname;
        this.profile.email = resp['updatedProfile'].email;
        this.profile.phoneNumber = resp['updatedProfile'].phone;
        this.profile.profilePicture = resp['updatedProfile'].profilePicture;
        this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
        this.loggedUser.client.firstname = resp['updatedProfile'].firstname;
        this.loggedUser.client.lastname = resp['updatedProfile'].lastname;
        this.loggedUser.email = resp['updatedProfile'].email;
        this.loggedUser.phone = resp['updatedProfile'].phone;
        this.loggedUser.profilePicture=resp['updatedProfile'].profilePicture
        localStorage.setItem('loggedUser', JSON.stringify(this.loggedUser));
        this.user = this.loggedUser;

        console.log('Azurirani profil', resp['updatedProfile']);
      } else {
        alert('Neuspesno azuriranje profila. Pokusajte ponovo.');
      }
    });
  }

  changePassword() {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z].{6,11}$/
    console.log(this.oldPassword);
    console.log(this.user.password);
    console.log(this.user.password==this.oldPassword)
    console.log(this.newPassword);
    console.log(this.confirmPassword);

    if(!this.oldPassword || !this.newPassword || !this.confirmPassword){
      this.passMessage='Sva polja su obavezna.';
      return;
    }
    if(!(this.oldPassword === this.user.password)){
      this.passMessage='Neispravna stara lozinka.';
      return;
    }
    if(!passwordPattern.test(this.newPassword)){
      this.passMessage = 'Lozinka u neispravnom formatu.'
      return
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passMessage='Nova lozinka se ne podudara sa potvrdom lozinke.';
      return;
    }

    //ispravna
    this.userService.changePassword(this.loggedUser.username, this.newPassword)
    .subscribe((resp) => {
      console.log(resp['message']);
      if (resp['message'] === 'Uspesno promenjena lozinka') {
        alert('Uspesno ste promenili lozinku. Molimo vas da se ponovo prijavite.');
        this.logout();
      } else {
        alert('Neuspešna promena lozinke. Proverite unete podatke i pokušajte ponovo.');
      }
    });

  this.oldPassword = '';
  this.newPassword = '';
  this.confirmPassword = '';

  this.showChangePassword = false;


  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['/login']);
  }


}
