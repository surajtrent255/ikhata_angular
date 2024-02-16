import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/Employee';
import { RJResponse } from '../models/rjresponse';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BASE_URL } from '../constants/urls';
import { Designation } from '../models/Designation';
import { EmployeeType } from '../models/EmployeeType';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {


  updateEmployee(employee: Employee) {
    let url = `${BASE_URL}/employee/${employee.sn}`;
    return this.http.put<void>(url, employee);
  }

  getEmployeeById(id: number, companyId: number, branchId: number): Observable<RJResponse<Employee>> {
    let url = `${BASE_URL}/employee/single?id=${id}&compId=${companyId}&branchId=${branchId}`;
    return this.http.get<RJResponse<Employee>>(url);
  }

  deleteEmployeeById(deleteEmployeeId: number, compId: number, branchId: number) {
    let url = `${BASE_URL}/employee/${deleteEmployeeId}?compId=${compId}&branchId=${branchId}`;
    return this.http.delete(url);
  }

  createNewEmployee(value: Employee): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/employee`;
    return this.http.post<RJResponse<number>>(url, value);
  }


  getLimitedEmployees(offset: number, pageTotalItems: number, searchBy: string, searchWildCard: string, sortBy: string, compId: number, branchId: number): Observable<RJResponse<Employee[]>> {
    let url = `${BASE_URL}/employee`;
    const httpParams = new HttpParams().set('compId', compId).set('branchId',branchId)
    .set('offset', offset).set('pageTotalItems', pageTotalItems).set('searchBy', searchBy).set('searchWildCard', searchWildCard)
    return this.http.get<RJResponse<Employee[]>>(url, { params: httpParams});
  }


  createNewDesignation(value: Designation): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/employee/designation`;
    return this.http.post<RJResponse<number>>(url, value)
  }

  getDesignationList(compId: number, branchId: number): Observable<RJResponse<Designation[]>> {
    let url = `${BASE_URL}/employee/designation?compId=${compId}&branchId=${branchId}`;
    return this.http.get<RJResponse<Designation[]>>(url);
  }

  getAllEmployeeType(): Observable<RJResponse<EmployeeType[]>> {
    let url = `${BASE_URL}/employee/types`;
    return this.http.get<RJResponse<EmployeeType[]>>(url);
  }

  constructor(private http: HttpClient) { }
}
