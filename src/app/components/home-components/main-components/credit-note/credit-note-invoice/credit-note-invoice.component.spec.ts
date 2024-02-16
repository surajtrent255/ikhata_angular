import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNoteInvoiceComponent } from './credit-note-invoice.component';

describe('CreditNoteInvoiceComponent', () => {
  let component: CreditNoteInvoiceComponent;
  let fixture: ComponentFixture<CreditNoteInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditNoteInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditNoteInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
