import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  middleName: {type: String},
  lastName: {type: String, required: true},
  userType: {type: String, enum: ['customer', 'admin'], required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});

const User = mongoose.model('User', userSchema, 'users');
export default User;
