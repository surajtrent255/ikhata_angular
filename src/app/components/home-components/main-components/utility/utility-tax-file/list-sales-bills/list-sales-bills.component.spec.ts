import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSalesBillsComponent } from './list-sales-bills.component';

describe('ListSalesBillsComponent', () => {
  let component: ListSalesBillsComponent;
  let fixture: ComponentFixture<ListSalesBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSalesBillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSalesBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
