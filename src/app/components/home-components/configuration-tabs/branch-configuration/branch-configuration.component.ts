import { Component } from '@angular/core';

@Component({
  selector: 'app-branch-configuration',
  templateUrl: './branch-configuration.component.html',
  styleUrls: ['./branch-configuration.component.css'],
})
export class BranchConfigurationComponent {
  toggleBranchUser: boolean = false;
  toggleCounterUser: boolean = false;
  toggleCounter: boolean = false;

  toggleBranchUserTable() {
    this.toggleBranchUser = true;
  }

  resetCounterUserTable() {
    this.toggleCounterUser = true;
  }

  resetCounterTable() {
    this.toggleCounter = true;
  }
}
