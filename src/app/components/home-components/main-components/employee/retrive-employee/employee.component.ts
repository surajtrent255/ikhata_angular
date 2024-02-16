import { Component } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { Designation } from 'src/app/models/Designation';
import { Employee } from 'src/app/models/Employee';
import { EmployeeType } from 'src/app/models/EmployeeType';
import { EmployeeService } from 'src/app/service/employee.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent {
  availableEmployees: Employee[] = [];
  enableCreateEmployee: boolean = false;
  confirmAlertDisplay: boolean = false;
  showEmployeeEditComp: boolean = false;
  employeeEditId!: number;
  // pagination: PaginationCustom = new PaginationCustom;

  employee!: Employee;
  IsAuditor!: boolean;
  productInfoForUpdateId!: number;
  compId!: number;
  branchId!: number;

  currentPageNumber: number = 1;
  nextPage: boolean = false;
  pageTotalItems: number = 2;
  earlierPageNumber: number = 1;
  searchBy: string = 'name';
  searchWildCard: string = '';

  sortBy: string = 'id';
  deleteEmployeeId!: number;
  designations: Designation[] = [];
  employeeTypes: EmployeeType[] = [];

  constructor(
    private loginService: LoginService,
    private employeeService: EmployeeService,
    private toastrService: ToastrService,
    private ngxSmartModal: NgxSmartModalService,
    public CommonService: CommonService
  ) {}

  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.fetchLimitedEmloyees();
    this.getAllDesignation();
    this.getAllEmployeeType();
  }
  ngAfterViewInit() {
    this.CommonService.enableDragging(
      'createNewEmployeePopup',
      'createNewEmployeepopup'
    );
  }

  fetchLimitedEmloyees() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    offset = Math.max(1, offset);

    this.employeeService
      .getLimitedEmployees(
        offset,
        this.pageTotalItems,
        this.searchBy,
        this.searchWildCard,
        this.sortBy,
        this.compId,
        this.branchId
      )
      .subscribe((res) => {
        if (res.data.length === 0 || res.data === undefined) {
          this.availableEmployees = [];
          this.toastrService.error('employee not found ');
          // this.currentPageNumber -= 1;
          if (this.nextPage === true) {
            this.currentPageNumber = this.earlierPageNumber;
            this.fetchLimitedEmloyees();
            this.nextPage = false;
          }
        } else {
          this.availableEmployees = res.data;
          this.nextPage = false;
        }
      });
  }

  createNewEmployee($event) {}

  editEmployee(id: number) {
    this.showEmployeeEditComp = true;
    this.employeeEditId = id;
  }

  disableShowEditComp($event: boolean) {
    this.showEmployeeEditComp = false;
    this.fetchLimitedEmloyees();
  }

  employeeAddedSuccesfully($event) {
    this.disableShowEditComp($event);
  }

  deleteEmployee(id: number) {
    this.confirmAlertDisplay = true;
    this.deleteEmployeeId = id;
    this.ngxSmartModal.getModal('confirmAlertPopup').open();
  }

  destroyConfirmAlertSectionEmitter($event: boolean) {
    this.confirmAlertDisplay = false;
    this.ngxSmartModal.getModal('confirmAlertPopup').close();
    if ($event === true) {
      this.continuingDeleting(this.deleteEmployeeId);
    }
  }

  continuingDeleting(deleteEmployeeId: number) {
    this.employeeService
      .deleteEmployeeById(deleteEmployeeId, this.compId, this.branchId)
      .subscribe((res) => {
        this.toastrService.success(
          'Employee with id ' +
            deleteEmployeeId +
            ' has been deleted successfully.'
        );
        this.fetchLimitedEmloyees();
      });
  }

  changePage(type: string) {
    this.earlierPageNumber = this.currentPageNumber;
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
    } else if (type === 'next') {
      this.nextPage = true;
      if (this.availableEmployees.length < this.pageTotalItems) return; //this logic is only valid if api data length is less than page size. for equal below is the code.
      this.currentPageNumber += 1;
    }
    this.fetchLimitedEmloyees();
  }

  displayCreateEmployeeComp() {
    this.enableCreateEmployee = true;
    const createEmployeeEl = document.getElementById(
      'createNewEmployee'
    ) as HTMLAnchorElement;
    createEmployeeEl.click();
  }

  destoryCreateEmployee($event: boolean) {
    this.enableCreateEmployee = false;
    if ($event === true) {
      this.fetchLimitedEmloyees();
    }
    this.ngxSmartModal.getModal('createNewEmployeePopup').close();
  }

  getAllDesignation() {
    this.employeeService
      .getDesignationList(this.compId, this.branchId)
      .subscribe((res) => {
        this.designations = res.data;
      });
  }

  getAllEmployeeType() {
    this.employeeService.getAllEmployeeType().subscribe((res) => {
      this.employeeTypes = res.data;
    });
  }

  onCreate() {
    this.enableCreateEmployee = true;
    this.ngxSmartModal.getModal('createNewEmployeePopup').open();
    const dsf = document.getElementsByClassName(
      'nsm-content'
    ) as HTMLCollection;
    const el = dsf[0] as HTMLElement;
    el.style.width = '900px';
  }
}
