import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { COMPANY_LABEL_DATA } from 'src/app/constants/urls';
import { CompanyLabelInfoDTO } from 'src/app/models/Company-Label/companyLabel';
import { RJResponse } from 'src/app/models/rjresponse';

@Injectable({
  providedIn: 'root',
})
export class CompanyLabelService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getLabel(): Observable<any> {
    return this.http.get(`${COMPANY_LABEL_DATA}/get/label`);
  }

  getCompanyLabel(
    companyId: number
  ): Observable<RJResponse<CompanyLabelInfoDTO[]>> {
    return this.http.get<RJResponse<CompanyLabelInfoDTO[]>>(
      `${COMPANY_LABEL_DATA}/${companyId}`
    );
  }

  getCompanyLabelByCompanyIdAndLabelName(
    companyId: number,
    labelName: string
  ): Observable<RJResponse<CompanyLabelInfoDTO>> {
    return this.http.get<RJResponse<CompanyLabelInfoDTO>>(
      `${COMPANY_LABEL_DATA}/${companyId}/${labelName}`
    );
  }

  addLabel(name: string): Observable<any> {
    return this.http.post(`${COMPANY_LABEL_DATA}?name=${name}`, '');
  }

  addLabelData(CompanyLabelInfoDTO: CompanyLabelInfoDTO): Observable<any> {
    return this.http.post(`${COMPANY_LABEL_DATA}/data`, CompanyLabelInfoDTO);
  }

  deleteLabel(id: number): Observable<any> {
    return this.http.delete(`${COMPANY_LABEL_DATA}/delete/${id}`);
  }
}
