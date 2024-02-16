import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLoanRepayComponent } from './edit-loan-repay.component';

describe('EditLoanRepayComponent', () => {
  let component: EditLoanRepayComponent;
  let fixture: ComponentFixture<EditLoanRepayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLoanRepayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLoanRepayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
