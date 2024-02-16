import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOtherIncomeComponent } from './create-other-income.component';

describe('CreateOtherIncomeComponent', () => {
  let component: CreateOtherIncomeComponent;
  let fixture: ComponentFixture<CreateOtherIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOtherIncomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOtherIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
