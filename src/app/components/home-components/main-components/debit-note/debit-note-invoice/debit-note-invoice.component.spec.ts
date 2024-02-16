import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitNoteInvoiceComponent } from './debit-note-invoice.component';

describe('DebitNoteInvoiceComponent', () => {
  let component: DebitNoteInvoiceComponent;
  let fixture: ComponentFixture<DebitNoteInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitNoteInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebitNoteInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
