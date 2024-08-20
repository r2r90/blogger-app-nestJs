import { InjectModel } from "@nestjs/mongoose";
import { User } from "../../db/schemas/users.schema";
import { Model } from "mongoose";

export class AuthQueryRepository {
  @InjectModel(User.name) private readonly userModel: Model<User>;



}