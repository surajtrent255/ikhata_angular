import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeProductComponent } from './merge-product.component';

describe('MergeProductComponent', () => {
  let component: MergeProductComponent;
  let fixture: ComponentFixture<MergeProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergeProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
