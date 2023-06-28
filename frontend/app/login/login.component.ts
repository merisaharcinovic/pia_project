import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  username:string;
  password:string;
  message:string;

  login(){
    this.userService.login(this.username, this.password).subscribe( (user:User)=>{
        if(user){
          if(user.role=='client'){
            this.router.navigate(['/client'])
          }
          else if (user.role=='agency'){
            this.router.navigate(['/agency'])
          }
          else if(user.role == 'admin'){
            alert("Administrator se prijavljuje na posebnoj formi.")
            this.router.navigate(['/admin-login'])
          }

          localStorage.setItem('loggedUser', JSON.stringify(user));
        }
        else {
          this.message='Neispravno korisnicko ime ili lozinka.'
        }
      });

  }

}
