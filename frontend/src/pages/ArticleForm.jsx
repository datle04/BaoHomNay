import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  createArticle,
  updateArticle,
  fetchArticleById,
  setSelected,
} from '../features/articles/articleSlice';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

const ArticleForm = () => {
  const user = useSelector(state => state.auth)
  const selected = useSelector(state => state.articles.selected)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const quillRef = useRef(null);

  const { loading, error } = useSelector((state) => state.articles);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [tags, setTags] = useState('');

//   // Reset khi người dùng chuyển route
//   useEffect(() => {
//     dispatch(setSelected(null));
//   }, [location.pathname]);

  // Fetch article when editing
  useEffect(() => {
    if (id) {
      dispatch(fetchArticleById(id));
    }
    console.log(selected);
    
  }, [dispatch, id]);

  useEffect(() => {
  if (id && selected) {
    setTitle(selected.title || '');
    setSummary(selected.summary || '');
    setCategory(selected.category || '');
    setContent(selected.content || '');
    setThumbnailUrl(selected.thumbnail || '');
    setTags(selected.tags ? selected.tags.join(', ') : '');
  }
}, [selected, id]);


  // Upload image to Cloudinary (used in Quill)
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            toast.loading('Đang tải ảnh...', { id: 'upload-image' });

            try {
                const url = await uploadToCloudinary(file);
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', url);
                toast.success('Tải ảnh thành công', { id: 'upload-image' });
            } catch (err) {
                toast.error('Tải ảnh thất bại', { id: 'upload-image' });
            }
        };
    };


  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), []);

    const handleThumbnailUpload = async () => {
        if (!thumbnailFile) return thumbnailUrl;
        return await uploadToCloudinary(thumbnailFile);
    };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);

    try {
      const finalThumbnail = await handleThumbnailUpload();
      const data = {
        title,
        summary,
        category,
        content,
        thumbnail: finalThumbnail,
        tags: tagsArray,
      };

      if (id) {
        await dispatch(updateArticle({ id, data })).unwrap();
        toast.success('Cập nhật bài viết thành công');
      } else {
        await dispatch(createArticle(data)).unwrap();
        toast.success('Tạo bài viết thành công');
      }

      navigate('/articles');
    } catch (err) {
        console.log(err);
        toast.error('Có lỗi xảy ra');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">
        {id ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Tiêu đề</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Tóm tắt</label>
          <textarea
            required
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Chuyên mục</label>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Chọn chuyên mục --</option>
            <option value="Thời sự">Thời sự</option>
            <option value="Công nghệ">Công nghệ</option>
            <option value="Giáo dục">Giáo dục</option>
            <option value="Khoa học">Khoa học</option>
            <option value="Thế giới">Thế giới</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Tags (cách nhau bằng dấu phẩy)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="ví dụ: tin tức, công nghệ"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Thumbnail (upload)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
            className="w-full"
          />
          {thumbnailUrl && (
            <img src={thumbnailUrl} alt="Thumbnail" className="mt-2 w-40 rounded shadow" />
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Nội dung</label>
          <ReactQuill
            ref={quillRef}
            value={content}
            onChange={setContent}
            modules={modules}
            theme="snow"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {id ? (loading ? 'Đang cập nhật...' : 'Cập nhật bài viết') : (loading ? 'Đang tạo...' : 'Tạo bài viết')}
        </button>
      </form>
    </div>
  );
};

export default ArticleForm;
