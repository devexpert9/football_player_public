import { TestBed } from '@angular/core/testing';

import { InternetGuardService } from './internet-guard.service';

describe('InternetGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InternetGuardService = TestBed.get(InternetGuardService);
    expect(service).toBeTruthy();
  });
});
