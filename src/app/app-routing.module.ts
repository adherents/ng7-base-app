import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostListComponent } from './pages/posts/post-list/post-list.component';
import { PostDetailComponent } from './pages/posts/post-detail/post-detail.component';
import { PostDashboardComponent } from './pages/posts/post-dashboard/post-dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileComponent } from './pages/profile/edit-profile/edit-profile.component';
import { AuthGuard } from './shared/services/auth.guard';
import { IsOwnerGuard } from './shared/services/is-owner.guard';
import { Page404Component } from './pages/page404/page404.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'blog', component: PostListComponent, canActivate: [AuthGuard] },
  { path: 'blog/:id', component: PostDetailComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: PostDashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile/:userId', component: ProfileComponent, canActivate: [AuthGuard, IsOwnerGuard] },
  { path: 'profile/:userId/edit', component: EditProfileComponent, canActivate: [AuthGuard, IsOwnerGuard] },
  { path: '**', component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
