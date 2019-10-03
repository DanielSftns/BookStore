import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service'; 
import { Router } from '@angular/router';

//para la imagen a subir
import { AngularFireStorage } from '@angular/fire/storage';
//para recuperar la imagen subida
import { finalize } from 'rxjs/operators';

import { Observable } from 'rxjs/internal/Observable';
 
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild('imageUser',{static:true}) inputImageUser:ElementRef;  
 
  email:string='';
  password:string='';

  //porcentage de subida
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;


  constructor(private authService:AuthService, private router:Router, private storage:AngularFireStorage) { }
 
  
  ngOnInit() {
  }


//problema: la imagen se sube aun así el user no se registre, aun no se como arreglarlo.
//lo mejor  seria que la opcion de subir imagen esté cuando el user esté logueado
  onUpload(e){
  	//console.log(e.target.files[0]);
  	const id = Math.random().toString(36).substring(2);
  	const file = e.target.files[0];
  	const filePath = `uploads/profile_${id}`; //ruta del fichero
  	
    const ref = this.storage.ref(filePath);
  	const task = this.storage.upload(filePath, file);
  	//esta de arriba es donde realmente se sube la imagen
  	this.uploadPercent = task.percentageChanges();
  	task.snapshotChanges().pipe(finalize(()=> this.urlImage = ref.getDownloadURL())).subscribe();
  	//esta de arriba para recuperar la ruta de la imagen
  }

  onAddUser(){
  	this.authService.registerUser(this.email, this.password)
	.then((res) =>{
		this.authService.isAuth().subscribe(user =>{
			//devuelve el usuario logeado
			if(user){
				//console.log('user Actual', user);
				user.updateProfile({
					displayName: '',
					photoURL: this.inputImageUser.nativeElement.value
				}).then(()=>{
					console.log("USER UPDATE");
					this.router.navigate(['admin/list-books']);
				}).catch((error)=> console.log('error',error));
				
			}
		});
		//this.router.navigate(['admin/list-books']);
	}).catch(err => console.log('err', err.message));  	
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

  onLoginRedirect():void{
	this.router.navigate(['admin/list-books']);
  }

}
