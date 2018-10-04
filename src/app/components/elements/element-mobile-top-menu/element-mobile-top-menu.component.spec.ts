import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementMobileTopMenuComponent } from './element-mobile-top-menu.component';

describe('ElementMobileTopMenuComponent', () => {
  let component: ElementMobileTopMenuComponent;
  let fixture: ComponentFixture<ElementMobileTopMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementMobileTopMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementMobileTopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
