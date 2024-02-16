import { ViewEncapsulation } from '@angular/compiler';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators, Form } from '@angular/forms';
import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal';
import { District } from 'src/app/models/District';
import { Municipality } from 'src/app/models/Municipality';
import { Province } from 'src/app/models/Province';
import { Company } from 'src/app/models/company';
import { User } from 'src/app/models/user';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { DistrictAndProvinceService } from 'src/app/service/shared/district-and-province.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { CommonService } from '../../../service/shared/common/common.service';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css'],
})
export class CreateCustomerComponent {
  company: Company = new Company();
  user: User = new User();
  user_id!: number;

  // @Input() createCustomerToggle: boolean = false;
  @Input() title!: string;
  @Input() customerPanOrPhone: Number = 0;
  CustomerPanOrPhone: Number = 0;

  @Output() customerAddedSuccessMsg = new EventEmitter<number>();
  @Output() destroyCreateCustComp = new EventEmitter<boolean>();
  @Output() emitToReset = new EventEmitter<boolean>();

  @Input() createCustomerEnable: boolean = false;
  // @Output() emitToResetCustomerEnable = new EventEmitter<boolean>();

  districts!: District[];
  province!: Province[];
  municipality!: Municipality[];

  // for select  value Accquire
  provinceId!: number;
  districtId!: number;
  registrationType: string = 'VAT';

  constructor(
    private loginService: LoginService,
    private companyService: CompanyServiceService,
    private districtAndProvinceService: DistrictAndProvinceService,
    private ngxSmartModalService: NgxSmartModalService,
    public CommonService: CommonService
  ) {}

  ngOnInit() {
    this.districtAndProvinceService.getAllProvince().subscribe((res) => {
      console.log(res.data);
      this.province = res.data;
    });

    this.CompanyRegistrationForm.get('state')?.valueChanges.subscribe(
      (changedValue) => {
        let arrField: string[] = ['district', 'munVdc', 'wardNo'];
        arrField.forEach((f) => {
          const fieldF = this.CompanyRegistrationForm.get(f);
          if (changedValue === '8') {
            fieldF?.clearValidators();
            fieldF?.disable();
          } else {
            fieldF?.setValidators(Validators.required);
            fieldF?.enable();
          }
          fieldF?.updateValueAndValidity();
        });
      }
    );
  }

  // ngOnChanges() {
  //   if (this.customerPanOrPhone) {
  //     setTimeout(() => {
  //       this.customerPanOrPhone = this.CustomerPanOrPhone;
  //     });
  //   }
  //   if (this.createCustomerToggle && !this.createCustomerEnable) {
  //     setTimeout(() => {
  //       this.ngxSmartModalService.getModal('createCustomer').open();
  //       this.emitToReset.emit(true);
  //     }, 600);
  //   }
  //   if (this.createCustomerEnable && !this.createCustomerToggle) {
  //     setTimeout(() => {
  //       this.ngxSmartModalService.getModal('createCustomer').open();
  //       this.emitToResetCustomerEnable.emit(true);
  //     }, 400);
  //   }
  // }
  ngAfterViewInit() {
    // this.CommonService.enableDragging('createCustomer', 'customerPopup');
  }

  CompanyRegistrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    ownerName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email]),
    description: new FormControl(''),
    panNo: new FormControl(''),
    state: new FormControl('', [Validators.required]),
    district: new FormControl('', [Validators.required]),
    munVdc: new FormControl('', [Validators.required]),
    wardNo: new FormControl({ value: '', disabled: false }, [
      Validators.required,
    ]),
    phone: new FormControl('', [Validators.required]),
    landLineNo: new FormControl(''),
    taxPayType: new FormControl('', [Validators.required]),
  });

  registrationChange(e: any) {
    this.registrationType = e.target.value;
  }

  registerCompany(form: any) {
    this.loginService.userObservable.subscribe((loginUser) => {
      this.user = loginUser;
      this.user_id = loginUser.user.id;
      console.log(this.user.user.id);
    });
    console.log(this.CompanyRegistrationForm);
    console.log('*******************');
    this.companyService
      .addCompany(
        {
          companyId: 0,
          name: this.CompanyRegistrationForm.value.name!,
          email: this.CompanyRegistrationForm.value.email!,
          description: this.CompanyRegistrationForm.value.description!,
          panNo: Number(this.CompanyRegistrationForm.value.panNo!),
          state: Number(this.CompanyRegistrationForm.value.state!),
          district: this.CompanyRegistrationForm.value.district!,
          munVdc: this.CompanyRegistrationForm.value.munVdc!,
          wardNo: Number(this.CompanyRegistrationForm.value.wardNo!),
          phone: Number(this.CompanyRegistrationForm.value.phone!),
          customer: true!,
          imageName: '',
          imageUrl: '',
          imageId: 0,
          createdDate: '',
          createdDateNepali: '',
          landlineNumber: Number(
            this.CompanyRegistrationForm.value.landLineNo!
          ),
          ownerName: this.CompanyRegistrationForm.value.ownerName!,
          registrationType: this.registrationType,
          isApproved: false,
          taxPayType: this.CompanyRegistrationForm.value.taxPayType
            ? this.CompanyRegistrationForm.value.taxPayType
            : '',
        },
        this.user_id
      )
      .subscribe((data) => {
        form.reset();
        this.customerAddedSuccessMsg.emit(data.data);
        this.destroyComp();
      });
  }

  stateChange(data: string) {
    this.provinceId = parseInt(data, 10);
    if (this.provinceId === 8) {
      this.districts = [];
      this.municipality = [];
      return;
    }
    this.districtAndProvinceService
      .getDistrictByProvinceId(this.provinceId)
      .subscribe((res) => {
        this.districts = res.data;
      });
  }

  getCompanyByPanNo(e: any) {
    this.companyService
      .getCompanyByPanNo(Number(e.target.value))
      .subscribe((res) => {
        if (res) {
          this.CompanyRegistrationForm.patchValue({
            name: res.data.name,
            description: res.data.description,
            district: res.data.district,
            email: res.data.email,
            landLineNo: String(res.data.landlineNumber),
            munVdc: res.data.munVdc,
            ownerName: res.data.ownerName,
            panNo: String(res.data.panNo),
            phone: String(res.data.phone),
            state: String(res.data.state),
            wardNo: String(res.data.wardNo),
          });
        } else {
          this.CompanyRegistrationForm.patchValue({
            description: '',
            district: '',
            email: '',
            landLineNo: '',
            munVdc: '',
            name: '',
            ownerName: '',
            panNo: '',
            phone: '',
            state: '',
            wardNo: '',
          });
        }
      });
  }

  districtChange() {
    let data = this.CompanyRegistrationForm.value.district!;
    this.districtId = parseInt(data, 10);
    this.districtAndProvinceService
      .getAllmunicipality(this.provinceId, this.districtId)
      .subscribe((res) => {
        this.municipality = res.data;
      });
  }

  destroyComp() {
    this.destroyCreateCustComp.emit(true);
  }
}
