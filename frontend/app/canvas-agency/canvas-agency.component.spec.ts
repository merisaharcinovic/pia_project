import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasAgencyComponent } from './canvas-agency.component';

describe('CanvasAgencyComponent', () => {
  let component: CanvasAgencyComponent;
  let fixture: ComponentFixture<CanvasAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasAgencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
