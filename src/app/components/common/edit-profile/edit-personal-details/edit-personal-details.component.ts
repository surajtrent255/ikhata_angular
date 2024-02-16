import { Component, Renderer2 } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { District } from 'src/app/models/District';
import { Municipality } from 'src/app/models/Municipality';
import { Province } from 'src/app/models/Province';
import { Company } from 'src/app/models/company';
import { User } from 'src/app/models/user';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { DistrictAndProvinceService } from 'src/app/service/shared/district-and-province.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-edit-personal-details',
  templateUrl: './edit-personal-details.component.html',
  styleUrls: ['./edit-personal-details.component.css'],
})
export class EditPersonalDetailsComponent {
  companyDetails!: Company;
  owner = new User();

  constructor(
    private loginService: LoginService,
    private districtAndProvinceService: DistrictAndProvinceService,
    private companyService: CompanyServiceService,
    private toastrService: ToastrService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.loginService.userObservable.subscribe((user) => {
      this.owner = user;
    });
    this.companyDetails = this.loginService.getCompany();
  }
}
