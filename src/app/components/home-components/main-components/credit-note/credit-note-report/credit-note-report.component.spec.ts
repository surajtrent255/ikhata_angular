import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNoteReportComponent } from './credit-note-report.component';

describe('CreditNoteReportComponent', () => {
  let component: CreditNoteReportComponent;
  let fixture: ComponentFixture<CreditNoteReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditNoteReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditNoteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
