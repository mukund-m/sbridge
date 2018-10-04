import { TestBed, async, inject } from '@angular/core/testing';

import { ValidityGuard } from './validity.guard';

describe('ValidityGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidityGuard]
    });
  });

  it('should ...', inject([ValidityGuard], (guard: ValidityGuard) => {
    expect(guard).toBeTruthy();
  }));
});
