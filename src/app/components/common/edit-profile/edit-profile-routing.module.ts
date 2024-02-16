import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from './edit-profile.component';
import { EditPersonalDetailsComponent } from './edit-personal-details/edit-personal-details.component';

const routes: Routes = [
  {
    path: 'company',
    component: EditProfileComponent,
  },
  {
    path: 'owner',
    component: EditPersonalDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditProfileRoutingModule {}
