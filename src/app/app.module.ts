import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileComponent } from './pages/profile/edit-profile/edit-profile.component';
import { PostDashboardComponent } from './pages/posts/post-dashboard/post-dashboard.component';
import { PostDetailComponent } from './pages/posts/post-detail/post-detail.component';
import { PostListComponent } from './pages/posts/post-list/post-list.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './shared/navigation/header/header.component';
import { SidenavListComponent } from './shared/navigation/sidenav-list/sidenav-list.component';
import { environment } from 'src/environments/environment';
import { Page404Component } from './pages/page404/page404.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    EditProfileComponent,
    PostDashboardComponent,
    PostDetailComponent,
    PostListComponent,
    HeaderComponent,
    SidenavListComponent,
    Page404Component
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
