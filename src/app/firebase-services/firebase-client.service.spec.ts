import { TestBed, inject } from '@angular/core/testing';

import { FirebaseClientService } from './firebase-client.service';

describe('FirebaseClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseClientService]
    });
  });

  it('should be created', inject([FirebaseClientService], (service: FirebaseClientService) => {
    expect(service).toBeTruthy();
  }));
});
