import { Component, EventEmitter, Output } from '@angular/core';
import { Branch } from 'src/app/models/Branch';
import { BranchConfig } from 'src/app/models/BranchConfig';
import { BranchService } from 'src/app/service/shared/branch.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-branch-details',
  templateUrl: './branch-details.component.html',
  styleUrls: ['./branch-details.component.css'],
})
export class BranchDetailsComponent {
  branch!: Branch[];
  branchId!: number;
  BranchIdForCounter!: number;
  initiateCreateNewBranchPopUp: boolean = false;
  initiateCreateCounterPopUp: boolean = false;
  initiateAssignPopUp: boolean = false;

  // for upadeAdter add and assign
  @Output() ResetBranchUserTable = new EventEmitter<boolean>(false);
  @Output() ResetCounterTable = new EventEmitter<boolean>(false);

  constructor(
    private branchService: BranchService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.getAllBranchDetails();
    this.initiateCreateNewBranchPopUp = false;
    this.initiateCreateCounterPopUp = false;
    this.initiateAssignPopUp = false;
  }

  getAllBranchDetails() {
    this.branchService
      .getBranchDetails(this.loginService.getCompnayId())
      .subscribe((res) => {
        this.branch = res.data;
      });
  }

  onAssinBranchButtonClick(branchId: number) {
    this.initiateAssignPopUp = true;
    this.branchId = branchId;
  }

  getBranchIdForCounter(branchId: number) {
    this.initiateCreateCounterPopUp = true;
    this.BranchIdForCounter = branchId;
  }

  createNewBranch() {
    this.initiateCreateNewBranchPopUp = true;
  }

  resetCreateBranchPopup() {
    this.initiateCreateNewBranchPopUp = !this.initiateCreateNewBranchPopUp;
  }

  resetAssignBranchPopup() {
    this.initiateAssignPopUp = !this.initiateAssignPopUp;
  }

  resetCreateCounterPopup() {
    this.initiateCreateCounterPopUp = !this.initiateCreateCounterPopUp;
  }

  resetBranchUserTable() {
    this.ResetBranchUserTable.emit(true);
  }

  resetCounterTable() {
    this.ResetCounterTable.emit(true);
  }
}
