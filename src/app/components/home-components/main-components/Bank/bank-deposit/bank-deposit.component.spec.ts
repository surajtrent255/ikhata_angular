import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDepositComponent } from './bank-deposit.component';

describe('BankDepositComponent', () => {
  let component: BankDepositComponent;
  let fixture: ComponentFixture<BankDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankDepositComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
