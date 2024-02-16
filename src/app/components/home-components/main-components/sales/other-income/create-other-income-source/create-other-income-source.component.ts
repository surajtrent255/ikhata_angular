import { Component, EventEmitter, Output } from '@angular/core';
import { OtherIncomeSource } from 'src/app/models/OtherIncomeSource';
import { OtherIncomeService } from 'src/app/service/otherincome.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-create-other-income-source',
  templateUrl: './create-other-income-source.component.html',
  styleUrls: ['./create-other-income-source.component.css'],
})
export class CreateOtherIncomeSourceComponent {
  companyId!: number;
  branchId!: number;

  @Output() otherIncomeSourceAdditionCompleted = new EventEmitter<boolean>(
    false
  );
  @Output() destroyOtherIncomeSourceAdditionComponent =
    new EventEmitter<boolean>(false);

  constructor(
    private otherIncomeService: OtherIncomeService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.setCompanyAndBranch();
  }

  ngAfterViewInit() {}

  setCompanyAndBranch() {
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
  }

  destroyComp() {
    // throw new Error('Method not implemented.');
    this.destroyOtherIncomeSourceAdditionComponent.emit(true);
  }

  addOtherIncomeSource($otherIncomeSource: string) {
    let otherIncomeSource: OtherIncomeSource = new OtherIncomeSource();
    if ($otherIncomeSource.trim() !== '') {
      otherIncomeSource.name = $otherIncomeSource;
      otherIncomeSource.branchId = this.branchId;
      otherIncomeSource.companyId = this.companyId;

      this.otherIncomeService
        .createNewOtherIncomeSource(otherIncomeSource)
        .subscribe((res) => {
          this.otherIncomeSourceAdditionCompleted.emit(true);
        });
    }
  }
}
