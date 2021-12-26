import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadShowComponent } from './actividad-show.component';

describe('ActividadShowComponent', () => {
  let component: ActividadShowComponent;
  let fixture: ComponentFixture<ActividadShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActividadShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
