import { useEffect, useState } from "react";
import { getMovieList } from "../api";
import { useQuery } from "@tanstack/react-query";
import { Movies, MoviesDetail } from "../types/api";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const IMAGE_URL = "https://image.tmdb.org/t/p/original";
const OFFSET = 8;

const Banner = styled.div<{ $bgPhoto: string }>`
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  background-position: center;
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

const Slider = styled(motion.div)<{
  width: number;
  height: number;
  $offset: number;
}>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$offset}, 1fr);
  column-gap: 8px;
  width: ${(props) => props.width}px;
  position: absolute;
  height: ${(props) => props.height}px;
  top: auto;
  bottom: -50px;
  padding: 0 9px;
`;

const Card = styled(motion.div)<{ $bgPhoto: string; selected: boolean }>`
  background-color: white;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  border: ${(props) => (props.selected ? "3px solid red" : "none")};
`;

const sliderVariants = {
  hidden: { x: window.innerWidth - 10 },
  show: { x: 0 },
  exit: { x: -window.innerWidth + 10 },
};

const Home = () => {
  const { data, isLoading } = useQuery<Movies>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovieList,
  });
  const [currentMovie, setCurrentMovie] = useState<MoviesDetail | null>(null);
  const [nowPlayingSlider, setNowPlayingSlider] = useState<
    MoviesDetail[] | null
  >(null);
  const [page, setPage] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const nowPlayingMoviesLength = data ? data?.results.length : 0;

  const nextSlider = () => {
    if (data && !leaving) {
      setLeaving(true);
      if (OFFSET * page + OFFSET < nowPlayingMoviesLength) {
        setPage((prev) => prev + 1);
        setNowPlayingSlider(
          data?.results.slice(OFFSET * (page + 1), OFFSET * (page + 2))
        );
      } else {
        setPage(0);
        setNowPlayingSlider(data?.results.slice(0, OFFSET));
      }
      setTimeout(() => setLeaving(false), 500);
    }
  };

  const selectMovie = (id: number) => {
    if (data) {
      setCurrentMovie(data.results.find((el) => el.id === id)!);
    }
  };

  useEffect(() => {
    if (data) {
      setCurrentMovie(data.results[0]);
      setNowPlayingSlider(data.results.slice(0, OFFSET));
    }
  }, [data]);

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
          <AnimatePresence>
            <Slider
              variants={sliderVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              key={page}
              $offset={OFFSET}
              width={window.screen.width - 18}
              height={(window.screen.width / OFFSET) * 1.3}
              transition={{ type: "tween", duration: 0.5 }}
            >
              {nowPlayingSlider?.map((el) => (
                <Card
                  key={el.id}
                  onClick={(id) => selectMovie(el.id)}
                  $bgPhoto={`${IMAGE_URL}${el.poster_path}`}
                  selected={el.id === currentMovie!.id}
                />
              ))}
            </Slider>
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default Home;
