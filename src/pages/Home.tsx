import { useEffect, useState } from "react";
import { getMovieList } from "../api";
import { useQuery } from "@tanstack/react-query";
import { Movies, MoviesDetail } from "../types/api";
import styled from "styled-components";
import { motion } from "framer-motion";
import Slider from "../components/Slider";

const IMAGE_URL = "https://image.tmdb.org/t/p/original";

const Banner = styled(motion.div)<{ $bgPhoto: string }>`
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  background-position: cenfter;
`;

const Title = styled.h2`
  color: ${(props) => props.theme.white.darker};
  font-size: 40px;
  margin-bottom: 15px;
`;

const Overview = styled.p`
  color: ${(props) => props.theme.white.darker};
  font-size: 17px;
  width: 50%;
  white-space: normal;
  word-break: keep-all;
  line-height: 20px;
`;

const Home = () => {
  const getViewportWidth = () => document.documentElement.clientWidth;
  const { data, isLoading } = useQuery<Movies>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovieList,
  });
  const [currentMovie, setCurrentMovie] = useState<MoviesDetail | null>(null);
  const [windowWidth, setWindowWidth] = useState(
    document.documentElement.clientWidth - 300
  );
  const [nowPlayingSlider, setNowPlayingSlider] = useState<
    MoviesDetail[] | null
  >(null);
  const [page, setPage] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const nowPlayingMoviesLength = data ? data?.results.length : 0;
  const offset = Math.ceil(windowWidth / 150);

  const nextSlider = () => {
    if (data && !leaving) {
      setLeaving(true);
      if (offset * page + offset < nowPlayingMoviesLength) {
        setPage((prev) => prev + 1);
        setNowPlayingSlider(
          data?.results.slice(offset * (page + 1), offset * (page + 2))
        );
      } else {
        setPage(0);
        setNowPlayingSlider(data?.results.slice(0, offset));
      }
      setTimeout(() => setLeaving(false), 500);
    }
  };

  const onClickMovie = (id: number) => {
    if (data) {
      setCurrentMovie(data.results.find((el) => el.id === id)!);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(getViewportWidth() - 300);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const newOffset = Math.ceil(windowWidth / 150);
    if (data) {
      setCurrentMovie(data.results[0]);
      setNowPlayingSlider(data.results.slice(0, newOffset));
    }
  }, [data, windowWidth]);

  return (
    <div>
      {isLoading ? (
        "Loading..."
      ) : (
        <>
          <Banner
            $bgPhoto={`${IMAGE_URL}${currentMovie?.backdrop_path}`}
            onClick={nextSlider}
          >
            <Title>{currentMovie?.title}</Title>
            <Overview>{currentMovie?.overview}</Overview>
          </Banner>
          <Slider
            row={nowPlayingSlider}
            offset={offset}
            imageUrl={IMAGE_URL}
            page={page}
            onClickMovie={onClickMovie}
          />
        </>
      )}
    </div>
  );
};

export default Home;
