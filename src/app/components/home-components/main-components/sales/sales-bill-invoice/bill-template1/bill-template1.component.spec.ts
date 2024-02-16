import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillTemplate1Component } from './bill-template1.component';

describe('BillTemplate1Component', () => {
  let component: BillTemplate1Component;
  let fixture: ComponentFixture<BillTemplate1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillTemplate1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillTemplate1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
