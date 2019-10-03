import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../services/auth.service';

/*import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';*/

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(/*public afAuth: AngularFireAuth,*/ private router:Router, private authService: AuthService) { }

  ngOnInit() {
  }

  email:string = '';
  password:string = '';

  //METODOS DE LOGIN

  onLogin():void{
  	this.authService.loginEmailUser(this.email, this.password)
  	.then(( res ) => {
  		this.onLoginRedirect();
  	}).catch( err => console.log('err', err.message));
  }

  onLoginGoogle(){
  	//se llama al metodo en el servicio y se comprueba el resultado si es favorable o no (promesa)
  	this.authService.loginGoogleUser()
  	.then((res) =>{
  		console.log('resUser',res);
  		this.onLoginRedirect();
  	}).catch( err => console.log('err', err.message));
  }

  onLoginFacebook(){
  	//se llama al metodo en el servicio y se comprueba el resultado si es favorable o no (promesa)
  	this.authService.loginFacebookUser()
  	.then((res) =>{
  		console.log('resUser',res);
  		this.onLoginRedirect();
  	}).catch( err => console.log('err', err.message));  	
  }

  onLogout(){
  	this.authService.logoutUser();
  }

  onLoginRedirect():void{
	this.router.navigate(['admin/list-books']);
  }

}
