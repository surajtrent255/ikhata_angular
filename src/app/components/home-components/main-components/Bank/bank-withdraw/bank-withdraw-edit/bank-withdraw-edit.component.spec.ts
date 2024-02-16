import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankWithdrawEditComponent } from './bank-withdraw-edit.component';

describe('BankWithdrawEditComponent', () => {
  let component: BankWithdrawEditComponent;
  let fixture: ComponentFixture<BankWithdrawEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankWithdrawEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankWithdrawEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
