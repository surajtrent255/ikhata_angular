import { Component, Renderer2 } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { District } from 'src/app/models/District';
import { Municipality } from 'src/app/models/Municipality';
import { Province } from 'src/app/models/Province';
import { Company } from 'src/app/models/company';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { DistrictAndProvinceService } from 'src/app/service/shared/district-and-province.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent {
  companydetails: Company = new Company();
  districts!: District[];
  province!: Province[];
  municipality!: Municipality[];
  registrationType: string = 'VAT';
  provinceId!: number;
  districtId!: number;
  disableInput: boolean = false;
  selectedFile!: File;
  uploadedImage: string | ArrayBuffer | null = null;

  constructor(
    private loginService: LoginService,
    private districtAndProvinceService: DistrictAndProvinceService,
    private companyService: CompanyServiceService,
    private toastrService: ToastrService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.companydetails = this.loginService.getCompany();
    if (this.companydetails.state === 8) {
      this.disableInput = true;
    } else {
      this.disableInput = false;
    }
    this.stateChange(String(this.companydetails.state));
    this.districtChange();

    this.districtAndProvinceService.getAllProvince().subscribe((res) => {
      this.province = res.data;
    });
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.uploadedImage = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }

  stateChange(data: string) {
    if (data == '8') {
      this.disableInput = true;
    } else {
      this.disableInput = false;
    }
    this.provinceId = parseInt(data, 10);
    this.districtAndProvinceService
      .getDistrictByProvinceId(this.provinceId)
      .subscribe((res) => {
        this.districts = res.data;
      });
  }

  districtChange() {
    let data = this.companydetails.district!;
    this.districtId = parseInt(data, 10);
    this.districtAndProvinceService
      .getAllmunicipality(this.provinceId, this.districtId)
      .subscribe((res) => {
        this.municipality = res.data;
      });
  }

  registrationChange(e: any) {
    this.registrationType = e.target.value;
  }

  editCompany() {
    this.companyService.editCompany(this.companydetails).subscribe({
      next: (res) => {
        if (this.selectedFile) {
          this.companyService
            .editLogo(this.selectedFile, this.companydetails.companyId)
            .subscribe((res) => {
              this.toastrService.success('successfully updated');
              const closeButton = document.querySelector(
                '.CreateNewCompanyCloseButton'
              ) as HTMLElement;
              this.renderer.selectRootElement(closeButton).click();
            });
        } else {
          this.toastrService.success('successfully updated');
          const closeButton = document.querySelector(
            '.CreateNewCompanyCloseButton'
          ) as HTMLElement;
          this.renderer.selectRootElement(closeButton).click();
        }
      },
      error: (error) => {
        this.toastrService.error(error);
      },
    });
  }
}
