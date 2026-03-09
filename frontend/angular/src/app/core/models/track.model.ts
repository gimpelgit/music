import { Artist } from './artist.model';
import { Genre } from './genre.model';

export interface Track {
  id: number;
  title: string;
  albumId: number;
  albumTitle: string;
  durationSeconds: number;
  fileUrl: string;
  lyrics?: string;
  releaseDate: string;
  artists: Artist[];
  genres: Genre[];
}