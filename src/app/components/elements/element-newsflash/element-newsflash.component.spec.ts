import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementNewsflashComponent } from './element-newsflash.component';

describe('ElementNewsflashComponent', () => {
  let component: ElementNewsflashComponent;
  let fixture: ComponentFixture<ElementNewsflashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementNewsflashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementNewsflashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
