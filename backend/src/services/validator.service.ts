import {HttpErrors} from '@loopback/rest';
import {Credentials} from '../types';

export function validateCredentials(credentials: Credentials) {
  // Validate Email
  if (!credentials.email || !isValidEmail(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('Invalid email');
  }

  // Validate Password Length
  if (!credentials.password || credentials.password.length < 6) {
    throw new HttpErrors.UnprocessableEntity(
      'Password must be minimum 6 characters',
    );
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}