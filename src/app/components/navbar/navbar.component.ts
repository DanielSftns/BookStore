import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  app_name:string = 'BookStore';
  isLogged:boolean = false;

  constructor(private authService: AuthService, private afsAuth: AngularFireAuth) { }

  ngOnInit() {
  	this.getCurrentUser();
  }

  //comporbar si usuario is logged
  getCurrentUser(){
  	this.authService.isAuth().subscribe(auth =>{
  		if(auth){
  			console.log('user Logged');
  			this.isLogged = true;
  		}else{
  			console.log('NOT user logged');
  			this.isLogged = false;
  		}
  	});
  }

  onLogout(){
  	this.afsAuth.auth.signOut();
  }

}
