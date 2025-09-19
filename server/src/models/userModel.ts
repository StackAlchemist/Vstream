import mongoose, { Document, Model } from "mongoose";
import { isEmail } from "validator";
import bcrypt from "bcrypt";

// 1. Define the User document shape
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

// Define static methods
export interface IUserModel extends Model<IUser> {
  login(email: string, password: string): Promise<IUser>;
}

//  Schema
const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
}, { timestamps: true });

//  Pre-save hook
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next(); // only hash if password is new/changed
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 5. Post-save hook
userSchema.post("save", function (doc: IUser, next) {
  console.log("user created", doc);
  next();
});

// 6. Static login method
userSchema.statics.login = async function (
  email: string,
  password: string
): Promise<IUser> {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) return user;
    throw new Error("Wrong Credentials");
  }
  throw new Error("I know not this man");
};

// 7. Model
const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
