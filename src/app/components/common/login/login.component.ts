import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  initRegisterPopup: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit() {
    this.initRegisterPopup = false;
  }
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  /*register user popup */
  registerPopUp() {
    this.initRegisterPopup = true;
  }

  resetRegisterPopup() {
    this.initRegisterPopup = !this.initRegisterPopup;
  }
  /*register user popup end */

  loginUser() {
    if (this.loginForm.invalid) return;

    this.loginService
      .login({
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!,
      })
      .subscribe({
        next: () => {
          this.loginService.userObservable.subscribe((user) => {
            user.user.roles.forEach((role) => {
              let data = role.role.includes('SUPER_ADMIN');
              if (data === true) {
                this.router.navigateByUrl('superAdmin');
              } else {
                this.router.navigateByUrl('select/company');
              }
            });
          });
        },
      });
  }
}
