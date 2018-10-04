import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementTimelineComponent } from './element-timeline.component';

describe('ElementTimelineComponent', () => {
  let component: ElementTimelineComponent;
  let fixture: ComponentFixture<ElementTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
