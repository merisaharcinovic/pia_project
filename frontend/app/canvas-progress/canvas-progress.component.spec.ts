import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasProgressComponent } from './canvas-progress.component';

describe('CanvasProgressComponent', () => {
  let component: CanvasProgressComponent;
  let fixture: ComponentFixture<CanvasProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasProgressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
