import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { AppComponent } from './app.component';
import { ListBooksComponent } from './components/admin/list-books/list-books.component';
import { DetailsBookComponent } from './components/details-book/details-book.component';
import { HeroComponent } from './components/hero/hero.component';
import { HomeComponent } from './components/home/home.component';
import { ModalComponent } from './components/modal/modal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OffersComponent } from './components/offers/offers.component';
import { LoginComponent } from './components/users/login/login.component';
import { ProfileComponent } from './components/users/profile/profile.component';
import { RegisterComponent } from './components/users/register/register.component';
import { Page404Component } from './components/page404/page404.component';
import { AuthGuard } from './guards/auth.guard';
const routes: Routes = [
{path: '', component: HomeComponent},
{path: 'offers', component: OffersComponent, canActivate:[AuthGuard]}, //TODO: only user auth
{path: 'book/:id', component: DetailsBookComponent},
{path: 'admin/list-books', component: ListBooksComponent, canActivate:[AuthGuard]}, //TODO: only user auth
{path: 'user/login', component: LoginComponent},
{path: 'user/register', component: RegisterComponent},
{path: 'user/profile', component: ProfileComponent, canActivate:[AuthGuard]}, //TODO: only user auth
{path: '**', component: Page404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
