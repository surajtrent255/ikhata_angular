import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBillInvoiceComponent } from './sales-bill-invoice.component';

describe('SalesBillInvoiceComponent', () => {
  let component: SalesBillInvoiceComponent;
  let fixture: ComponentFixture<SalesBillInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesBillInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesBillInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
