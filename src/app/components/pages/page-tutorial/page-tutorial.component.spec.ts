import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTutorialComponent } from './page-tutorial.component';

describe('PageTutorialComponent', () => {
  let component: PageTutorialComponent;
  let fixture: ComponentFixture<PageTutorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageTutorialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
