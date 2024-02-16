import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReportDetailComponent } from './sales-report-detail.component';

describe('SalesReportDetailComponent', () => {
  let component: SalesReportDetailComponent;
  let fixture: ComponentFixture<SalesReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesReportDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
