import { TestBed } from '@angular/core/testing';

import { BebidaApiService } from './bebida-api.service';

describe('BebidaApiService', () => {
  let service: BebidaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BebidaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
