import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { UserConfiguration } from 'src/app/models/user-configuration';
import { CounterService } from 'src/app/service/shared/counter/counter.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-assign-counter',
  templateUrl: './assign-counter.component.html',
  styleUrls: ['./assign-counter.component.css'],
})
export class AssignCounterComponent {
  @Input() toggleAssignCounter!: boolean;
  @Output() emitToReset = new EventEmitter<boolean>(false);

  @Input() counterId!: number;
  @Input() branchId!: number;
  @Output() successFull = new EventEmitter<boolean>(false);

  @ViewChild('assignCounterPopup', { static: true })
  assignConterButton!: ElementRef;
  @ViewChild('closeButton', { static: false })
  closeButton!: ElementRef;

  assignCounterUsers!: UserConfiguration[];
  SelectedUserForAssignCounter!: number;

  BranchId!: number;
  CounterId!: number;

  ngOnChanges() {
    if (this.toggleAssignCounter && this.counterId && this.branchId) {
      setTimeout(() => {
        this.assignConterButton.nativeElement.click();
        this.emitToReset.emit(true);
        this.BranchId = this.branchId;
        this.CounterId = this.counterId;
        this.getUsersForAssignCounter();
      });
    }
  }

  constructor(
    private counterService: CounterService,
    public loginService: LoginService
  ) {}

  ngOnInit() {}

  getUsersForAssignCounter() {
    this.counterService
      .getUsersForAssignCounter(this.loginService.getCompnayId(), this.BranchId)
      .subscribe((res) => {
        this.assignCounterUsers = res.data;
      });
  }

  assignCounterChange(e: any, userId: number) {
    if (e.target.checked === true) {
      this.SelectedUserForAssignCounter = userId;
    }
  }

  onSave() {
    this.counterService
      .assignUsersToCounter({
        branchId: this.BranchId,
        companyId: this.loginService.getCompnayId(),
        counterId: this.CounterId,
        userId: this.SelectedUserForAssignCounter,
        date: new Date(),
        id: 0,
        name: '',
        status: true,
      })
      .subscribe({
        next: (res) => {
          this.getUsersForAssignCounter();
          this.successFull.emit(true);
          this.closeButton.nativeElement.click();
        },
        complete() {},
      });
  }
}
