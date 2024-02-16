import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilityTaxFileComponent } from './utility-tax-file.component';

describe('UtilityTaxFileComponent', () => {
  let component: UtilityTaxFileComponent;
  let fixture: ComponentFixture<UtilityTaxFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtilityTaxFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilityTaxFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
