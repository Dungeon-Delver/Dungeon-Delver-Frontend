import { Link } from "react-router-dom";

import "./Logo.css";
import imageSource from "../../images/Icon.png";

export default function Logo() {
  return (
    <div className="logo">
      <Link to="/">
        <img className="logo-img" src={imageSource} alt="Return Home" />
      </Link>
    </div>
  );
}
