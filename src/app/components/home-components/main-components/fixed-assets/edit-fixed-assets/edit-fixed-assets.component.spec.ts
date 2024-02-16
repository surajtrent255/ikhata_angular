import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFixedAssetsComponent } from './edit-fixed-assets.component';

describe('EditFixedAssetsComponent', () => {
  let component: EditFixedAssetsComponent;
  let fixture: ComponentFixture<EditFixedAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFixedAssetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFixedAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
