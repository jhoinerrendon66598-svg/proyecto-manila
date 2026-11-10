import { TestBed } from '@angular/core/testing';

import { ComidaApiService } from './comida-api.service';

describe('ComidaApiService', () => {
  let service: ComidaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComidaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
