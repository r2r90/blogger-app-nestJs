import { AuthGuard } from '@nestjs/passport';

export class PassportLocalGuard extends AuthGuard('local') {}
