import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesTallyBillDetailComponent } from './sales-tally-bill-detail.component';

describe('SalesTallyBillDetailComponent', () => {
  let component: SalesTallyBillDetailComponent;
  let fixture: ComponentFixture<SalesTallyBillDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesTallyBillDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesTallyBillDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
