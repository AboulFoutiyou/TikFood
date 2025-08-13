/// <reference types="express" />
import { AuthenticationStrategy } from '@loopback/authentication';
import { Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
export declare class JWTAuthenticationStrategy implements AuthenticationStrategy {
    name: string;
    constructor();
    authenticate(request: Request): Promise<UserProfile | undefined>;
    extractCredentials(request: Request): string;
    verifyToken(token: string): Promise<UserProfile>;
}
