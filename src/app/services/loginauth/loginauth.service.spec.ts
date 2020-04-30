import { TestBed } from '@angular/core/testing';

import { LoginauthService } from './loginauth.service';

describe('LoginauthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginauthService = TestBed.get(LoginauthService);
    expect(service).toBeTruthy();
  });
});
