import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'qxy9cpgl',
  api_key: process.env.CLOUDINARY_API_KEY || '917694586341429',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Ca3W7kfTWgJc98knIpnJbO6WmLQ',
  secure: true,
});

export default cloudinary;
