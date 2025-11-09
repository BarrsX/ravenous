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
            {/* Miller's Law & Cognitive Load - Clear, concise instructions */}
            <span className="empty-icon" role="img" aria-label="Search">
              🔍
            </span>
            <p className="empty-title">Find Your Next Great Meal</p>
            <p className="empty-subtitle">
              Enter a type of food and location to discover local restaurants
            </p>
          </div>
        ) : this.props.businesses.length === 0 ? (
          <div className="BusinessList-empty">
            <span className="empty-icon" role="img" aria-label="No results">
              😕
            </span>
            <p className="empty-title">No Results Found</p>
            <p className="empty-subtitle">
              Try adjusting your search or location
            </p>
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
