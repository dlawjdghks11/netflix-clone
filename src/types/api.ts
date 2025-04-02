export interface MoviesDetail {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  id: number;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface Movies {
  dates: { maximum: string; minimum: string };
  page: number;
  results: MoviesDetail[];
  total_pages: number;
  total_results: number;
}
