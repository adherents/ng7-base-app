import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/shared/services/auth.service';
import { IUser } from 'src/app/shared/models/user.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public currentUser: IUser = null;
  public user: IUser;
  public isLoading = true;
  private subsciptions: Subscription[] = [];

  constructor(
    private authService: AuthService
  ) {

  }

  ngOnInit() {
    this.subsciptions.push(
      this.authService.currentUser.subscribe(user => {
        this.currentUser = user;
        this.isLoading = false;
      })
    );
  }

  ngOnDestroy() {
    this.subsciptions.forEach(sub => sub.unsubscribe());
  }

}
