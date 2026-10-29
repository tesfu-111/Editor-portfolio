export interface ParsedVideo {
  type: 'youtube' | 'vimeo' | 'gdrive' | 'direct' | 'unknown';
  embedUrl: string;
  originalUrl: string;
}

export function parseVideoUrl(url: string): ParsedVideo {
  if (!url) {
    return { type: 'unknown', embedUrl: '', originalUrl: '' };
  }

  const trimmed = url.trim();

  // 1. YouTube
  // Matches: https://www.youtube.com/watch?v=ID, https://youtu.be/ID, https://www.youtube.com/embed/ID, https://www.youtube.com/shorts/ID
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`,
      originalUrl: trimmed,
    };
  }

  // 2. Vimeo
  // Matches: https://vimeo.com/123456789 or https://player.vimeo.com/video/123456789
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const vimeoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?dnt=1&title=0&byline=0&portrait=0`,
      originalUrl: trimmed,
    };
  }

  // 3. Google Drive
  // Matches: https://drive.google.com/file/d/FILE_ID/view...
  const gdriveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([\w-]+)/i);
  if (gdriveMatch && gdriveMatch[1]) {
    const fileId = gdriveMatch[1];
    return {
      type: 'gdrive',
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      originalUrl: trimmed,
    };
  }

  // 4. Direct video files (MP4, WebM, MOV or local /uploads/...)
  if (
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('blob:') ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed) ||
    trimmed.includes('commondatastorage.googleapis.com') ||
    trimmed.includes('storage.googleapis.com')
  ) {
    return {
      type: 'direct',
      embedUrl: trimmed,
      originalUrl: trimmed,
    };
  }

  // Default fallback
  return {
    type: 'direct',
    embedUrl: trimmed,
    originalUrl: trimmed,
  };
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
