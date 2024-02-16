import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtorsBillDetailComponent } from './debtors-bill-detail.component';

describe('DebtorsBillDetailComponent', () => {
  let component: DebtorsBillDetailComponent;
  let fixture: ComponentFixture<DebtorsBillDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtorsBillDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtorsBillDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
