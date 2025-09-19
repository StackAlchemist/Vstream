import mongoose from 'mongoose';
import { isEmail } from 'validator';
import bcrypt from 'bcrypt';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

adminSchema.pre('save', async function (next) {
  const admin = this as any; // Cast to any so TS knows `password` exists
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(admin.password, salt);
  admin.password = hash;
  next();
});

adminSchema.post('save', async function (doc: any, next: Function) {
  console.log('admin created', doc);
  next();
});

adminSchema.statics.login = async function (email: string, password: string) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw new Error('Wrong Credentials');
  }
  throw new Error('I know not this man');
};

const Directors = mongoose.model('directors', adminSchema);
export default Directors;
