import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCompanyToUserComponent } from './assign-company-to-user.component';

describe('AssignCompanyToUserComponent', () => {
  let component: AssignCompanyToUserComponent;
  let fixture: ComponentFixture<AssignCompanyToUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignCompanyToUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignCompanyToUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
