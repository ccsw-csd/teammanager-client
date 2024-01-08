import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayEditcalendarComponent } from './holiday-editcalendar.component';

describe('HolidayEditcalendarComponent', () => {
  let component: HolidayEditcalendarComponent;
  let fixture: ComponentFixture<HolidayEditcalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayEditcalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayEditcalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
