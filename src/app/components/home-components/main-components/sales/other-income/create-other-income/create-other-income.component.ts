import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { EmployeeType } from 'src/app/models/EmployeeType';
import { OtherIncomeSource } from 'src/app/models/OtherIncomeSource';
import { OtherIncomeService } from 'src/app/service/otherincome.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-create-other-income',
  templateUrl: './create-other-income.component.html',
  styleUrls: ['./create-other-income.component.css'],
})
export class CreateOtherIncomeComponent {
  @Output() successfullyAddedOtherIncomeEvent = new EventEmitter<boolean>(
    false
  );
  @Output() destroyCreateOtherIncomeComponent = new EventEmitter<boolean>(
    false
  );
  otherIncomeForm!: FormGroup;
  otherIncomeSources!: OtherIncomeSource[];
  companyId!: number;
  branchId!: number;
  employeeTypes!: EmployeeType[];
  showableOtherIncomeSourceComponent: boolean = false;
  AdDateForDisplayOnly!: string;
  confirmAlertDisplay: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private otherIncomeService: OtherIncomeService,
    private toastrService: ToastrService,
    private ngxSmartModalService: NgxSmartModalService,
    private loginService: LoginService,
    public CommonService: CommonService
  ) {}

  ngOnInit() {
    this.setCompanyAndBranch();
    this.getAllOtherIncomeSources();
    this.buildForm();
  }

  setCompanyAndBranch() {
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
  }

  ngOnChanges() {}

  setCss() {}

  ngAfterViewInit() {
    // this.setCss();
    this.CommonService.enableDragging(
      'createOtherIncomeSource',
      'createOtherIncomesource'
    );
    setTimeout(() => {
      const dateEl = document.getElementById(
        'nepali-datepicker'
      ) as HTMLInputElement;
      dateEl.value = String(adToBs(new Date().toJSON().slice(0, 10)));

      const dateAdEl = document.getElementById('AdDate') as HTMLInputElement;
      dateAdEl.value = new Date().toJSON().slice(0, 10);
      this.AdDateForDisplayOnly = dateAdEl.value;
    }, 100);
  }

  buildForm() {
    this.otherIncomeForm = this.formBuilder.group({
      source: [null, Validators.required],
      amount: [null, Validators.required],
      companyId: [this.companyId, Validators.required],
      branchId: [this.branchId, Validators.required],
    });
  }

  getAllOtherIncomeSources() {
    this.otherIncomeService
      .getOtherIncomeSourceList(this.companyId, this.branchId)
      .subscribe((res) => {
        this.otherIncomeSources = res.data;
      });
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.otherIncomeForm.get(field);
    return formControl! && formControl.touched && formControl.invalid;
  }

  showCreateOtherIncomeSourceComponent() {
    this.showableOtherIncomeSourceComponent = true;
    this.ngxSmartModalService.getModal('createOtherIncomeSource').open();
  }

  destroyComp() {
    this.destroyCreateOtherIncomeComponent.emit(true);
  }

  OtherIncomeSourceCreated($event: any) {
    this.getAllOtherIncomeSources();
    this.toastrService.success('successfully added !!!');
    this.destoryOtherIncomeSourceCreateComponent($event);
  }

  destoryOtherIncomeSourceCreateComponent($event: any) {
    this.showableOtherIncomeSourceComponent = false;
    this.ngxSmartModalService.getModal('createOtherIncomeSource').close();
  }

  submitForm() {
    if (this.otherIncomeForm.valid) {
      const nepaliDateEl = document.getElementById(
        'nepali-datepicker'
      ) as HTMLInputElement;
      const englishDateEl = document.getElementById(
        'AdDate'
      ) as HTMLInputElement;
      let joinDateAd = new Date(englishDateEl.value + 'T00:00:00');
      this.otherIncomeService
        .createNewOtherIncome({
          ...this.otherIncomeForm.value,
          dateNepali: nepaliDateEl.value,
          dateEnglish: joinDateAd,
        })
        .subscribe((res) => {
          this.toastrService.success('Other Income created successfully');
          this.otherIncomeForm.reset();

          this.otherIncomeForm.patchValue({
            companyId: this.companyId,
            branchId: this.branchId,
          });
          this.successfullyAddedOtherIncomeEvent.emit(true);
        });
    } else {
      for (const controlName in this.otherIncomeForm.controls) {
        if (this.otherIncomeForm.controls[controlName].invalid) {
          console.log(`Invalid control: ${controlName}`);
        }
      }
    }
  }
}
