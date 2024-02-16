import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankWithdrawComponent } from './bank-withdraw.component';

describe('BankWithdrawComponent', () => {
  let component: BankWithdrawComponent;
  let fixture: ComponentFixture<BankWithdrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankWithdrawComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
