import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FeatureControlService } from 'src/app/service/shared/Feature-Control/feature-control.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { UserFeature } from 'src/app/models/Feature Control/user-feature';
@Component({
  selector: 'app-user-feature',
  templateUrl: './user-feature.component.html',
  styleUrls: ['./user-feature.component.css'],
})
export class UserFeatureComponent {
  @Input() IsTriggered!: boolean;
  @Output() emitToReset = new EventEmitter<boolean>(false);
  @Input() headerEvent!: boolean;

  currentPageNumber: number = 1;
  pageTotalItems: number = 5;
  searchInput: string = '';

  userFeature!: UserFeature[];

  // v2 changes
  SelectedUserForenableDisableFeatureControl!: number;
  SelectedStatusForEnableDisableFeatureControl!: boolean;
  SelectedFeatureIdForEnableDisableFeatureControl!: number;
  EnableDisableFeatureControlBoolean: boolean = false;

  constructor(
    private featureControlService: FeatureControlService,
    private LoginService: LoginService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.fetchLimitedUserFeatureForSearch();
  }

  ngAfterViewInit() {
    this.fetchLimitedUserFeatureForSearch();
  }

  getFeatureControlOfUsersForListing() {
    this.featureControlService
      .getFeatureControlOfUsersForListing(this.LoginService.getCompnayId())
      .subscribe((res) => {
        this.userFeature = res.data;
      });
  }

  ngOnChanges() {
    if (this.IsTriggered === true) {
      setTimeout(() => {
        this.fetchLimitedUserFeatureForSearch();
        this.emitToReset.emit(true);
      });
    }
    if (this.headerEvent === true) {
      this.getFeatureControlOfUsersForListing();
    }
  }
  onUserFeatureChange(e: any, userId: number, featureId: number) {
    this.SelectedUserForenableDisableFeatureControl = userId;
    this.SelectedStatusForEnableDisableFeatureControl = e.target.checked;
    this.SelectedFeatureIdForEnableDisableFeatureControl = featureId;
    this.EnableDisableFeatureControlBoolean = true;
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedUserFeatureForSearch();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedUserFeatureForSearch();
    }
  }

  fetchLimitedUserFeatureForSearch() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    offset = Math.max(1, offset);
    this.featureControlService
      .getLimitedUserFeatureForSearch(
        offset,
        this.pageTotalItems,
        this.LoginService.getCompnayId(),
        this.searchInput
      )
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.userFeature = [];
          this.toastrService.error('No Feature Found');
        } else {
          this.userFeature = res.data;
        }
      });
  }

  onSubmit() {
    if (
      this.EnableDisableFeatureControlBoolean &&
      this.SelectedFeatureIdForEnableDisableFeatureControl !== null &&
      this.SelectedUserForenableDisableFeatureControl !== undefined
    ) {
      this.featureControlService
        .enableDisableFeatureControlForUser(
          this.SelectedUserForenableDisableFeatureControl,
          this.SelectedStatusForEnableDisableFeatureControl,
          this.SelectedFeatureIdForEnableDisableFeatureControl
        )
        .subscribe({
          next: (res) => {
            this.EnableDisableFeatureControlBoolean = false;
            this.toastrService.success('Feature Successfully Changed');
            this.fetchLimitedUserFeatureForSearch();
          },
          error: () => {
            this.toastrService.error('Something Went Wrong');
            this.fetchLimitedUserFeatureForSearch();
          },
        });
    } else {
      this.toastrService.error('Something went wrong');
    }
  }
}
