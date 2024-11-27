export class CreateBlogCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly websiteUrl: string,
  ) {

  }
}
