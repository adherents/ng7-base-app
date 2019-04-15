import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/shared/services/auth.service';
import { UIService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.uiService.loadingStateChanged.subscribe(isLoading => {
        this.isLoading = isLoading;
    }));
    this.subscriptions.push(
      this.authService.currentUser.subscribe(user => {
        if (!!user) {
          this.router.navigateByUrl('/blog');
        }
      })
    );
    this.loginForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { validators: [Validators.required, Validators.minLength(8)] })
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSubmit() {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
  }

}
