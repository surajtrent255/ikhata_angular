import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFiscalYearComponent } from './create-fiscal-year.component';

describe('CreateFiscalYearComponent', () => {
  let component: CreateFiscalYearComponent;
  let fixture: ComponentFixture<CreateFiscalYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFiscalYearComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFiscalYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
