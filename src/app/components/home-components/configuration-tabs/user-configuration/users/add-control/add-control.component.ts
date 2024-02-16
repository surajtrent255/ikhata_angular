import { ViewEncapsulation } from '@angular/compiler';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FeatureControl } from 'src/app/models/Feature Control/feature-control';
import { UserFeature } from 'src/app/models/Feature Control/user-feature';
import { FeatureControlService } from 'src/app/service/shared/Feature-Control/feature-control.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-add-control',
  templateUrl: './add-control.component.html',
  styleUrls: ['./add-control.component.css'],
})
export class AddControlComponent {
  @Input() toggleControlPopUp!: boolean;
  @Output() emitToReset = new EventEmitter<boolean>(false);

  @ViewChild('addControlPopup') togglePopUp!: ElementRef;
  @ViewChild('closeButton') closeButton!: ElementRef;

  @Input() userId!: number;
  @Output() ControlAssignedSuccess = new EventEmitter<boolean>(false);

  feature!: FeatureControl[];
  userFeature!: UserFeature[];
  SelectedUser!: number;
  companyName!: string;
  controls: number[] = [];

  constructor(
    private featureControlService: FeatureControlService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    const parsedData = this.loginService.getCompany();
    const { name, companyId } = parsedData;
    this.companyName = name;

    this.featureControlService.getFeatureControls().subscribe((res) => {
      this.feature = res.data;
    });
  }

  ngOnChanges() {
    if (this.toggleControlPopUp) {
      setTimeout(() => {
        this.togglePopUp.nativeElement.click();
        this.emitToReset.emit(true);
      });
    }
    if (this.userId) {
      setTimeout(() => {
        this.SelectedUser = this.userId;
        this.getAllFeatureControlOfUserByUserId();
      });
    }
  }

  getAllFeatureControlOfUserByUserId() {
    this.featureControlService
      .getAllFeatureControlOfUserByUserId(
        this.loginService.getCompnayId(),
        this.SelectedUser
      )
      .subscribe((res) => {
        this.userFeature = res.data;
      });
  }

  hasControl(feature: string) {
    if (!this.userFeature) {
      return;
    } else {
      return this.userFeature.some((userControl) =>
        userControl.feature.includes(feature)
      );
    }
  }

  AddFeature(e: any, featureId: number) {
    let status = e.target.checked;
    // this.controls = featureId;
    if (status === true) {
      this.controls.push(featureId);
    } else {
      this.controls.pop();
    }
  }

  AssignControl() {
    if (this.controls) {
      this.featureControlService
        .assignFeatureControlToUser(
          this.controls,
          this.SelectedUser,
          this.loginService.getCompnayId()
        )
        .subscribe({
          next: (res) => {
            this.getAllFeatureControlOfUserByUserId();
            this.ControlAssignedSuccess.emit(true);
            this.closeButton.nativeElement.click();
          },
        });
    }
  }
}
