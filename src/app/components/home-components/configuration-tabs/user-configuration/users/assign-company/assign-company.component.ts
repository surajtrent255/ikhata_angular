import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserConfiguration } from 'src/app/models/user-configuration';
import { LoginService } from 'src/app/service/shared/login.service';
import { RoleService } from 'src/app/service/shared/role.service';
import { UserConfigurationService } from 'src/app/service/shared/user-configuration.service';

@Component({
  selector: 'app-assign-company',
  templateUrl: './assign-company.component.html',
  styleUrls: ['./assign-company.component.css'],
})
export class AssignCompanyComponent {
  @Input() initPopup!: boolean;
  @Output() resetAsignPopup = new EventEmitter<boolean>(false);

  @Output() assignSuccessfull = new EventEmitter<boolean>(false);

  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

  allUsers!: UserConfiguration[];
  assignCompanyStatus!: boolean;
  assignCompanyUserId: number[] = [];
  loggedInUserId!: number;
  currentPageNumber: number = 1;
  pageTotalItems: number = 5;
  searchInput: string = '';

  constructor(
    private userConfigurationService: UserConfigurationService,
    private loginService: LoginService,
    private roleService: RoleService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.loggedInUserId = this.loginService.getUserId();
    this.getAllUser();
  }

  ngOnChanges() {
    if (this.initPopup) {
      setTimeout(() => {
        const initAssignPopup = document.getElementById(
          'assignCompanyPopup'
        ) as HTMLButtonElement;
        initAssignPopup.click();
        this.resetAsignPopup.emit(true);
      });
    }
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.getAllUser();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.getAllUser();
    }
  }

  getAllUser(isClearSearch?) {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    offset = Math.max(1, offset);
    if (isClearSearch) {
      this.searchInput = '';
    }
    this.userConfigurationService
      .getAllUser(
        this.loginService.getCompnayId(),
        offset,
        this.pageTotalItems,
        this.searchInput
      )
      .subscribe((res) => {
        this.allUsers = res.data;
      });
  }

  onAssignCompanyChange(e: any, userId: number) {
    this.assignCompanyStatus = e.target.checked;
    let status = e.target.checked;
    if (status === true) {
      this.assignCompanyUserId.push(userId);
    } else {
      this.assignCompanyUserId.pop();
    }
  }

  onAssignCompanySaveClicked() {
    if (this.assignCompanyStatus !== null) {
      if (this.assignCompanyStatus == true) {
        let companyId = this.loginService.getCompnayId();
        this.userConfigurationService
          .assignCompanyToUser(companyId, this.assignCompanyUserId)
          .subscribe({
            next: () => {
              this.toastrService.success('Succesfully Added');
              this.closeButton.nativeElement.click();
              this.getAllUser();
              this.assignCompanyUserId = [];
            },
          });
        this.roleService
          .addToMultipleUserRole(this.assignCompanyUserId, companyId, 2)
          .subscribe({
            next: () => {},
          });
      } else {
        this.toastrService.error('Please select a user');
      }
      this.assignSuccessfull.emit(true);
    }
  }
}
