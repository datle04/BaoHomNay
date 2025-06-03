// src/components/HeroSection.jsx
import { Link } from 'react-router-dom';

const HeroSection = ({ featuredArticle }) => {
  if (!featuredArticle) return null;

  const getCategory = (key) => {
  switch (key) {
    case "thoisu":
      return "Thời sự";
    case "xahoi":
      return "Xã hội";
    case "khoahoc":
      return "Khoa học";
    case "thethao":
      return "Thể thao";
    case "congnghe":
      return "Công nghệ";
    case "thegioi":
      return "Thế giới";
    case "giaoduc":
      return "Giáo dục";
    default:
      return "Danh mục khác";
  }
};


  return (
    <section className="relative bg-gray-100 mb-8">
      <div className="max-w-7xl mx-auto px-4 py-8 md:flex md:gap-8">
        <div className="md:w-1/2">
          <img
            src={featuredArticle.thumbnail}
            alt={featuredArticle.title}
            className="rounded-lg w-full h-80 object-cover shadow-md"
          />
        </div>
        <div className="md:w-1/2 mt-6 md:mt-0">
          <span className="text-sm text-indigo-600 uppercase font-semibold">
            {getCategory(featuredArticle.category)}
          </span>
          <h1 className="text-3xl font-bold mt-2">{featuredArticle.title}</h1>
          <p className="text-gray-700 mt-4">{featuredArticle.summary}</p>
          <Link
            to={`/article/${featuredArticle.slug}`}
            className="inline-block mt-6 px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Đọc tiếp
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
