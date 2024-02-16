import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesTallyBillListComponent } from './sales-tally-bill-list.component';

describe('SalesTallyBillListComponent', () => {
  let component: SalesTallyBillListComponent;
  let fixture: ComponentFixture<SalesTallyBillListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesTallyBillListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesTallyBillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
