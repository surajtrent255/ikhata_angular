import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { District } from 'src/app/models/District';
import { Municipality } from 'src/app/models/Municipality';
import { Province } from 'src/app/models/Province';
import { DistrictAndProvinceService } from 'src/app/service/shared/district-and-province.service';
import { LoginService } from '../../../../../service/shared/login.service';
import { BranchService } from 'src/app/service/shared/branch.service';

@Component({
  selector: 'app-create-branch',
  templateUrl: './create-branch.component.html',
  styleUrls: ['./create-branch.component.css'],
})
export class CreateBranchComponent {
  @Input() displaycreateNewBranchPopUp!: boolean;
  @Output() emitToReset = new EventEmitter<boolean>(false);
  @Output() successfullyAdded = new EventEmitter<boolean>(false);

  provinceId!: number;
  districtId!: number;
  districts!: District[];
  province!: Province[];
  municipality!: Municipality[];

  @ViewChild('createNewCompanyPopup')
  createNewCompanyPopupButton!: ElementRef<HTMLButtonElement>;

  BranchRegistrationForm = new FormGroup({
    BranchName: new FormControl('', [Validators.required]),
    BranchAbbvr: new FormControl('', [Validators.required]),
    BranchDescription: new FormControl(''),
    BranchPanNo: new FormControl(''),
    BranchState: new FormControl('', [Validators.required]),
    BranchDistrict: new FormControl('', [Validators.required]),
    BranchMunVdc: new FormControl('', [Validators.required]),
    BranchWardNo: new FormControl('', [Validators.required]),
    BranchPhone: new FormControl(''),
  });

  constructor(
    private districtAndProvinceService: DistrictAndProvinceService,
    private loginService: LoginService,
    private branchService: BranchService
  ) {}

  ngOnInit() {
    this.districtAndProvinceService.getAllProvince().subscribe((res) => {
      this.province = res.data;
    });
  }

  ngOnChanges() {
    if (this.displaycreateNewBranchPopUp) {
      this.BranchRegistrationForm.reset();
      setTimeout(() => {
        const initPopUpButton = document.getElementById(
          'createNewBranchPopUp'
        ) as HTMLButtonElement;
        initPopUpButton.click();
        this.emitToReset.emit(true);
      });
    }
  }

  stateChange(data: string) {
    this.provinceId = parseInt(data, 10);
    this.districtAndProvinceService
      .getDistrictByProvinceId(this.provinceId)
      .subscribe((res) => {
        this.districts = res.data;
      });
  }

  districtChange() {
    let data = this.BranchRegistrationForm.value.BranchDistrict!;
    this.districtId = parseInt(data, 10);
    this.districtAndProvinceService
      .getAllmunicipality(this.provinceId, this.districtId)
      .subscribe((res) => {
        this.municipality = res.data;
      });
  }

  registerBranch() {
    this.branchService
      .addBranch({
        id: 0,
        companyId: this.loginService.getCompnayId(),
        name: this.BranchRegistrationForm.value.BranchName!,
        abbrv: this.BranchRegistrationForm.value.BranchAbbvr!,
        description: this.BranchRegistrationForm.value.BranchDescription!,
        state: this.BranchRegistrationForm.value.BranchState!,
        district: this.BranchRegistrationForm.value.BranchDistrict!,
        munVdc: this.BranchRegistrationForm.value.BranchMunVdc!,
        wardNo: this.BranchRegistrationForm.value.BranchWardNo!,
        phone: this.BranchRegistrationForm.value.BranchPhone!,
      })
      .subscribe({
        next: (res) => {
          this.BranchRegistrationForm.reset();
          const closeButton = document.querySelector(
            '#closeButton'
          ) as HTMLButtonElement;
          closeButton.click();
          this.successfullyAdded.emit(true);
        },
      });
  }
}
