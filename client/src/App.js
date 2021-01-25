import {ReactSession} from 'react-client-session';
import logo from './logo.svg';
import './App.css';
import LoginButton from "./components/LoginButton";

function App() {

  ReactSession.setStoreType("sessionStorage");

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <LoginButton />
      </header>
    </div>
  );
}

export default App;
