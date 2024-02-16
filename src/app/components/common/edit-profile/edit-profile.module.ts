import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditProfileRoutingModule } from './edit-profile-routing.module';
import { EditProfileComponent } from './edit-profile.component';
import { EditPersonalDetailsComponent } from './edit-personal-details/edit-personal-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [EditProfileComponent, EditPersonalDetailsComponent],
  imports: [
    CommonModule,
    EditProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class EditProfileModule {}
