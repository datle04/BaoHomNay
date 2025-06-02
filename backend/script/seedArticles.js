const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Article = require('../models/Article');
const User = require('../models/User'); // Giả sử bạn đã có User model

dotenv.config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Hàm seed dữ liệu
async function seedArticles() {
  try {
    const author = await User.findOne(); // lấy 1 user làm tác giả

    if (!author) {
      console.log("Không có user nào trong database!");
      return;
    }

    const articles = [
      {
        title: 'Khám phá du lịch Việt Nam 2025',
        slug: 'kham-pha-du-lich-viet-nam-2025',
        content: '<p>Việt Nam là điểm đến hấp dẫn...</p>',
        summary: 'Tổng quan về các địa điểm du lịch nổi bật năm 2025.',
        category: 'Du lịch',
        tags: ['du lịch', '2025', 'trending'],
        published: true,
        author: author._id,
        thumbnail: 'https://placehold.co/600x400?text=Du+Lich',
      },
      {
        title: 'Thị trường chứng khoán tuần này',
        slug: 'thi-truong-chung-khoan-tuan-nay',
        content: '<p>Thị trường có nhiều biến động do lãi suất...</p>',
        summary: 'Phân tích biến động thị trường trong tuần.',
        category: 'Kinh tế',
        tags: ['chứng khoán', 'kinh tế', 'thị trường'],
        published: true,
        author: author._id,
        thumbnail: 'https://placehold.co/600x400?text=Kinh+Te',
      },
      // Thêm các bài khác nếu muốn
    ];

    await Article.deleteMany(); // Xoá các bài cũ
    await Article.insertMany(articles);

    console.log('✅ Đã seed dữ liệu bài viết thành công!');
    process.exit();
  } catch (err) {
    console.error('❌ Seed thất bại:', err);
    process.exit(1);
  }
}

seedArticles();
