import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Counter } from 'src/app/models/counter/Counter';
import { BranchService } from 'src/app/service/shared/branch.service';
import { CounterService } from 'src/app/service/shared/counter/counter.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css'],
})
export class CounterComponent {
  counter: Counter[] = [];
  BranchIdForCounter!: number;
  counterStatus!: boolean;
  counterId!: number;
  @Output() triggerCounterList = new EventEmitter<boolean>(false);
  @Input() resetCounterTable!: boolean;
  @Output() toggleInput = new EventEmitter<boolean>(false);
  counterIdForAssignCounter!: number;
  branchIdForAssignCounter!: number;
  userIdForEnableDisableCounterUser!: number;
  counterIdForEnableDisableCounterUser!: number;
  statusForEnableDisableCounterUser!: boolean;

  toggleAssignCounter!: boolean;

  constructor(
    private loginService: LoginService,
    private counterService: CounterService
  ) {}

  ngOnInit() {
    this.getCounterDetails();
    this.toggleAssignCounter = false;
  }

  ngOnChanges() {
    if (this.resetCounterTable) {
      setTimeout(() => {
        this.getCounterDetails();
        this.toggleInput.emit(true);
      });
    }
  }

  //counter
  getCounterDetails() {
    this.counterService
      .getCounterDetails(this.loginService.getCompnayId())
      .subscribe((res) => {
        this.counter = res.data;
      });
  }

  onCounterCheckboxChanged(e: any, id: number) {
    this.counterStatus = e.target.checked;
    this.counterId = id;
  }

  getBranchIdForCounter(branchId: number) {
    this.BranchIdForCounter = branchId;
  }
  getCounter() {
    this.getCounterDetails();
  }

  setValuesForAssignCounter(counterId: number, branchId: number) {
    this.toggleAssignCounter = true;
    this.counterIdForAssignCounter = counterId;
    this.branchIdForAssignCounter = branchId;
  }

  getUsersForCounterListing() {
    this.triggerCounterList.emit(true);
  }

  enableDisableCounterUserData(e: any) {
    this.userIdForEnableDisableCounterUser = e.userId;
    this.counterIdForEnableDisableCounterUser = e.counterId;
    this.statusForEnableDisableCounterUser = e.status;
  }

  onCounterStatusChanged() {
    if (this.counterId) {
      this.counterService
        .enableDisableCounter(this.counterStatus, this.counterId)
        .subscribe({
          next: () => {
            this.getCounterDetails();
          },
        });
    }
  }
}
