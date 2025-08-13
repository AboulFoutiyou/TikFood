import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import * as jwt from 'jsonwebtoken';

export class JWTAuthenticationStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor() {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token: string = this.extractCredentials(request);
    const userProfile: UserProfile = await this.verifyToken(token);
    return userProfile;
  }

  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization header not found.`);
    }

    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type 'Bearer'.`,
      );
    }

    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2)
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`,
      );

    return parts[1];
  }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(`Error verifying token : 'token' is null`);
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      const userProfile: UserProfile = {
        [securityId]: (decodedToken as any).id,
        name: (decodedToken as any).name,
        id: (decodedToken as any).id,
        email: (decodedToken as any).email,
        roles: (decodedToken as any).roles,
      };

      return userProfile;
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error verifying token : ${error.message}`);
    }
  }
}
