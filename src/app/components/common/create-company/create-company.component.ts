import { ElementRef, Renderer2 } from '@angular/core';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ɵDomRendererFactory2 } from '@angular/platform-browser';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import { ToastrService } from 'ngx-toastr';
import { District } from 'src/app/models/District';
import { Municipality } from 'src/app/models/Municipality';
import { Province } from 'src/app/models/Province';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { DistrictAndProvinceService } from 'src/app/service/shared/district-and-province.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.css'],
})
export class CreateCompanyComponent {
  @Input() enableRegisterPopup!: boolean;
  @Output() emitToReset = new EventEmitter<boolean>(false);

  @ViewChild('createNewCompanyPopup')
  createNewCompanyPopupButton!: ElementRef<HTMLButtonElement>;

  @Output() successfullyAdded = new EventEmitter<boolean>(false);
  user_id!: number;
  districts!: District[];
  province!: Province[];
  municipality!: Municipality[];

  selectedFile!: File;
  // for select  value Accquire
  provinceId!: number;
  districtId!: number;

  diableDistrictAndWard!: boolean;

  registrationType: string = 'VAT';
  isAlreadyRegisteredCompany: boolean = false;

  CompanyRegistrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    panNo: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email]),
    state: new FormControl('', [Validators.required]),
    district: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    munVdc: new FormControl({ value: '', disabled: true }, Validators.required),
    wardNo: new FormControl({ value: '', disabled: true }, Validators.required),
    phone: new FormControl(
      '',
      Validators.compose([Validators.required, this.phoneValidator])
    ),
    ownerName: new FormControl('', [Validators.required]),
    landline: new FormControl(''),
    taxPayType: new FormControl('monthly', [Validators.required]),
  });

  constructor(
    private companyService: CompanyServiceService,
    private loginService: LoginService,
    private districtAndProvinceService: DistrictAndProvinceService,
    private toastrService: ToastrService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.districtAndProvinceService.getAllProvince().subscribe((res) => {
      this.province = res.data;
    });
  }

  ngOnChanges() {
    if (this.enableRegisterPopup) {
      this.CompanyRegistrationForm.reset();
      if (this.enableRegisterPopup) {
        setTimeout(() => {
          const initPopUpButton = document.getElementById(
            'createNewCompanyPopUp'
          ) as HTMLButtonElement;
          initPopUpButton.click();
          this.emitToReset.emit(true);
        });
      }
    }
  }

  phoneValidator(control: AbstractControl) {
    const phoneNumber = control.value;
    const startsWith9 = phoneNumber && phoneNumber.toString().startsWith('9');
    const validLength = phoneNumber && phoneNumber.toString().length === 10;

    if (phoneNumber && (!startsWith9 || !validLength)) {
      return { invalidPhone: true };
    }

    return null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  registerCompany() {
    let englishDate = new Date().toJSON().slice(0, 10);
    if (this.CompanyRegistrationForm.invalid === true) {
      this.toastrService.error('Please Enter All Required Fields Correctly');
    }
    if (this.CompanyRegistrationForm.invalid === false) {
      this.loginService.userObservable.subscribe((loginUser) => {
        this.user_id = loginUser.user.id;
      });

      this.companyService
        .addCompany(
          {
            companyId: 0,
            name: this.CompanyRegistrationForm.value.name!,
            email: this.CompanyRegistrationForm.value.email!,
            description: this.CompanyRegistrationForm.value.description!,
            panNo: Number(this.CompanyRegistrationForm.value.panNo),
            state: Number(this.CompanyRegistrationForm.value.state),
            district: this.CompanyRegistrationForm.value.district!,
            munVdc: this.CompanyRegistrationForm.value.munVdc!,
            wardNo: Number(this.CompanyRegistrationForm.value.wardNo),
            phone: Number(this.CompanyRegistrationForm.value.phone),
            customer: false,
            imageName: '',
            imageUrl: '',
            imageId: 0,
            ownerName: this.CompanyRegistrationForm.value.ownerName!,
            landlineNumber: Number(
              this.CompanyRegistrationForm.value.landline!
            ),
            createdDate: englishDate,
            createdDateNepali: String(adToBs(englishDate)),
            registrationType: this.registrationType,
            isApproved: false,
            taxPayType: this.CompanyRegistrationForm.value.taxPayType
              ? this.CompanyRegistrationForm.value.taxPayType
              : '',
          },
          this.user_id
        )
        .subscribe({
          next: (res) => {
            const closeButton = document.querySelector(
              '#closeButton'
            ) as HTMLButtonElement;
            closeButton.click();
            this.successfullyAdded.emit(true);

            this.companyService
              .addCompanyLogo(this.selectedFile, res.data)
              .subscribe({
                next: (res) => {
                  this.successfullyAdded.emit(true);
                  this.CompanyRegistrationForm.reset();
                },
                error: (err) => {
                  console.log(err.HttpErrorResponse);
                },
              });
          },
          complete: () => {},
        });
    }
  }
  registrationChange(e: any) {
    this.registrationType = e.target.value;
  }
  enableManditorySign!: boolean;
  stateChange(data: string) {
    if (data === '8') {
      this.CompanyRegistrationForm.get('district')?.disable();
      this.CompanyRegistrationForm.get('munVdc')?.disable();
      this.CompanyRegistrationForm.get('wardNo')?.disable();
      this.enableManditorySign = true;
    } else {
      this.CompanyRegistrationForm.get('district')?.enable();
      this.CompanyRegistrationForm.get('munVdc')?.enable();
      this.CompanyRegistrationForm.get('wardNo')?.enable();
      this.enableManditorySign = false;
    }
    this.provinceId = parseInt(data, 10);
    this.districtAndProvinceService
      .getDistrictByProvinceId(this.provinceId)
      .subscribe((res) => {
        this.districts = res.data;
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

  getCompanyByPanNo(e: any) {
    this.companyService
      .getCompanyByPanNo(Number(e.target.value))
      .subscribe((res) => {
        if (res.data) {
          this.toastrService.error(
            'The Company with this Pan/VAT already exists on the system. If you are a company owner please contact the administrator '
          );
          this.isAlreadyRegisteredCompany = true;
          this.CompanyRegistrationForm.patchValue({
            name: res.data.name,
            description: res.data.description,
            district: res.data.district,
            email: res.data.email,
            landline: String(res.data.landlineNumber),
            munVdc: res.data.munVdc,
            ownerName: res.data.ownerName,
            panNo: String(res.data.panNo),
            phone: String(res.data.phone),
            state: String(res.data.state),
            wardNo: String(res.data.wardNo),
          });
        } else {
          this.isAlreadyRegisteredCompany = false;
        }
      });
  }
}
