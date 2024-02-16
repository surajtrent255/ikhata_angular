import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterUserComponent } from './counter-user.component';

describe('CounterUserComponent', () => {
  let component: CounterUserComponent;
  let fixture: ComponentFixture<CounterUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CounterUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CounterUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
