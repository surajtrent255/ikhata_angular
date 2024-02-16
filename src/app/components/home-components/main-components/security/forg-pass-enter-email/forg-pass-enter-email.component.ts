import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-forg-pass-enter-email',
  templateUrl: './forg-pass-enter-email.component.html',
  styleUrls: ['./forg-pass-enter-email.component.css']
})
export class ForgPassEnterEmailComponent {

  processing: boolean = false;
  constructor(private formBuilder: FormBuilder,
     private loginService: LoginService, 
     private toastrService: ToastrService,
     private router: Router) { }

  ngOnInit() {
  }

  enterEmailForm = this.formBuilder.group({
    email: [null, Validators.required]
  })

  enterEmail() {
    this.processing = true;
    this.loginService.enterEmailForForgotPassword(this.enterEmailForm.value.email!).subscribe(
      (data) => {
        // Handle the successful response here
        this.toastrService.success("Email has been sent successfully. Check your email.");
        this.processing = false;
        this.router.navigateByUrl('login');
      },
      (error) => {
        this.processing = false;
        // Handle the error response here
        if (error.error && error.error.message) {
          // Display the error message from the backend
          this.toastrService.error(error.error.message, "Error");
        } else {
          // Handle generic error message when no specific message is provided
          this.toastrService.error("An error occurred. Please try again later.", "Error");
        }
        this.processing = false;
      }
    );
    
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.enterEmailForm.get(field);
    return formControl! && formControl.touched && formControl.invalid;
  }

}
