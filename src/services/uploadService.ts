import { api } from './http';

/**
 * 上传响应数据
 */
export interface UploadData {
  url: string;
  file_name: string;
  file_size: number;
}

/**
 * 上传响应
 */
export interface UploadResponse {
  code: number | string;
  msg: string;
  data: {
    url: string;
    file_name: string;
    size: number | string;
  };
}

/**
 * 上传图片
 * @param file 图片文件
 * @param type 图片类型: 'avatar' 用户头像 | 'comment' 评论图片
 */
export const uploadImage = async (
  file: File,
  type: 'avatar' | 'comment' = 'comment'
): Promise<UploadData | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    // 使用 api.upload 以确保 multipart/form-data 正确设置，并由拦截器添加 Authorization
    const response = await api.upload<UploadResponse>('/upload/image', formData);

    if ((response.code === 0 || response.code === 200 || response.code === '200' || response.code === '0') && response.data) {
      const d = response.data;
      const mapped: UploadData = {
        url: d.url,
        file_name: d.file_name,
        file_size: typeof d.size === 'string' ? parseInt(d.size, 10) || 0 : d.size || 0
      };
      return mapped;
    }
    return null;
  } catch (error) {
    console.error('上传图片失败:', error);
    throw error;
  }
};

/**
 * 上传多张图片
 * @param files 图片文件数组
 * @param type 图片类型
 */
export const uploadImages = async (
  files: File[],
  type: 'avatar' | 'comment' = 'comment'
): Promise<UploadData[]> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, type));
    const results = await Promise.all(uploadPromises);
    return results.filter((result): result is UploadData => result !== null);
  } catch (error) {
    console.error('批量上传图片失败:', error);
    throw error;
  }
};

/**
 * 上传用户头像
 * @param file 头像文件
 */
export const uploadAvatar = async (file: File): Promise<UploadData | null> => {
  return uploadImage(file, 'avatar');
};

/**
 * 上传评论图片
 * @param file 图片文件
 */
export const uploadCommentImage = async (file: File): Promise<UploadData | null> => {
  return uploadImage(file, 'comment');
};

/**
 * 验证图片文件
 * @param file 文件
 * @param maxSize 最大文件大小(单位: KB)，默认5MB
 */
export const validateImageFile = (file: File, maxSize = 5120): { valid: boolean; message?: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: '只支持 JPG、PNG、GIF、WebP 格式的图片'
    };
  }

  if (file.size > maxSize * 1024) {
    return {
      valid: false,
      message: `图片大小不能超过 ${maxSize / 1024}MB`
    };
  }

  return { valid: true };
};

/**
 * 获取图片预览URL
 * @param file 文件
 */
export const getImagePreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * 释放图片预览URL
 * @param url 预览URL
 */
export const revokeImagePreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * 压缩图片
 * @param file 原始文件
 * @param quality 压缩质量(0-1)，默认0.8
 * @param maxWidth 最大宽度，默认1200
 */
export const compressImage = (
  file: File,
  quality = 0.8,
  maxWidth = 1200
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('图片压缩失败'));
            }
          }, 'image/jpeg', quality);
        } else {
          reject(new Error('无法获取canvas上下文'));
        }
      };
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
};
