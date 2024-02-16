import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryprodComponent } from './categoryprod.component';

describe('CategoryprodComponent', () => {
  let component: CategoryprodComponent;
  let fixture: ComponentFixture<CategoryprodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryprodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryprodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
