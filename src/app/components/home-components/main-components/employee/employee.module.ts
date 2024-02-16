import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { CreateDesignationComponent } from './create-designation/create-designation.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { EmployeeComponent } from './retrive-employee/employee.component';
import { UpdateEmployeeComponent } from './update-employee/update-employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharablePortionModule } from 'src/app/components/sharable-portion/sharable-portion.module';


@NgModule({
  declarations: [
    CreateDesignationComponent,
    CreateEmployeeComponent,
    EmployeeComponent,
    UpdateEmployeeComponent
    
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharablePortionModule
  ]
})
export class EmployeeModule { }
