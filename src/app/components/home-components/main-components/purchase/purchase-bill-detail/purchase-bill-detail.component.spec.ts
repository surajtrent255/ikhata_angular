import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseBillDetailComponent } from './purchase-bill-detail.component';

describe('PurchaseBillDetailComponent', () => {
  let component: PurchaseBillDetailComponent;
  let fixture: ComponentFixture<PurchaseBillDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseBillDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseBillDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
