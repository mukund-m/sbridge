import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementAdministrativeStatisticsComponent } from './element-administrative-statistics.component';

describe('ElementAdministrativeStatisticsComponent', () => {
  let component: ElementAdministrativeStatisticsComponent;
  let fixture: ComponentFixture<ElementAdministrativeStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementAdministrativeStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementAdministrativeStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
