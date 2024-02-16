import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './shared/login.service';
import { BASE_URL } from '../constants/urls';
import { Observable } from 'rxjs';
import { RJResponse } from '../models/rjresponse';
import { TaxFileIrd } from '../models/TaxFileIrd';
import { FiscalYear } from '../models/FiscalYear';

@Injectable({
  providedIn: 'root'
})
export class IrdService {

  compId!: number;
  branchId !: number;

  constructor(private httpClient: HttpClient, loginService: LoginService) {
    this.compId = loginService.getCompnayId();
    this.branchId = loginService.getBranchId()
  }

  taxFileUtilitySummary(fiscalYear: string, quarterStartDateAd: string, quarterEndDateAd: string): Observable<RJResponse<TaxFileIrd>> {
    let url = `${BASE_URL}/utility/summary?compId=${this.compId}&fiscal_year=${fiscalYear}&quarterStart=${quarterStartDateAd}&quarterEnd=${quarterEndDateAd}`;
    return this.httpClient.get<RJResponse<TaxFileIrd>>(url);
  }

  taxFileUtilitySummaryForSpecificMonth(beginEnglishDate: string, endDateEnglish: string, fiscalYear: string): Observable<RJResponse<TaxFileIrd>> {
    let url = `${BASE_URL}/utility/summaryByMonth?compId=${this.compId}&monthBegDate=${beginEnglishDate}&monthEndDate=${endDateEnglish}&fiscalYear=${fiscalYear}`;
    return this.httpClient.get<RJResponse<TaxFileIrd>>(url);
  }

}
