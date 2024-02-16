import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseTallyDetailComponent } from './purchase-tally-detail.component';

describe('PurchaseTallyDetailComponent', () => {
  let component: PurchaseTallyDetailComponent;
  let fixture: ComponentFixture<PurchaseTallyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseTallyDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseTallyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
