import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPurchaseBillsComponent } from './list-purchase-bills.component';

describe('ListPurchaseBillsComponent', () => {
  let component: ListPurchaseBillsComponent;
  let fixture: ComponentFixture<ListPurchaseBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPurchaseBillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPurchaseBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
