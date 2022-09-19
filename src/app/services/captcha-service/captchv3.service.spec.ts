import { TestBed } from '@angular/core/testing';

import { Captchv3Service } from './captchv3.service';

describe('Captchv3Service', () => {
  let service: Captchv3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Captchv3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
