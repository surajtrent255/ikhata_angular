import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchConfigurationComponent } from './branch-configuration.component';

describe('BranchConfigurationComponent', () => {
  let component: BranchConfigurationComponent;
  let fixture: ComponentFixture<BranchConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
