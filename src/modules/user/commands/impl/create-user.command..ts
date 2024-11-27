export class CreateUserCommand {
  constructor(
    public readonly login: string,
    public readonly password: string,
    public readonly email: string,
    public readonly isAdmin: boolean,
  ) {}
}
