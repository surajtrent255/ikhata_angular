import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOtherIncomeComponent } from './update-other-income.component';

describe('UpdateOtherIncomeComponent', () => {
  let component: UpdateOtherIncomeComponent;
  let fixture: ComponentFixture<UpdateOtherIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateOtherIncomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateOtherIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
