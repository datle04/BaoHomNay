const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

async function seedUsers() {
  try {
    await User.deleteMany();

    const users = [
      {
        username: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('123456', 10),
        role: 'admin',
      },
      {
        username: 'Editor User',
        email: 'editor@example.com',
        password: await bcrypt.hash('123456', 10),
        role: 'editor',
      },
      {
        username: 'Normal User',
        email: 'user@example.com',
        password: await bcrypt.hash('123456', 10),
        role: 'client',
      },
    ];

    await User.insertMany(users);
    console.log('✅ Đã seed user thành công!');
    process.exit();
  } catch (err) {
    console.error('❌ Lỗi khi seed user:', err);
    process.exit(1);
  }
}

seedUsers();
