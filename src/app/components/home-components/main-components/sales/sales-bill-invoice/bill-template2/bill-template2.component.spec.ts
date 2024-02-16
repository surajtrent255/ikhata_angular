import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillTemplate2Component } from './bill-template2.component';

describe('BillTemplate2Component', () => {
  let component: BillTemplate2Component;
  let fixture: ComponentFixture<BillTemplate2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillTemplate2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillTemplate2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
