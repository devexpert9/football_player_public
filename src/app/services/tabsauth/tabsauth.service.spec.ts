import { TestBed } from '@angular/core/testing';

import { TabsauthService } from './tabsauth.service';

describe('TabsauthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TabsauthService = TestBed.get(TabsauthService);
    expect(service).toBeTruthy();
  });
});
