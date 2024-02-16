import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNoteInvoicePrintComponent } from './credit-note-invoice-print.component';

describe('CreditNoteInvoicePrintComponent', () => {
  let component: CreditNoteInvoicePrintComponent;
  let fixture: ComponentFixture<CreditNoteInvoicePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditNoteInvoicePrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditNoteInvoicePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
