import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseAdditionalInfoDetailsComponent } from './purchase-additional-info-details.component';

describe('PurchaseAdditionalInfoDetailsComponent', () => {
  let component: PurchaseAdditionalInfoDetailsComponent;
  let fixture: ComponentFixture<PurchaseAdditionalInfoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseAdditionalInfoDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseAdditionalInfoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
