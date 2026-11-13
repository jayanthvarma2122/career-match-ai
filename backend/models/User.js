import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    college: {
      type: String,
      default: '',
      trim: true,
    },
    education: {
      type: String,
      default: 'B.Tech in Computer Science and Engineering',
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    careerInterests: {
      type: [String],
      default: ['Software Development', 'Frontend Engineering', 'Full Stack Development'],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;

