import axios from "axios";
import { Movies } from "./types/api";

const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;
const PATH = "https://api.themoviedb.org/3";

export const getMovieList = async () => {
  const res = await axios.get<Movies>(
    `${PATH}/movie/now_playing?language=ko-KR&page=1&region=KR`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );
  return res.data;
};
