const passportLocalMongoose = require("passport-local-mongoose");
import Schema from "./configModels";
import mongoose, { Schema as SchemaType, Document, Model } from "mongoose";

export interface UserEntity extends Document {
  name: string;
  admin?: boolean;
  email: string;
  plan?: string;
  profileRank: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  isTester?: boolean;
  _id:string;
}
export interface UserEntityStatics extends Model<UserEntity> {
  register(user: UserEntity, password: string): Promise<UserEntity>;
  createStrategy(): any;
  authenticate(): (
    username: string,
    password: string
  ) => Promise<{ user: UserEntity | false; error: any }>;
}

const UserSchema: SchemaType<UserEntity> = new Schema(
  {
    // Username
    name: { type: String, maxLength: 20, required: true },
    // Flaga czy jest adminem
    admin: { type: Boolean, required: false },
    // Email
    email: { type: String, required: true, maxLength: 40 },
    // Plan głowny użytkownika
    plan: { type: Schema.Types.ObjectId, ref: "Plan", required: false },
    // Ranga użytkownika
    profileRank: { type: String, required: true },
    // Avatar użytkownika
    avatar: { type: String, required: false },
    isDeleted: { type: Boolean, default: false },
    isTester: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);
UserSchema.plugin(passportLocalMongoose, { usernameField: "name" });
const User = mongoose.model<UserEntity, UserEntityStatics>("User", UserSchema);

export default User;
