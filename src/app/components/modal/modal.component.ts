import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

import { BookInterface } from '../../models/book';
import { DataApiService } from '../../services/data-api.service';
import { NgForm } from '@angular/forms';

import { AuthService } from '../../services/auth.service'; 
import { Router } from '@angular/router';

//para la imagen a subir
import { AngularFireStorage } from '@angular/fire/storage';
//para recuperar la imagen subida
import { finalize } from 'rxjs/operators';

import { Observable } from 'rxjs/internal/Observable';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  

  //UrlImage='https://firebasestorage.googleapis.com/v0/b/storebook-e25d4.appspot.com/o/uploads%2Fprofile_5jqi2ku9rka?alt=media&token=8cf3add3-2305-48eb-8e9f-8f0012c852e0';

    //porcentage de subida
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  constructor(public dataApi: DataApiService, private authService:AuthService, private router:Router, private storage:AngularFireStorage) { }

  @ViewChild('btnClose',{static:true}) btnClose: ElementRef;
  @Input() userUid: string;
  @ViewChild('imageBook',{static:true}) inputImageBook:ElementRef; 
  ngOnInit() {

  }
  changePortada(e){
    //console.log(e.target.value);
    //if(e.target.value == '1'){
      this.dataApi.selectedBook.portada = '';
      this.urlImage= null;
    //}
  }

  cerrar(){
    //console.log('cerrar');
    //vaciar formulario
    this.dataApi.selectedBook = {
    id: null
  };
    this.dataApi.modoPortada='1';
    this.inputImageBook.nativeElement.value='';
  }

  onClick(event) {
    const target = event.target;
    if(target.id == 'modalBook'){
        this.cerrar();
      }
  }

  onSaveBook(bookForm: NgForm):void{
  	if(bookForm.value.id == null){
  		//new
      bookForm.value.userUid = this.userUid;
      //esto de arriba para guardar quin creó un libro
  		this.dataApi.addBook(bookForm.value);
  	}else{
  		//update
  		this.dataApi.updateBook(bookForm.value);
  	}
  	//vaciar formulario
  	bookForm.resetForm();
  	this.btnClose.nativeElement.click();
  }

    onUpload(e){
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `uploads/profile_${id}`; //ruta del fichero
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    //esta de arriba es donde realmente se sube la imagen
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(()=>{
      this.urlImage = ref.getDownloadURL();

        setTimeout(()=>{
          this.dataApi.selectedBook.portada = this.inputImageBook.nativeElement.value;
        },1500);
        //esto puede er mejor, con una promesa o algo así

       
    })).subscribe();
    //esta de arriba para recuperar la ruta de la imagen
  }



}
