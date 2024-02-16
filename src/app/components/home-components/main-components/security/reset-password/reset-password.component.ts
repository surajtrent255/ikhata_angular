import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  @ViewChild("noMatchMsg") noMatchMsg !: ElementRef<HTMLSpanElement>;

  userToken : string = ""; 
  email:string = "";

  processing:boolean =  false;
  constructor(private activatedRoute:ActivatedRoute, 
    private formBuilder: FormBuilder, 
    private loginService: LoginService,
    private router: Router,
    private toastrService: ToastrService){
    
  }

  resetPassordForm = this.formBuilder.group({
    resetPassword:['',Validators.required],
    confirmPassword:['',Validators.required]
  })
  ngOnInit(){
    this.activatedRoute.params.subscribe(params=>{
      this.userToken = params['token'];
      this.email = params['email'];
    })
  } 

  checkPassword(confirmPassword: string){
    if(this.resetPassordForm.value.confirmPassword !== this.resetPassordForm.value.resetPassword){
      this.noMatchMsg.nativeElement.innerHTML = "password doesnot match"
  
    } else{
      this.noMatchMsg.nativeElement.innerHTML = ""

    }
  }

  submitResetPassword(){
    this. processing = true;
    let mapInfo = new Map<string, string>();
    mapInfo.set("newPassword", this.resetPassordForm.value.resetPassword!);
    mapInfo.set("token", this.userToken);
    mapInfo.set("email", this.email);
    this.loginService.resetPassword(mapInfo).subscribe((res)=>{
        this.toastrService.success(" password is reseted successfully !!!");
        this.processing = false;
        this.router.navigateByUrl('login')
    }, (error)=>{
      this.processing = false;
      this.toastrService.error("Wrong attempt !!!");

    })

  }

}
