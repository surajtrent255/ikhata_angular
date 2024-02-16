import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesTallyComponent } from './sales-tally.component';

describe('SalesTallyComponent', () => {
  let component: SalesTallyComponent;
  let fixture: ComponentFixture<SalesTallyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesTallyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesTallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
