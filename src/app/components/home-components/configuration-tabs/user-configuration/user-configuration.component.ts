import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-configuration',
  templateUrl: './user-configuration.component.html',
  styleUrls: ['./user-configuration.component.css'],
})
export class UserConfigurationComponent {
  toggleData!: boolean;
  booleanToResetFeatureTable!: boolean;

  setTheBooleanToResetUserRole() {
    this.toggleData = true;
  }

  setTheBooleanToResetFeatureTable() {
    this.booleanToResetFeatureTable = true;
  }
}
