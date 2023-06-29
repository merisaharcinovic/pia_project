import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.css']
})
export class AgencyComponent implements OnInit {
  showChangePassword: any;
  oldPassword: any;
  newPassword: any;
  confirmPassword: any;
  passMessage: string;

  constructor(private userService: UserService, private router: Router) { }

  profile: {
    name: string,
    description: string,
    address: {
      country: string,
      city: string,
      street: string,
      number: string
    },
    email: string,
    phone: string,
    profilePicture: string
  };

  editingName = false;
  editingDescription = false;
  editingAddress = false;
  editingEmail = false;
  editingPhone = false;

  updatedName: string;
  updatedDescription: string;
  updatedAddress: {
    country: string;
    city: string;
    street: string;
    number: string;
  } = {
    country: '',
    city: '',
    street: '',
    number: '',
  };
  updatedEmail: string;
  updatedPhone: string;

  showProfile: boolean = false;
  showObjects: boolean = false;
  showAgencies: boolean = false;
  showJobs: boolean = false;

  loggedUser: User;

  ngOnInit(): void {
    this.profile = {
      name: "",
      description: "",
      address: {
        country: "",
        city: "",
        street: "",
        number: ""
      },
      email: "",
      phone: "",
      profilePicture:""
    };
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (this.loggedUser) {
      this.profile = {
        name: this.loggedUser.agency.name,
        description: this.loggedUser.agency.description,
        address:this.loggedUser.agency.address,
        email: this.loggedUser.email,
        phone: this.loggedUser.phone,
        profilePicture:this.loggedUser.profilePicture
      };
    }
    this.updatedName = this.profile.name;
    this.updatedDescription = this.profile.description;
    this.updatedAddress=this.profile.address;
    this.updatedEmail = this.profile.email;
    this.updatedPhone = this.profile.phone;
  }

  showComponent(componentId: string) {
    this.showProfile = false;
    this.showAgencies = false;
    this.showObjects = false;
    this.showJobs = false;
    if (componentId == 'profil') {
      this.showProfile = true;
    }
    else if (componentId == 'objekti') {
      this.showObjects = true;
    }
    else if (componentId == 'agencije') {
      this.showAgencies = true;
    }
    else if (componentId == 'poslovi') {
      this.showJobs = true;
    }
  }

  editName() {
    this.editingName = true;
    this.updatedName = this.profile.name;
  }

  updateName() {
    this.profile.name = this.updatedName;
    this.editingName = false;
  }

  editDescription() {
    this.editingDescription = true;
    this.updatedDescription = this.profile.description;
  }

  updateDescription() {
    this.profile.description = this.updatedDescription;
    this.editingDescription = false;
  }

  editAddress() {
    this.editingAddress = true;
    this.updatedAddress = this.profile.address

  }

  updateAddress() {
    this.profile.address = {
      country: this.updatedAddress.country,
      city: this.updatedAddress.city,
      street: this.updatedAddress.street,
      number: this.updatedAddress.number
    };
    this.editingAddress = false;
    console.log(this.updatedAddress)
  }

  editEmail() {
    this.editingEmail = true;
    this.updatedEmail = this.profile.email;
  }

  updateEmail() {
    this.profile.email = this.updatedEmail;
    this.editingEmail = false;
  }

  editPhone() {
    this.editingPhone = true;
    this.updatedPhone = this.profile.phone;
  }

  updatePhone() {
    this.profile.phone = this.updatedPhone;
    this.editingPhone = false;
  }

  onProfilePictureChange(event: any) {
    const file = event.target.files[0];
    // Ovde izvršiti dalju obradu slike, npr. upload na server
  }

  updateProfile() {
    const updatedProfile = {
      name: this.profile.name,
      description: this.profile.description,
      address: this.profile.address,
      email: this.profile.email,
      phone: this.profile.phone
    };

    console.log(updatedProfile)


    this.userService.updateAgencyProfile(this.loggedUser.username, updatedProfile).subscribe((resp) => {
      console.log(resp['message']);
      if (resp['message'] == 'Uspesno azuriran profil') {
        console.log(resp['updatedProfile'])
        this.profile.name = resp['updatedProfile'].name;
        this.profile.description = resp['updatedProfile'].description;
        this.profile.address = resp['updatedProfile'].address;
        this.profile.email = resp['updatedProfile'].email;
        this.profile.phone = resp['updatedProfile'].phone;

        this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
        this.loggedUser.agency.name = resp['updatedProfile'].name;
        this.loggedUser.agency.description = resp['updatedProfile'].description;
        this.loggedUser.agency.address = resp['updatedProfile'].address
        this.loggedUser.email = resp['updatedProfile'].email;
        this.loggedUser.phone = resp['updatedProfile'].phone;
        localStorage.setItem('loggedUser', JSON.stringify(this.loggedUser));

        console.log('Azurirani profil', resp['updatedProfile']);
      } else {
        alert('Neuspesno azuriranje profila. Pokusajte ponovo.');
      }
    });
  }

  changePassword() {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z].{6,11}$/
    console.log(this.oldPassword);
    console.log(this.loggedUser.password);
    console.log(this.loggedUser.password == this.oldPassword);
    console.log(this.newPassword);
    console.log(this.confirmPassword);

    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.passMessage = 'Sva polja su obavezna.';
      return;
    }
    if (!(this.oldPassword === this.loggedUser.password)) {
      this.passMessage = 'Neispravna stara lozinka.';
      return;
    }
    if (!passwordPattern.test(this.newPassword)) {
      this.passMessage = 'Lozinka u neispravnom formatu.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passMessage = 'Nova lozinka se ne podudara sa potvrdom lozinke.';
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
