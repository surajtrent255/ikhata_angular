import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditorsDetailComponent } from './creditors-detail.component';

describe('CreditorsDetailComponent', () => {
  let component: CreditorsDetailComponent;
  let fixture: ComponentFixture<CreditorsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditorsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditorsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
