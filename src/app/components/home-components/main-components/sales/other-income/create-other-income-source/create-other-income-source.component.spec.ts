import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOtherIncomeSourceComponent } from './create-other-income-source.component';

describe('CreateOtherIncomeSourceComponent', () => {
  let component: CreateOtherIncomeSourceComponent;
  let fixture: ComponentFixture<CreateOtherIncomeSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOtherIncomeSourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOtherIncomeSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
