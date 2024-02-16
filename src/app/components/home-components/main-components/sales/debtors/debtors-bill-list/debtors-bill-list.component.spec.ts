import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtorsBillListComponent } from './debtors-bill-list.component';

describe('DebtorsBillListComponent', () => {
  let component: DebtorsBillListComponent;
  let fixture: ComponentFixture<DebtorsBillListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtorsBillListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtorsBillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
