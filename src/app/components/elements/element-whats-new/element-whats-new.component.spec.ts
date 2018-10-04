import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementWhatsNewComponent } from './element-whats-new.component';

describe('ElementWhatsNewComponent', () => {
  let component: ElementWhatsNewComponent;
  let fixture: ComponentFixture<ElementWhatsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementWhatsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementWhatsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
