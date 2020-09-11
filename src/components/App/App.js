import React from 'react';
import logo from '../../logo.svg';
import BusinessList from '../BusinessList/BusinessList.js';
import SearchBar from '../SearchBar/SearchBar.js';
import './App.css';

class App extends React.Component {
  render () {
      return (
    <div className="App">
      <h1>ravenous</h1>
      <SearchBar />
      <BusinessList />
    </div>
      );
    };
  }

export default App;
