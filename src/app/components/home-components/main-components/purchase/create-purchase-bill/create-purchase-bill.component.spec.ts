import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePurchaseBillComponent } from './create-purchase-bill.component';

describe('CreatePurchaseBillComponent', () => {
  let component: CreatePurchaseBillComponent;
  let fixture: ComponentFixture<CreatePurchaseBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePurchaseBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePurchaseBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
