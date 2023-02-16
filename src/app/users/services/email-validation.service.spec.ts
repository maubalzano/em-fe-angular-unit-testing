import { TestBed } from '@angular/core/testing';

import { EmailValidationService } from './email-validation.service';

describe('EmailValidationService', () => {
  let service: EmailValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should validate user email', () => {

    const truthyEmailValidation = service.checkIfEmailValid('mario.rossi@reqres.in', 'Mario', 'Rossi');

    expect(truthyEmailValidation).toBe(true);

    const wrongEmailValidation = service.checkIfEmailValid('m.rossi@req.in', 'Mario', 'Rossi');

    expect(wrongEmailValidation).toBe(false);

  })
});
