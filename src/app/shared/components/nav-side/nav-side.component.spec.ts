import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavSideComponent } from './nav-side.component';

describe('NavSideComponent', () => {
  let component: NavSideComponent;
  let fixture: ComponentFixture<NavSideComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
