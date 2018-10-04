import { TestBed, inject } from '@angular/core/testing';

import { FirebaseQuizService } from './firebase-quiz.service';

describe('FirebaseQuizService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseQuizService]
    });
  });

  it('should be created', inject([FirebaseQuizService], (service: FirebaseQuizService) => {
    expect(service).toBeTruthy();
  }));
});
