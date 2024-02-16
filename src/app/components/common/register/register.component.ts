import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/service/shared/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  @Input() clickPopUp!: boolean;
  @Output() emitToReset = new EventEmitter<boolean>(false);

  @ViewChild('closeButton') cloaseButtonRef!: ElementRef<HTMLButtonElement>;

  private shouldClickButton = false;

  RegisterForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl(''),
    registerEmail: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.minLength(10)]),
    registerPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  constructor(
    private loginService: LoginService,
    private cdr: ChangeDetectorRef,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.clickPopUp) {
      setTimeout(() => {
        this.RegisterForm.reset();
        const button = document.getElementById(
          'registerPopup'
        ) as HTMLButtonElement;
        button.click();
        this.emitToReset.emit(true);
        this.cdr.detectChanges();
      });
    }
  }

  registerUser() {
    if (this.RegisterForm.invalid) {
      this.toastrService.error('Please Enter All Field');
    } else {
      this.loginService
        .register({
          firstname: this.RegisterForm.value.firstname!,
          lastname: this.RegisterForm.value.lastname!,
          email: this.RegisterForm.value.registerEmail!,
          phone: this.RegisterForm.value.phone!,
          password: this.RegisterForm.value.registerPassword!,
        })
        .subscribe({
          next: (res) => {
            if (res) {
              this.cloaseButtonRef.nativeElement.click();
            }
          },
        });
    }
  }
}
