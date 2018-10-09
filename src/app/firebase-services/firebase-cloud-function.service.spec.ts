import { TestBed, inject } from '@angular/core/testing';

import { FirebaseCloudFunctionService } from './firebase-cloud-function.service';

describe('FirebaseCloudFunctionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseCloudFunctionService]
    });
  });

  it('should be created', inject([FirebaseCloudFunctionService], (service: FirebaseCloudFunctionService) => {
    expect(service).toBeTruthy();
  }));
});
