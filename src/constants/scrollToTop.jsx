// ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router";

const ScrollToTop = (props) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [location]);

  return <>{props.children}</>
};

export default ScrollToTop;