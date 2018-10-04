import { TestBed, inject } from '@angular/core/testing';

import { FirebaseModuleService } from './firebase-module.service';

describe('FirebaseModuleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseModuleService]
    });
  });

  it('should be created', inject([FirebaseModuleService], (service: FirebaseModuleService) => {
    expect(service).toBeTruthy();
  }));
});
