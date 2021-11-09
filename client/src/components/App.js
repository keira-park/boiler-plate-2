import React from 'react';
//import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  //Link
} from 'react-router-dom';

import LandingPage from './views/LandingPage/LandingPage';
import LoginPage from './views/LoginPage/LoginPage';
import RegisterPage from './views/RegisterPage/RegisterPage';
// import NavBar from "./views/NavBar/NavBar";
// import Footer from "./views/Footer/Footer"

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
        </Switch>
      </div>
    </Router>
  );
}


export default App; 
