import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementNavigationComponent } from './element-navigation.component';

describe('ElementNavigationComponent', () => {
  let component: ElementNavigationComponent;
  let fixture: ComponentFixture<ElementNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
