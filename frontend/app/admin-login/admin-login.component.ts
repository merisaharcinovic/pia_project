import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  constructor(private userService:UserService, private router:Router) { }

  ngOnInit(): void {
  }
  username:string;
  password:string;
  login(){
    this.userService.login(this.username, this.password).subscribe( (user:User)=>{
        if(user){
          if(user.role=='admin'){
            this.router.navigate(['/admin'])
          }
          else{
            alert("forma samo za admina")
          }
        }
        else alert("neispravni kredencijali")
      });

  }

}

