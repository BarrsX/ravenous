import React from "react";
import Business from "../Business/Business";
import "./BusinessList.css";

class BusinessList extends React.Component {
  render() {
    if (!this.props.searchPerformed) {
      return (
        <div className="BusinessList BusinessList-empty">
          <p>
            Please enter a type of food and location to get recommendations.
          </p>
        </div>
      );
    } else if (this.props.businesses.length === 0) {
      return (
        <div className="BusinessList BusinessList-empty">
          <p>No businesses found. Please try another search.</p>
        </div>
      );
    } else {
      return (
        <div className="BusinessList">
          {this.props.businesses.map((business) => {
            return <Business business={business} key={business.id} />;
          })}
        </div>
      );
    }
  }
}

export default BusinessList;
