// utils/cloudinaryUpload.js
export const uploadToCloudinary = async (file, uploadPreset = 'BaoHomNay') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/dr0idfkuw/image/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    throw new Error('Lỗi khi upload ảnh lên Cloudinary');
  }
};
