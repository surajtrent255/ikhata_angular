import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDepositEditComponent } from './bank-deposit-edit.component';

describe('BankDepositEditComponent', () => {
  let component: BankDepositEditComponent;
  let fixture: ComponentFixture<BankDepositEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankDepositEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankDepositEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
