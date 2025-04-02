import { useEffect, useState } from "react";
import { getMovieList } from "../api";
import { useQuery } from "@tanstack/react-query";
import { Movies, MoviesDetail } from "../types/api";
import styled from "styled-components";

const IMAGE_URL = "https://image.tmdb.org/t/p/original";

const Banner = styled.div<{ $bgPhoto: string }>`
  width: 100%;
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h2`
  color: ${(props) => props.theme.white.darker};
  font-size: 40px;
  margin-bottom: 15px;
`;

const Overview = styled.p`
  color: ${(props) => props.theme.white.darker};
  font-size: 17px;
  width: 43%;
  white-space: normal;
  word-break: keep-all;
  line-height: 20px;
`;

const Home = () => {
  const { data, isLoading } = useQuery<Movies>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovieList,
  });
  const [currentMovie, setCurrentMovie] = useState<MoviesDetail | null>(null);

  useEffect(() => {
    if (data?.results.length) {
      setCurrentMovie(data.results[0]);
    }
  }, [data]);

  return (
    <div>
      {isLoading ? (
        "Loading..."
      ) : (
        <Banner $bgPhoto={`${IMAGE_URL}${currentMovie?.backdrop_path}`}>
          <Title>{currentMovie?.title}</Title>
          <Overview>{currentMovie?.overview}</Overview>
        </Banner>
      )}
    </div>
  );
};

export default Home;
