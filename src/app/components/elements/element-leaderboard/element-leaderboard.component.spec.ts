import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementLeaderboardComponent } from './element-leaderboard.component';

describe('ElementLeaderboardComponent', () => {
  let component: ElementLeaderboardComponent;
  let fixture: ComponentFixture<ElementLeaderboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementLeaderboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
