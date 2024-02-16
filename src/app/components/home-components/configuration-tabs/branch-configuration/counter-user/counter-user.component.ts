import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserCounter } from 'src/app/models/counter/UserCounter';
import { CounterService } from 'src/app/service/shared/counter/counter.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-counter-user',
  templateUrl: './counter-user.component.html',
  styleUrls: ['./counter-user.component.css'],
})
export class CounterUserComponent {
  userCounter!: UserCounter[];

  @Input() reloadList!: boolean;
  @Output() toggleInput = new EventEmitter<boolean>(false);

  userId!: number;
  counterId!: number;
  status!: boolean;

  constructor(
    private counterService: CounterService,
    private loginService: LoginService,
    private toastrSevice: ToastrService
  ) {}

  ngOnInit() {
    this.getAllUsersForCounterListing();
  }

  getAllUsersForCounterListing() {
    this.counterService
      .getUsersForCounterListing(this.loginService.getCompnayId())
      .subscribe((res) => {
        this.userCounter = res.data;
      });
  }

  ngOnChanges() {
    if (this.reloadList) {
      setTimeout(() => {
        this.getAllUsersForCounterListing();
        this.toggleInput.emit(true);
      });
    }
  }

  enableDisableUser(e: any, userId: number, counterId: number) {
    this.userId = userId;
    this.counterId = counterId;
    this.status = e.target.checked;
  }

  onSubmit() {
    if (this.userId && this.counterId) {
      this.counterService
        .updateUserStatusInCounter(this.status, this.userId, this.counterId)
        .subscribe({
          next: (res) => {
            this.counterService.getUsersForCounterListing(
              this.loginService.getCompnayId()
            );
          },
        });
    }
  }
}
