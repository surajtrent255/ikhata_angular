import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { UserConfiguration } from 'src/app/models/user-configuration';
import { BranchService } from 'src/app/service/shared/branch.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-assign-branch',
  templateUrl: './assign-branch.component.html',
  styleUrls: ['./assign-branch.component.css'],
})
export class AssignBranchComponent {
  @Input() displayAssignBranchPopUp!: boolean;
  @Input() branchId!: number;
  @Output() emitToReset = new EventEmitter<boolean>(false);
  @Output() successfullyAdded = new EventEmitter<boolean>(false);

  @ViewChild(' closeButton') closeButton!: ElementRef;
  assignUserList!: UserConfiguration[];
  branchUserId!: number;
  branchUserTabStatus!: boolean;
  loggedInUserId!: number;

  constructor(
    private branchService: BranchService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.getUserForAssignBranchList();
    this.loggedInUserId = this.loginService.getUserId();
  }

  ngOnChanges() {
    if (this.displayAssignBranchPopUp) {
      setTimeout(() => {
        const initPopUpButton = document.getElementById(
          'assignBranchPopup'
        ) as HTMLButtonElement;
        initPopUpButton.click();
        this.emitToReset.emit(true);
      });
    }
  }

  getUserForAssignBranchList() {
    this.branchService
      .getUserForAssignBranchList(this.loginService.getCompnayId())
      .subscribe((res) => {
        this.assignUserList = res.data;
      });
  }

  onAssignBranchPopupCheckBoxChange(e: any, userId: number) {
    if (e.target.checked === true) {
      this.branchUserId = userId;
    }
  }

  onBranchAssignPopupSaveButtonClicked() {
    if (this.branchUserId !== null) {
      this.branchService
        .AssignBranchToUser(
          this.branchUserId,
          this.branchId,
          this.loginService.getCompnayId()
        )
        .subscribe({
          next: (res) => {
            this.getUserForAssignBranchList();
            this.successfullyAdded.emit(true);
            this.closeButton.nativeElement.click();
          },
        });
    }
  }
}
