import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExpenseTopicComponent } from './create-expense-topic.component';

describe('CreateExpenseTopicComponent', () => {
  let component: CreateExpenseTopicComponent;
  let fixture: ComponentFixture<CreateExpenseTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateExpenseTopicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateExpenseTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
