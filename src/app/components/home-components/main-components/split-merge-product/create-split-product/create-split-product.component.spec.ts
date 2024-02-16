import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSplitProductComponent } from './create-split-product.component';

describe('CreateSplitProductComponent', () => {
  let component: CreateSplitProductComponent;
  let fixture: ComponentFixture<CreateSplitProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSplitProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSplitProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
