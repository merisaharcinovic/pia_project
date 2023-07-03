import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonregisteredComponent } from './nonregistered.component';

describe('NonregisteredComponent', () => {
  let component: NonregisteredComponent;
  let fixture: ComponentFixture<NonregisteredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonregisteredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonregisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
