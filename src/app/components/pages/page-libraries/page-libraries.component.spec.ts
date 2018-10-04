import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLibrariesComponent } from './page-libraries.component';

describe('PageLibrariesComponent', () => {
  let component: PageLibrariesComponent;
  let fixture: ComponentFixture<PageLibrariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageLibrariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLibrariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
