import './App.css';
import Facebook from '../Facebook/Facebook';

function App() {

  return (
    <div className="App">
      <h1>
        Dungeon Delver
      </h1>
      <p>
        To get started, authenticate with Facebook.
      </p>
      <Facebook />
    </div>
  );
}

export default App;
