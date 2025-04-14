import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMovieList } from "../api";
import { useQuery } from "@tanstack/react-query";
import { Movies, MoviesDetail } from "../types/api";
import styled from "styled-components";
import { motion } from "framer-motion";
import Slider from "../components/Slider";
import Detail from "../components/Detail";

export const IMAGE_URL = "https://image.tmdb.org/t/p/original";

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

const bannerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 1 } },
  exit: { opacity: 0, transition: { duration: 1 } },
};

const Home = () => {
  const navigate = useNavigate();
  const getViewportWidth = () => document.documentElement.clientWidth;
  const { data, isLoading } = useQuery<Movies>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovieList,
  });
  const [currentMovie, setCurrentMovie] = useState<MoviesDetail | null>(null);
  const [bannerMovie, setBannerMovie] = useState<MoviesDetail | null>(null);
  const [windowWidth, setWindowWidth] = useState(
    document.documentElement.clientWidth - 300
  );
  const [nowPlayingSlider, setNowPlayingSlider] = useState<
    MoviesDetail[] | null
  >(null);
  const [page, setPage] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
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

  const onClickMovie = (id: string) => {
    if (data) {
      setCurrentMovie(data.results.find((el) => String(el.id) === id)!);
      setOpenDetail((prev) => !prev);
      navigate(`/movies/${id}`);
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
      setBannerMovie(data.results[0]);
      setNowPlayingSlider(data.results.slice(0, newOffset));
    }
  }, [data, windowWidth]);

  useEffect(() => {
    if (!data) return;

    let index = 0;
    const total = data.results.length;

    const intervalId = setInterval(() => {
      index = (index + 1) % total; // 마지막 인덱스까지 갔다가 다시 처음으로
      setBannerMovie(data.results[index]);
    }, 7000); // 7초마다 실행

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
  }, [data]);

  return (
    <div style={{ position: "relative" }}>
      {isLoading ? (
        "Loading..."
      ) : (
        <>
          <Banner
            $bgPhoto={`${IMAGE_URL}${bannerMovie?.backdrop_path}`}
            key={bannerMovie?.id}
            onClick={nextSlider}
            variants={bannerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Title>{bannerMovie?.title}</Title>
            <Overview>{bannerMovie?.overview}</Overview>
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
      {openDetail ? (
        <Detail
          openModal={() =>
            onClickMovie(currentMovie ? String(currentMovie?.id) : "")
          }
          data={data}
        />
      ) : null}
    </div>
  );
};

export default Home;
