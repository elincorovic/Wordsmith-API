import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login() {
    return 'Logged In';
  }

  signup() {
    return 'Signed Up';
  }
}
