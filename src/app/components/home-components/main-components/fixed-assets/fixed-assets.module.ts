import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FixedAssetsRoutingModule } from './fixed-assets-routing.module';
import { EditFixedAssetsComponent } from './edit-fixed-assets/edit-fixed-assets.component';
import { FixedAssetsComponent } from './fixed-assets.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [EditFixedAssetsComponent, FixedAssetsComponent],
  imports: [
    CommonModule,
    FixedAssetsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
  ],
})
export class FixedAssetsModule {}
