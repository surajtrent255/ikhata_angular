import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import { ToastrService } from 'ngx-toastr';
import { OtherIncome } from 'src/app/models/OtherIncome';
import { OtherIncomeSource } from 'src/app/models/OtherIncomeSource';
import { OtherIncomeService } from 'src/app/service/otherincome.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-update-other-income',
  templateUrl: './update-other-income.component.html',
  styleUrls: ['./update-other-income.component.css']
})
export class UpdateOtherIncomeComponent {
  @Input() updateOtherIncomeId!: number;
  @Output() destroyUpdateOtherIncomeCompEvent = new EventEmitter<boolean>(false);
  @Output() successfullyUpddatedOtherIncomeEvent = new EventEmitter<boolean>(false);
  otherIncomeForm !: FormGroup;
  otherIncomeSources !: OtherIncomeSource[];
  companyId !: number;
  branchId !: number;
  otherIncome !: OtherIncome;
  showableOtherIncomeSourceComponent: boolean = false;;
  AdDateForDisplayOnly!: string
  confirmAlertDisplay: boolean = true;;
  constructor(private formBuilder: FormBuilder, private otherIncomeService: OtherIncomeService, private toastrService: ToastrService, private loginService: LoginService) { }

  ngOnInit() {
    this.setCompanyAndBranch();
    this.getOtherIncome(this.updateOtherIncomeId);

    this.getAllOtherIncomeSources();
    this.buildForm();

  }

  setCompanyAndBranch() {
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   const dateEl = document.getElementById(
    //     'nepali-datepicker'
    //   ) as HTMLInputElement;
    //   dateEl.value = String(adToBs(new Date().toJSON().slice(0, 10)));

    //   const dateAdEl = document.getElementById('AdDate') as HTMLInputElement;
    //   dateAdEl.value = new Date().toJSON().slice(0, 10);
    //   this.AdDateForDisplayOnly = dateAdEl.value;
    // }, 100);
  }

  buildForm() {
    this.otherIncomeForm = this.formBuilder.group({
      sn: [null, Validators.required],
      source: [null, Validators.required],
      amount: [null, Validators.required],
      companyId: [this.companyId, Validators.required],
      branchId: [this.branchId, Validators.required],
      dateEnglish: [null, Validators.required],
      dateNepali: [null, Validators.required]
    })
  }

  getOtherIncome(id: number) {
    this.otherIncomeService.getOtherIncomeById(id, this.companyId, this.branchId).subscribe({
      next: (data) => {
        this.otherIncome = data.data;
        setTimeout(()=>{
          this.bindFetchedData();
        }, )
      },
    });
  }

  bindFetchedData() {
    this.otherIncomeForm.patchValue({
      sn: this.otherIncome.sn,
      source: this.otherIncome.source,
      amount: this.otherIncome.amount,
      companyId: this.otherIncome.companyId,
      branchId: this.otherIncome.branchId,
      dateEnglish: this.convertIntoSuitableStringFormat(this.otherIncome.dateEnglish),
      dateNepali: this.otherIncome.dateNepali
    })
  }

  getAllOtherIncomeSources() {
    this.otherIncomeService.getOtherIncomeSourceList(this.companyId, this.branchId).subscribe(res => {
      this.otherIncomeSources = res.data;
    })
  }


  isFieldInvalid(field: string): boolean {
    const formControl = this.otherIncomeForm.get(field);
    return formControl! && formControl.touched && formControl.invalid;
  }

  showCreateOtherIncomeSourceComponent() {
    this.showableOtherIncomeSourceComponent = true;
    setTimeout(() => {
      const btnEl = document.getElementById("createNewOtherIncomeSource") as HTMLButtonElement;
      btnEl.click();
    }, 200);
  }

  destroyComp() {
    this.destroyUpdateOtherIncomeCompEvent.emit(true);
  }

  OtherIncomeSourceCreated($event: any) {
    this.getAllOtherIncomeSources();
    this.toastrService.success("successfully added !!!")
    this.destoryOtherIncomeSourceCreateComponent($event);
  }

  destoryOtherIncomeSourceCreateComponent($event: any) {
    this.showableOtherIncomeSourceComponent = false;
    const sourceCreateEl = document.getElementById("createNewOtherIncomeSourcePopup") as HTMLDivElement;
    if (sourceCreateEl) {
      sourceCreateEl.style.display = "none"
    }
  }

  submitForm() {
    if (this.otherIncomeForm.valid) {
      const nepaliDateEl = document.getElementById('nepali-datepicker') as HTMLInputElement;
      const englishDateEl = document.getElementById('AdDate') as HTMLInputElement;
      let joinDateAd = new Date(englishDateEl.value + "T00:00:00");
      this.otherIncomeService.updateOtherIncome({ ...this.otherIncomeForm.value, dateNepali: nepaliDateEl.value, dateEnglish: joinDateAd }).subscribe(res => {
        this.toastrService.success("Other Income updated successfully");
        this.otherIncomeForm.reset();

        this.otherIncomeForm.patchValue({
          companyId: this.companyId,
          branchId: this.branchId,
        })
        this.successfullyUpddatedOtherIncomeEvent.emit(true);
      })
    } else {
      for (const controlName in this.otherIncomeForm.controls) {
        if (this.otherIncomeForm.controls[controlName].invalid) {
          console.log(`Invalid control: ${controlName}`);
        }
      }
    }
  }

  convertIntoSuitableStringFormat(data: any) {
    const dateString = "Mon Jul 17 2023 00:00:00 GMT-0400 (Eastern Daylight Time)";
    const dateObj = new Date(dateString);

    // Extract the year, month, and day from the date object
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1 and pad with leading zeros if necessary
    const day = String(dateObj.getDate()).padStart(2, "0");

    // Create the formatted date string in "YYYY-MM-DD
    return `${year}-${month}-${day}`;
  }
}
