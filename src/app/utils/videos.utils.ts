export interface Video {
  id: number;
  title: string;
  description: string;
  video_file: string;
  thumbnail: string;
  file_120p: string;
  file_360p: string;
  file_720p: string;
  file_1080p: string;
  hls_playlist: string;
  genre_name: string;
  created_at: string;
}
