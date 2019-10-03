//Aqui estará todo lo relacionado con el registro y login de usuarios
//1) Configurar datos de firebase en eviroments
//2) Se necesita instalar @angular/fire y firebase por consola con npm install --save
import { auth } from 'firebase/app';

//importaciones para ver si user is logged
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
//cambios
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserInterface } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afsAuth: AngularFireAuth, private afs: AngularFirestore) { }

  registerUser(email:string, pass:string){
    return new Promise((resolve, reject) =>{
      this.afsAuth.auth.createUserWithEmailAndPassword(email, pass)
      .then(userData => {
        resolve(userData),
        this.updateUserData(userData.user)
      }).catch( err => console.log(reject(err))); 
      
    });

  }

  loginEmailUser(email:string, pass:string){
  	return new Promise((resolve, reject) =>{
  		this.afsAuth.auth.signInWithEmailAndPassword(email, pass)
  		.then( userData => resolve(userData)),
  		err => reject(err);
  	});
  }

  loginFacebookUser(){
  	return this.afsAuth.auth.signInWithPopup(new auth.FacebookAuthProvider())
    .then(credential => this.updateUserData(credential.user));
  }

  loginGoogleUser(){
  	return this.afsAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
    .then(credential => this.updateUserData(credential.user));
  
  }

  //goodbye
  logoutUser(){
  	return this.afsAuth.auth.signOut();
  }
  //está logeado?
  isAuth(){
  	return this.afsAuth.authState.pipe(map(auth => auth));
  }


  private updateUserData(user){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: UserInterface = {
      id: user.uid,
      email: user.email,
      roles:{
        editor:true
      }
    }
    return userRef.set(data, {merge:true});
  }

  isUserAdmin(userUid){
    return this.afs.doc<UserInterface>(`users/${userUid}`).valueChanges();
  }
}
