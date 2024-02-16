import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssignCompanyToUserComponent } from './assign-company-to-user/assign-company-to-user.component';

@NgModule({
  declarations: [AssignCompanyToUserComponent],
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SuperAdminModule {}
