import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetriveProductsComponent } from './retrive-products.component';

describe('RetriveProductsComponent', () => {
  let component: RetriveProductsComponent;
  let fixture: ComponentFixture<RetriveProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetriveProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetriveProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
