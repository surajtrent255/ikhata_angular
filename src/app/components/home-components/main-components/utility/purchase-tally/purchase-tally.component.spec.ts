import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseTallyComponent } from './purchase-tally.component';

describe('PurchaseTallyComponent', () => {
  let component: PurchaseTallyComponent;
  let fixture: ComponentFixture<PurchaseTallyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseTallyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseTallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
