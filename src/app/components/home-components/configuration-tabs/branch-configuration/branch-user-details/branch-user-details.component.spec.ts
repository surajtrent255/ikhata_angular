import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchUserDetailsComponent } from './branch-user-details.component';

describe('BranchUserDetailsComponent', () => {
  let component: BranchUserDetailsComponent;
  let fixture: ComponentFixture<BranchUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchUserDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
