import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBillEditComponent } from './sales-bill-edit.component';

describe('SalesBillEditComponent', () => {
  let component: SalesBillEditComponent;
  let fixture: ComponentFixture<SalesBillEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesBillEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesBillEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
