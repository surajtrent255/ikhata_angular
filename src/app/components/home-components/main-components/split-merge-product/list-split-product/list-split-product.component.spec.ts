import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSplitProductComponent } from './list-split-product.component';

describe('ListSplitProductComponent', () => {
  let component: ListSplitProductComponent;
  let fixture: ComponentFixture<ListSplitProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSplitProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSplitProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
