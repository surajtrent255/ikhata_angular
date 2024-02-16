import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCounterComponent } from './assign-counter.component';

describe('AssignCounterComponent', () => {
  let component: AssignCounterComponent;
  let fixture: ComponentFixture<AssignCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignCounterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
