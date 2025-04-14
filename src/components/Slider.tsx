import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { MoviesDetail } from "../types/api";

const Container = styled.div`
  height: 225px;
  display: flex;
  justify-content: center;
  overflow-x: visible;
  position: relative;
  margin-top: -160px;
`;

interface RowProps {
  offset: number;
}

const Row = styled(motion.div)<RowProps>`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(${(props) => props.offset}, 1fr);
  column-gap: 8px;
  padding: 0 9px;
`;

const Card = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center;
  width: 150px;
  aspect-ratio: 1 / 1.5;
  border: 1px solid red;
`;

const rowVariants = {
  hidden: { x: document.documentElement.clientWidth + 80 },
  show: { x: 0 },
  exit: { x: -document.documentElement.clientWidth - 80 },
};

const cardVariants = {
  initial: { scale: 1, transition: { type: "tween" } },
  hover: {
    scale: 1.1,
    transition: {
      type: "tween",
    },
  },
  exit: {},
};

interface List {
  row: MoviesDetail[] | null;
  imageUrl: string;
  offset: number;
  page: number;
  onClickMovie: (id: string) => void;
}

const Slider = ({ row, imageUrl, offset, page, onClickMovie }: List) => {
  return (
    <Container>
      <AnimatePresence initial={false}>
        <Row
          offset={offset}
          variants={rowVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          key={page}
          transition={{ type: "tween", duration: 0.5 }}
        >
          {row?.map((el) => (
            <Card
              key={el.id}
              variants={cardVariants}
              initial="initial"
              whileHover="hover"
              exit="exit"
              onClick={() => onClickMovie(String(el.id))}
              $bgPhoto={`${imageUrl}${el.poster_path}`}
            />
          ))}
        </Row>
      </AnimatePresence>
    </Container>
  );
};

export default Slider;
