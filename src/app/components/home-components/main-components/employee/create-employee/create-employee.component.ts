import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { Designation } from 'src/app/models/Designation';
import { Employee } from 'src/app/models/Employee';
import { EmployeeType } from 'src/app/models/EmployeeType';
import { EmployeeService } from 'src/app/service/employee.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent {


  @Output() successfullyAddedEmployeeEvent = new EventEmitter<boolean>(false);
  employeeForm !: FormGroup;
  designations !: Designation[];
  companyId !: number;
  branchId !: number;
  employeeTypes !: EmployeeType[];
  showableDesignationComponent: boolean = true;;
  AdDateForDisplayOnly!: string
  confirmAlertDisplay: boolean = true;;

  constructor(private formBuilder: FormBuilder, private employeeService: EmployeeService,
     private toastrService: ToastrService,
      private loginService: LoginService,
      private ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
    this.setCompanyAndBranch();
    this.getAllDesignation();
    this.getAllEmployeeType();
    this.buildForm();

  }

  setCompanyAndBranch() {
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
  }

  ngAfterViewInit() {
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
    this.employeeForm = this.formBuilder.group({
      name: [null, Validators.required],
      designation: [null, Validators.required],
      panNo: [null, Validators.required],
      salary: [null, Validators.required],
      employeeType: [null, Validators.required],
      married: [null, Validators.required],
      companyId: [this.companyId, Validators.required],
      branchId: [this.branchId, Validators.required],
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
    // setTimeout(() => {
    //   const btnEl = document.getElementById("createDesignation") as HTMLButtonElement;
    //   btnEl.click();
    // }, 200);
    this.ngxSmartModalService.getModal("createDesignationPopup").open();


  }

  destroyComp() {
    this.successfullyAddedEmployeeEvent.emit(false);
  }

  designationCreated($event: any) {
    this.getAllDesignation();
    this.destoryDesignationCreateComponent();
  }

  destoryDesignationCreateComponent() {
    this.showableDesignationComponent = false;
    this.ngxSmartModalService.getModal("createDesignationPopup").close(); 
  }



  submitForm() {
    if (this.employeeForm.valid) {
      const nepaliDateEl = document.getElementById('nepali-datepicker') as HTMLInputElement;
      const englishDateEl = document.getElementById('AdDate') as HTMLInputElement;
      let joinDateAd = new Date(englishDateEl.value + "T00:00:00");
      this.employeeService.createNewEmployee({ ...this.employeeForm.value, joinDateNepali: nepaliDateEl.value, joinDate: joinDateAd }).subscribe(res => {
        this.toastrService.success("Employee created successfully");
        this.employeeForm.reset();

        this.employeeForm.patchValue({
          companyId: this.companyId,
          branchId: this.branchId,
        })
        // this.employeeForm = this.formBuilder.group({
        //   companyId: [this.companyId, Validators.required],
        //   branchId: [this.branchId, Validators.required],
        // });
        this.successfullyAddedEmployeeEvent.emit(true);
      })
    } else {
      for (const controlName in this.employeeForm.controls) {
        if (this.employeeForm.controls[controlName].invalid) {
          console.log(`Invalid control: ${controlName}`);
        }
      }
    }
  }
}
