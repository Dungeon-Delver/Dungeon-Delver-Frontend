import "./Loader.css";

export default function Loader() {
  return (
    <div className="spin-container">
      <div className="spin loader"></div>
      <div className="spin loader2"></div>
      <div className="spin loader3"></div>
      <div className="spin loader4"></div>
      <span className="loader-text">LOADING...</span>
    </div>
  );
}
