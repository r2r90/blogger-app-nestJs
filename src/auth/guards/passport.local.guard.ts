import { CanActivate } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class PassportLocalGuard extends AuthGuard('local') {

}