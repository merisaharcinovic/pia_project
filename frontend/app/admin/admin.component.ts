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
  }
  addClientMessage:string;

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
      lastname:""
    }

  }


  acceptRequest(toAccept: RegistrationRequest) {
    this.adminService.acceptRequest(toAccept).subscribe((data:{'message':string})=>{
      alert(data.message);
    })
    this.getAllPendingRequests()
    this.getAllUsers();


  }
  declineRequest(toDecline: RegistrationRequest) {
    this.adminService.declineRequest(toDecline).subscribe((data:{'message':string})=>{
      alert(data.message);
    })

    this.getAllPendingRequests()
    this.getAllUsers;
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
        this.adminService.addClient(this.newClient.username,this.newClient.password,this.newClient.phone,this.newClient.email,this.newClient.firstname,this.newClient.lastname).subscribe((resp)=>{
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

  deleteClient(toDelete: User) {
    this.adminService.deleteClient(toDelete.username).subscribe((resp)=>{
      console.log(resp['message'])
      if(resp['message']=='client deleted'){
        alert('Uspesno ste se obrisali klijenta')
        this.getAllUsers();
      }
      else{
        alert('Neuspesno brisanje klijenta. Pokusajte ponovo.')
      }
  })
  }

}
