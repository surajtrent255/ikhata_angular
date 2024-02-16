import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/models/Bank';
import { BankWidthdraw } from 'src/app/models/Bankwithdraw';
import { DepostiWithDrawTyes } from 'src/app/models/DepositWithDrawTypes';
import { Designation } from 'src/app/models/Designation';
import { Employee } from 'src/app/models/Employee';
import { EmployeeType } from 'src/app/models/EmployeeType';
import { EmployeeService } from 'src/app/service/employee.service';
import { BankService } from 'src/app/service/shared/bank/bank.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css']
})
export class UpdateEmployeeComponent {

  @Output() destroyUpdateEmployeeCompEvent = new EventEmitter<boolean>(false);
  @Output() successfullyUpddatedEmployeeEvent = new EventEmitter<boolean>(false);
  @Input() updateEmployeeId !: number;


  employeeForm !: FormGroup;
  designations !: Designation[];
  companyId !: number;
  branchId !: number;
  employeeTypes !: EmployeeType[];
  showableDesignationComponent: boolean = true;;
  AdDateForDisplayOnly!: string
  confirmAlertDisplay: boolean = true;;
  employee !: Employee;
  constructor(private formBuilder: FormBuilder, private employeeService: EmployeeService, private toastrService: ToastrService, private loginService: LoginService) { }

  ngOnInit() {
    this.setCompanyAndBranch();
    this.getAllDesignation();
    this.getAllEmployeeType();
    this.buildForm();
    this.getEmployee(this.updateEmployeeId);
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
    this.employeeForm = this.formBuilder.group({
      sn: [null, Validators.required],
      name: [null, Validators.required],
      designation: [null, Validators.required],
      panNo: [null, Validators.required],
      salary: [null, Validators.required],
      employeeType: [null, Validators.required],
      married: [null, Validators.required],
      companyId: [this.companyId, Validators.required],
      branchId: [this.branchId, Validators.required],
      joinDate: [null, Validators.required],
      joinDateNepali: [null, Validators.required]
    })
  }

  getEmployee(id: number) {
    this.employeeService.getEmployeeById(id, this.companyId, this.branchId).subscribe({
      next: (data) => {
        this.employee = data.data;
        this.bindFetchedData();
      },
    });
  }

  bindFetchedData() {
    this.employeeForm.patchValue({
      sn: this.employee.sn,
      name: this.employee.name,
      designation: this.employee.designation,
      panNo: this.employee.panNo,
      salary: this.employee.salary,
      employeeType: this.employee.employeeType,
      married: this.employee.married,
      companyId: this.employee.companyId,
      branchId: this.employee.branchId,
      joinDate: this.convertIntoSuitableStringFormat(this.employee.joinDate),
      joinDateNepali: this.employee.joinDateNepali
    })
  }

  getAllDesignation() {
    this.employeeService.getDesignationList(this.companyId, this.branchId).subscribe(res => {
      this.designations = res.data;
      // alert(JSON.stringify(this.designations));
    })
  }

  getAllEmployeeType() {
    this.employeeService.getAllEmployeeType().subscribe(res => {
      this.employeeTypes = res.data;
    })
  }



  isFieldInvalid(field: string): boolean {
    const formControl = this.employeeForm.get(field);
    return formControl! && formControl.touched && formControl.invalid;
  }

  showDesignationComponent() {
    this.showableDesignationComponent = true;
    setTimeout(() => {
      const btnEl = document.getElementById("createDesignation") as HTMLButtonElement;
      btnEl.click();
    }, 200);

  }

  destroyComp() {
    this.destroyUpdateEmployeeCompEvent.emit(true);
  }

  designationCreated($event: any) {
    this.getAllDesignation();
    this.destoryDesignationCreateComponent();
  }

  destoryDesignationCreateComponent() {
    this.showableDesignationComponent = false;
  }



  submitForm() {
    if (this.employeeForm.valid) {
      const nepaliDateEl = document.getElementById('nepali-datepicker') as HTMLInputElement;
      const englishDateEl = document.getElementById('AdDate') as HTMLInputElement;
      let joinDateAd = new Date(englishDateEl.value + "T00:00:00");

      console.log(this.employeeForm.value)
      this.employeeService.updateEmployee({ ...this.employeeForm.value, joinDateNepali: nepaliDateEl.value, joinDate: joinDateAd }).subscribe(res => {
        this.toastrService.success("Employee updated successfully");

        this.employeeForm.patchValue({
          companyId: this.companyId,
          branchId: this.branchId,
        })

        this.successfullyUpddatedEmployeeEvent.emit(true);
      })
    } else {
      for (const controlName in this.employeeForm.controls) {
        if (this.employeeForm.controls[controlName].invalid) {
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
