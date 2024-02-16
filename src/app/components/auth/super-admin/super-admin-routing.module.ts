import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Company } from '../../../models/company';
import { SuperAdminComponent } from './super-admin.component';
import { AssignCompanyToUserComponent } from './assign-company-to-user/assign-company-to-user.component';

const routes: Routes = [
  {
    path: '',
    component: SuperAdminComponent,
  },
  {
    path: 'assignCompany',
    component: AssignCompanyToUserComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdminRoutingModule {}
