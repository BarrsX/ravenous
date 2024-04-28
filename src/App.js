import React from "react";
import BusinessList from "./components/BusinessList/BusinessList";
import SearchBar from "./components/SearchBar/SearchBar";
import Yelp from "./util/Yelp";
import "./App.css";
import "./LoadingBar.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      businesses: [],
      searchPerformed: false,
      isLoading: false,
    };

    this.searchYelp = this.searchYelp.bind(this);
  }

  searchYelp(term, location, sortBy) {
    this.setState({ isLoading: true });
    Yelp.search(term, location, sortBy).then((businesses) => {
      this.setState({
        businesses: businesses,
        searchPerformed: true,
        isLoading: false,
      });
    });
  }

  render() {
    return (
      <div className="App">
        <h1>ravenous</h1>
        <SearchBar searchYelp={this.searchYelp} />
        <BusinessList
          businesses={this.state.businesses}
          searchPerformed={this.state.searchPerformed}
          isLoading={this.state.isLoading}
        />
      </div>
    );
  }
}

export default App;
