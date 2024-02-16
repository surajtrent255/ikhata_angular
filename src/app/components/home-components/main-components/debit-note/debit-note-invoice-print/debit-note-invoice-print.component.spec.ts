import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitNoteInvoicePrintComponent } from './debit-note-invoice-print.component';

describe('DebitNoteInvoicePrintComponent', () => {
  let component: DebitNoteInvoicePrintComponent;
  let fixture: ComponentFixture<DebitNoteInvoicePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitNoteInvoicePrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebitNoteInvoicePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
