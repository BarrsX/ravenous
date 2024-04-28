import React from "react";
import Business from "../Business/Business";
import "./BusinessList.css";
import "../../LoadingBar.css";

class BusinessList extends React.Component {
  render() {
    return (
      <div className="BusinessList">
        {this.props.isLoading ? (
          <div className="LoadingBar"></div>
        ) : !this.props.searchPerformed ? (
          <div className="BusinessList-empty">
            <p>
              Please enter a type of food and location to get recommendations.
            </p>
          </div>
        ) : this.props.businesses.length === 0 ? (
          <div className="BusinessList-empty">
            <p>No businesses found. Please try another search.</p>
          </div>
        ) : (
          this.props.businesses.map((business) => {
            return <Business business={business} key={business.id} />;
          })
        )}
      </div>
    );
  }
}

export default BusinessList;
