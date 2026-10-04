// libs/auth/src/lib/services/auth.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let service: AuthService;
  let tokenService: TokenService;
  let routerSpy: { navigateByUrl: jest.Mock };

  beforeEach(() => {
    routerSpy = { navigateByUrl: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        TokenService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
  });

  it('should authenticate user and set token on login', async () => {
    const success = await service.login({ username: 'demoUser' });
    expect(success).toBe(true);
    expect(tokenService.isValid()).toBe(true);
    expect(service.currentUser()?.username).toBe('demoUser');
  });

  it('should clear token and navigate on logout', () => {
    service.logout('/auth/login');
    expect(tokenService.token()).toBeNull();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/auth/login');
  });

  it('should verify roles correctly', async () => {
    await service.login({ username: 'financeUser' });
    expect(service.hasRole('ROLE_FINANCE_MANAGER')).toBe(true);
    expect(service.hasAnyRole(['ROLE_ADMIN', 'NON_EXISTENT'])).toBe(true);
    expect(service.hasRole('UNKNOWN_ROLE')).toBe(false);
  });
});
