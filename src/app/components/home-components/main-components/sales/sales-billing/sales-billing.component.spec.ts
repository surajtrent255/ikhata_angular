import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBillingComponent } from './sales-billing.component';

describe('SalesBillingComponent', () => {
  let component: SalesBillingComponent;
  let fixture: ComponentFixture<SalesBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesBillingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
