import styled from "styled-components";
import { motion } from "framer-motion";
import { Movies } from "../types/api";
import { useParams } from "react-router-dom";
import { IMAGE_URL } from "../pages/Home";

const Backdrop = styled(motion.div)`
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 2;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 15px;
  background-color: white;
  overflow: hidden;
  width: 45%;
  aspect-ratio: 1;
  z-index: 3;
`;

const Contents = styled.div`
  padding: 0 20px;
`;

const Image = styled.img`
  width: 100%;
`;

const Keywords = styled.div``;

const Description = styled.p`
  font-size: 13px;
`;

const Buttons = styled.div``;

interface IDetail {
  openModal: () => void;
  data: Movies | undefined;
}

const Detail = ({ openModal, data }: IDetail) => {
  const { movieId } = useParams();
  const movieData = data
    ? data.results.find((el) => String(el.id) === movieId)
    : null;
  return (
    <Backdrop onClick={openModal}>
      <Modal onClick={(e) => e.stopPropagation()}>
        {movieData ? (
          <>
            <Image
              src={`${IMAGE_URL}/${movieData.backdrop_path}`}
              alt={movieData.title}
            />
            <Contents>
              <Keywords></Keywords>
              <Description>{movieData.overview}</Description>
              <Buttons></Buttons>
            </Contents>
          </>
        ) : null}
      </Modal>
    </Backdrop>
  );
};

export default Detail;
