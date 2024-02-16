import { Component, EventEmitter, Output } from '@angular/core';
import { Designation } from 'src/app/models/Designation';
import { EmployeeService } from 'src/app/service/employee.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-create-designation',
  templateUrl: './create-designation.component.html',
  styleUrls: ['./create-designation.component.css']
})
export class CreateDesignationComponent {

  companyId !: number;
  branchId !: number;

  @Output() designationAdditionCompleted = new EventEmitter<boolean>(false);
  @Output() destroyDesignationAdditionComponent = new EventEmitter<boolean>(false);

  constructor(private employeeService: EmployeeService, private loginService: LoginService) {

  }

  ngOnInit() {
    this.setCompanyAndBranch();
  }


  setCompanyAndBranch() {
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
  }

  destroyComp() {
    // throw new Error('Method not implemented.');
    this.destroyDesignationAdditionComponent.emit(false);
    // this.destroyDesignationAdditionComponent.emit(true);
  }



  addDesignation($designation: string) {
    let designation: Designation = new Designation;
    if ($designation.trim() !== "") {
      designation.title = $designation;
      designation.companyId = this.companyId;
      designation.branchId = this.branchId;

      this.employeeService.createNewDesignation(designation).subscribe(res => {
        // this.getAllDesignation();
        this.designationAdditionCompleted.emit(true);
      })
    }
  }
}
