import styled from "styled-components";
import {
  motion,
  useAnimation,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useNavigate, useMatch } from "react-router-dom";
import { useState } from "react";
import SearchIcon from "../assets/icon-search.png";

const Nav = styled(motion.nav)`
  width: 100%;
  height: 65px;
  padding: 20px 60px;
  display: flex;
  position: fixed;
  top: 0;
  font-size: 14px;
  color: ${(props) => props.theme.white.lighter};
  background-color: ${(props) => props.theme.black.darker};
  z-index: 1;
`;

const Logo = styled(motion.svg)`
  height: 25px;
  width: 95px;
  fill: ${(props) => props.theme.red};
  margin-right: 50px;
  path {
    stroke-width: 6px;
    stroke: white;
  }
`;

const Items = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Item = styled.li`
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
  margin-right: 15px;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Circle = styled(motion.span)`
  width: 5px;
  height: 5px;
  border-radius: 3px;
  background-color: ${(props) => props.theme.red};
  position: absolute;
  left: 0;
  right: 0;
  bottom: -8px;
  margin: 0 auto;
`;

const Search = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const Input = styled(motion.input)`
  margin-left: 5px;
  transform-origin: right center;
  border: 1px solid white;
  background-color: ${(props) => props.theme.black.lighter};
  height: 35px;
  width: 200px;
  color: white;
  padding-left: 35px;
  border: 1px solid white;

  &:focus {
    outline: none;
  }
`;

const Icon = styled(motion.img)`
  width: 20px;
  height: 20px;
  margin-left: auto;
`;

const logoVariants = {
  normal: { fillOpacity: 1 },
  active: {
    fillOpacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
    },
  },
};

const navVariants = {
  top: { backgroundColor: "rgba(0, 0, 0, 0)" },
  scroll: { backgroundColor: "rgba(0, 0, 0, 1)" },
};

const Header = () => {
  const navigate = useNavigate();
  const homeMatch = useMatch("/");
  const tvMatch = useMatch("/tv");
  const [openSearch, setOpenSearch] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputAnimation = useAnimation();
  const navAnimation = useAnimation();
  const { scrollY } = useScroll();

  const handleSearchClick = () => {
    if (openSearch) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({
        scaleX: 1,
      });
    }
    setOpenSearch((prev) => !prev);
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 70) {
      navAnimation.start("scroll");
    } else {
      navAnimation.start("top");
    }
  });
  return (
    <Nav variants={navVariants} initial="top" animate={navAnimation}>
      <Logo
        variants={logoVariants}
        initial="normal"
        whileHover="active"
        xmlns="http://www.w3.org/2000/svg"
        width="1024"
        height="276.742"
        viewBox="0 0 1024 276.742"
      >
        <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
      </Logo>
      <Items>
        <Item onClick={() => navigate("/")}>
          Home {homeMatch && <Circle layoutId="circle" />}
        </Item>
        <Item onClick={() => navigate("/tv")}>
          Tv Shows {tvMatch && <Circle layoutId="circle" />}
        </Item>
      </Items>
      {
        <Search>
          <Icon
            layoutId="icon"
            src={SearchIcon}
            alt="search"
            onClick={handleSearchClick}
            animate={{
              x: openSearch ? 35 : 200,
            }}
            transition={{ type: "tween" }}
          />
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            initial={{ scaleX: 0 }}
            animate={inputAnimation}
            transition={{ type: "tween" }}
          />
        </Search>
      }
    </Nav>
  );
};

export default Header;
