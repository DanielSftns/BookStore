import { Injectable } from '@angular/core';
//importar
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import { BookInterface } from '../models/book';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class DataApiService {

  constructor(private afs: AngularFirestore) {
  	/*this.booksCollection = afs.collection<BookInterface>('books');
  	this.books = this.booksCollection.valueChanges();*/
  }

  private booksCollection: AngularFirestoreCollection<BookInterface>;
  private books: Observable<BookInterface[]>;
  private bookDoc:AngularFirestoreDocument<BookInterface>;
  private book:Observable<BookInterface>;

  public modoPortada:string='1';
  public selectedBook: BookInterface = {
    id: null
  };

  //trabajando con libros
  getAllBooks(){
    this.booksCollection = this.afs.collection<BookInterface>('books');
  	return this.books = this.booksCollection.snapshotChanges()
  	.pipe( map(changes => {
  		return changes.map(action =>{
  			const data = action.payload.doc.data() as BookInterface;
  			data.id = action.payload.doc.id;
  			return data;
  		});
  	}));
  }

/*  getMyBooks(userUid:string){
    this.booksCollection = this.afs.collection('books', ref => ref.where('userUid', '==', `${userUid}`));
    return this.books = this.booksCollection.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as BookInterface;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }*/

    getAllBooksOffers() {
    this.booksCollection = this.afs.collection('books', ref => ref.where('oferta', '==', '1'));
    return this.books = this.booksCollection.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as BookInterface;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }

  getOneBook(idBook:string){
  	//va a la collecion y busca la ruta segun el id
  	this.bookDoc = this.afs.doc<BookInterface>(`books/${idBook}`);
  	return this.book = this.bookDoc.snapshotChanges().pipe(map(action =>{
  		if(action.payload.exists === false){
  			return null;
  		}else{
  			const data = action.payload.data() as BookInterface;
  			data.id = action.payload.id;
  			return data;
  		}
  	}));
  }
  addBook(book:BookInterface):void{
    this.booksCollection.add(book);
  }

  updateBook(book:BookInterface):void{
    let idBook = book.id;
    this.bookDoc = this.afs.doc<BookInterface>(`books/${idBook}`);
    this.bookDoc.update(book);
  }

  deleteBokk(idBook:string):void{
    this.bookDoc = this.afs.doc<BookInterface>(`books/${idBook}`);
    this.bookDoc.delete();
  }

}
