import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCompanyDetailsComponent } from './user-company-details.component';

describe('UserCompanyDetailsComponent', () => {
  let component: UserCompanyDetailsComponent;
  let fixture: ComponentFixture<UserCompanyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCompanyDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCompanyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
