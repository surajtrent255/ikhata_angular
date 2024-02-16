import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { UserConfigurationComponent } from '../user-configuration/user-configuration.component';
import { BranchConfigurationComponent } from '../branch-configuration/branch-configuration.component';
import { AdministratorConfigurationComponent } from '../administrator-configuration/administrator-configuration.component';
import { UserFeatureComponent } from '../user-configuration/feature-control/user-feature/user-feature.component';
import { UserRoleComponent } from '../user-configuration/user-role/user-role.component';
import { UsersComponent } from '../user-configuration/users/users.component';
import { AddRoleComponent } from '../user-configuration/users/add-role/add-role.component';
import { AssignCompanyComponent } from '../user-configuration/users/assign-company/assign-company.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BranchDetailsComponent } from '../branch-configuration/branch-details/branch-details.component';
import { BranchUserDetailsComponent } from '../branch-configuration/branch-user-details/branch-user-details.component';
import { CounterComponent } from '../branch-configuration/counter/counter.component';
import { CounterUserComponent } from '../branch-configuration/counter-user/counter-user.component';
import { CreateBranchComponent } from '../branch-configuration/create-branch/create-branch.component';
import { AssignBranchComponent } from '../branch-configuration/assign-branch/assign-branch.component';
import { CreateCounterComponent } from '../branch-configuration/create-counter/create-counter.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AssignCounterComponent } from '../branch-configuration/assign-counter/assign-counter.component';
import { AddControlComponent } from '../user-configuration/users/add-control/add-control.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    ConfigurationComponent,
    UserConfigurationComponent,
    BranchConfigurationComponent,
    AdministratorConfigurationComponent,
    UserFeatureComponent,
    UserRoleComponent,
    UsersComponent,
    AddRoleComponent,
    AssignCompanyComponent,
    BranchDetailsComponent,
    BranchUserDetailsComponent,
    CounterComponent,
    CounterUserComponent,
    CreateBranchComponent,
    AssignBranchComponent,
    CreateCounterComponent,
    AssignCounterComponent,
    AddControlComponent,
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
  ],
})
export class ConfigurationModule {}
