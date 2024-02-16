import { Component } from '@angular/core';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  isStaff: boolean = false;

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    // here for the collapse it only works if the this.isstaff false when found
    setTimeout(() => {
      let roles = this.loginService.getCompanyRoles();
      if (roles.includes('STAFF')) {
        this.isStaff = false;
      } else {
        this.isStaff = true;
      }
    }, 200);
  }
}
