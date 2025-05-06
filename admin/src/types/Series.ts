export interface Series {
    _id: string;
    title: string;
    genre: string[];
    description: string;
    coverImg: string;
    seasons: {
      season_title: string;
      episodes: {
        episode_title: string;
        video: string;
        description: string;
      }[];
    }[];
    rating: {
      userId: string;
      no: number;
    }[];
    comments: {
      userId: string;
      text: string;
    }[];
    director: string;
    createdAt: string;
    updatedAt: string;
  }
  