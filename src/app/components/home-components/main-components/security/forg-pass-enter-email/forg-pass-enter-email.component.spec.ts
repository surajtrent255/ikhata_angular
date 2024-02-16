import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgPassEnterEmailComponent } from './forg-pass-enter-email.component';

describe('ForgPassEnterEmailComponent', () => {
  let component: ForgPassEnterEmailComponent;
  let fixture: ComponentFixture<ForgPassEnterEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgPassEnterEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgPassEnterEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
