import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loggedUser:User

  constructor(private router:Router) { }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate['login']
  }

  ngOnInit(): void {
    let logged=localStorage.getItem('loggedUser')
    if(logged) this.loggedUser=JSON.parse(logged)
  }

}
