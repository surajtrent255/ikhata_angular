import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorConfigurationComponent } from './administrator-configuration.component';

describe('AdministratorConfigurationComponent', () => {
  let component: AdministratorConfigurationComponent;
  let fixture: ComponentFixture<AdministratorConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministratorConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministratorConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
