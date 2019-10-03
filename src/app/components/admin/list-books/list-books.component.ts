import { Component, OnInit } from '@angular/core';

import { BookInterface } from '../../../models/book';
import { DataApiService } from '../../../services/data-api.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserInterface } from '../../../models/user';

@Component({
  selector: 'app-list-books',
  templateUrl: './list-books.component.html',
  styleUrls: ['./list-books.component.css']
})
export class ListBooksComponent implements OnInit {

  constructor(private dataApi:DataApiService, private authService:AuthService) { }
  books: BookInterface[];

  isAdmin:any = null;
  userUid: string = null;



  ngOnInit() {

    this.getCurrentUser();

  }

  getListBooks(){
      this.dataApi.getAllBooks().subscribe(books =>{
      if(this.isAdmin != true){
        console.log('NO ADMIN');
        this.books =books.filter(book => book.userUid == this.userUid);
      }else{
        console.log('ADMIN');
        this.books = books;
      }
    });
  }

  getCurrentUser(){
    this.authService.isAuth().subscribe(auth =>{
      if(auth){
        this.userUid = auth.uid;
        this.authService.isUserAdmin(this.userUid).subscribe(userRole =>{
        this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
        this.getListBooks();
        });
      }
    });
  }

  onDeleteBook(idBook:string):void{
  	console.log('delete book id:',idBook);
  	const confirmacion = confirm('Are you sure?');
  	if(confirmacion){
  		this.dataApi.deleteBokk(idBook);
  	}
  }

  onPreUpdateBook(book: BookInterface){
  	this.dataApi.selectedBook = Object.assign({}, book);
  }
}
