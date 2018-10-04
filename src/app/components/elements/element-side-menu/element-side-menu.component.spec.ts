import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementSideMenuComponent } from './element-side-menu.component';

describe('ElementSideMenuComponent', () => {
  let component: ElementSideMenuComponent;
  let fixture: ComponentFixture<ElementSideMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementSideMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
