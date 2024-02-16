import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReportDetailsComponent } from './purchase-report-details.component';

describe('PurchaseReportDetailsComponent', () => {
  let component: PurchaseReportDetailsComponent;
  let fixture: ComponentFixture<PurchaseReportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseReportDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
