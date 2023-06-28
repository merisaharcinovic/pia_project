import { Component, OnInit } from '@angular/core';
import { RegistrationRequest } from '../models/registrationRequest';
import { AdminService } from '../admin.service';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {


  constructor(private adminService:AdminService, private userService:UserService) { }

  pendingRequests: RegistrationRequest[];
  allClients:User[];
  allAgencies:User[];

  newClient: {
    username:string;
    password:string;
    confirmPassword:string;
    email:  string;
    phone:  string;
    role: string;
    firstname:string;
    lastname:string;
    profilePicture:string;
  }
  newAgency:{
    username:string;
      password:string;
      confirmPassword:string;
      email:  string;
      phone:  string;
      role: string;
      name: string;
      address:{
        country:string,
        city:string,
        street:string,
        number:string
      }
      PIB:string,
      description:string
      profilePicture:string

  }
  addClientMessage:string;
  addAgencyMessage:string;

  getAllPendingRequests() {
    this.adminService.pendingRequests().subscribe((data: RegistrationRequest[]) => {
      this.pendingRequests = data;
      console.log(data);
    });
  }

  getAllUsers() {
    this.adminService.allClients().subscribe((data: User[]) => {
      this.allClients = data;
    });

    this.adminService.allAgencies().subscribe((data: User[]) => {
      this.allAgencies = data;
    });
  }

  ngOnInit(): void {
    this.getAllPendingRequests();
    this.getAllUsers();
    this.newClient= {
      username:"",
      password:"",
      confirmPassword:"",
      email:  "",
      phone:  "",
      role: "",
      firstname:"",
      lastname:"",
      profilePicture:""
    }

    this.newAgency={
      username:"",
        password:"",
        confirmPassword:"",
        email:  "",
        phone:  "",
        role: "",
        name: "",
        address:{
          country:"",
          city:"",
          street:"",
          number:""
        },
        PIB:"",
        description:"",
        profilePicture:""
    }

  }


  acceptRequest(toAccept: RegistrationRequest) {
    this.adminService.acceptRequest(toAccept).subscribe((data:{'message':string})=>{
      alert(data.message);
      this.getAllPendingRequests()
      this.getAllUsers();
    })

  }
  declineRequest(toDecline: RegistrationRequest) {
    this.adminService.declineRequest(toDecline).subscribe((data:{'message':string})=>{
      alert(data.message);
      this.getAllPendingRequests()
      this.getAllUsers;
    })


  }

  addClient() {
    this.userService.checkUsernameAndEmail(this.newClient.username, this.newClient.email).subscribe( (data:{'username':boolean, 'email':boolean})=>{
      console.log(data)
      if (data.username || data.email) {
        this.addClientMessage = 'Vec postoji korisnik sa datim korisnickim imenom ili email adresom.'
        return
      }
      if(!this.newClient.username || !this.newClient.email || !this.newClient.password || this.newClient.password!=this.newClient.confirmPassword || !this.newClient.confirmPassword || !this.newClient.phone || !this.newClient.firstname || !this.newClient.lastname){
        this.addClientMessage = 'Morate uneti ispravne podatke'
        return
      }
      else{
        this.adminService.addClient(this.newClient.username,this.newClient.password,this.newClient.phone,this.newClient.email,this.newClient.firstname,this.newClient.lastname, this.newClient.profilePicture).subscribe((resp)=>{
          console.log(resp['message'])
          if(resp['message']=='added new client'){
            alert('Uspesno ste se dodali klijenta')
            this.getAllUsers();
          }
          else{
            alert('Neuspesno dodavanje klijenta. Pokusajte ponovo.')
          }
      })
      }
    });


  }

  addAgency() {
    this.userService.checkUsernameAndEmail(this.newAgency.username, this.newAgency.email).subscribe( (data:{'username':boolean, 'email':boolean})=>{
      console.log(data)
      if (data.username || data.email) {
        this.addAgencyMessage = 'Vec postoji korisnik sa datim korisnickim imenom ili email adresom.'
        return
      }
      if(!this.newAgency.username || !this.newAgency.email || !this.newAgency.password || this.newAgency.password!=this.newAgency.confirmPassword || !this.newAgency.confirmPassword || !this.newAgency.phone || !this.newAgency.name || !this.newAgency.PIB || !this.newAgency.description
        || !this.newAgency.address.city || !this.newAgency.address.country || !this.newAgency.address.number || !this.newAgency.address.street){
        this.addAgencyMessage = 'Morate uneti ispravne podatke'
        return
      }
      else{
        let addressField={
          country:this.newAgency.address.country,
          city:this.newAgency.address.city,
          street:this.newAgency.address.street,
          number:this.newAgency.address.number

        }
        this.adminService.addAgency(this.newAgency.username,this.newAgency.password,this.newAgency.phone,this.newAgency.email, this.newAgency.name, this.newAgency.address, this.newAgency.PIB, this.newAgency.description, this.newAgency.profilePicture).subscribe((resp)=>{
          console.log(resp['message'])
          if(resp['message']=='added new agency'){
            alert('Uspesno ste se dodali agenciju')
            this.getAllUsers();
          }
          else{
            alert('Neuspesno dodavanje agencije. Pokusajte ponovo.')
          }
      })
      }
    });


  }

  deleteUser(toDelete: User) {
    this.adminService.deleteUser(toDelete.username).subscribe((resp)=>{
      console.log(resp['message'])
      if(resp['message']=='user deleted'){
        alert('Uspesno ste se obrisali korisnika')
        this.getAllUsers();
      }
      else{
        alert('Neuspesno brisanje korisnika. Pokusajte ponovo.')
      }
  })
  }

}
