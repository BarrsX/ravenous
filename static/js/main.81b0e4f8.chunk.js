(this.webpackJsonprestaurant=this.webpackJsonprestaurant||[]).push([[0],[,,,,,,,,function(e,t,n){e.exports=n(18)},,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var a=n(0),s=n.n(a),r=n(7),i=n.n(r),o=(n(13),n(1)),c=n(2),l=n(5),u=n(4),h=n(3),d=(n(14),function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(){return Object(o.a)(this,n),t.apply(this,arguments)}return Object(c.a)(n,[{key:"render",value:function(){return s.a.createElement("div",{className:"Business"},s.a.createElement("div",{className:"image-container"},s.a.createElement("img",{src:this.props.business.imageSrc,alt:this.props.business.name})),s.a.createElement("h2",null,this.props.business.name),s.a.createElement("div",{className:"Business-information"},s.a.createElement("div",{className:"Business-address"},s.a.createElement("a",{href:"https://maps.google.com?q=".concat(this.props.business.latitude,",").concat(this.props.business.longitude),target:"_blank",rel:"noopener noreferrer"},s.a.createElement("p",null,this.props.business.address),s.a.createElement("p",null,this.props.business.city),s.a.createElement("p",null,this.props.business.state,", ",this.props.business.zipCode))),s.a.createElement("div",{className:"Business-reviews"},s.a.createElement("h3",null,this.props.business.category),s.a.createElement("h3",{className:"rating"},this.props.business.rating," stars"),s.a.createElement("p",null,this.props.business.reviewCount," reviews"))))}}]),n}(s.a.Component)),p=(n(15),function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(){return Object(o.a)(this,n),t.apply(this,arguments)}return Object(c.a)(n,[{key:"render",value:function(){return s.a.createElement("div",{className:"BusinessList"},this.props.businesses.map((function(e){return s.a.createElement(d,{business:e,key:e.id})})))}}]),n}(s.a.Component)),m=(n(16),function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(e){var a;return Object(o.a)(this,n),(a=t.call(this,e)).sortByOptions={"Best Match":"best_match","Highest Rated":"rating","Most Reviewed":"review_count"},a.state={term:"",location:"",sortBy:"best_match"},a.handleTermChange=a.handleTermChange.bind(Object(l.a)(a)),a.handleLocationChange=a.handleLocationChange.bind(Object(l.a)(a)),a.handleSearch=a.handleSearch.bind(Object(l.a)(a)),a}return Object(c.a)(n,[{key:"getSortByClass",value:function(e){return this.state.sortBy===e?"active":""}},{key:"handleSortByChange",value:function(e){this.setState({sortBy:e})}},{key:"handleTermChange",value:function(e){this.setState({term:e.target.value})}},{key:"handleLocationChange",value:function(e){this.setState({location:e.target.value})}},{key:"handleSearch",value:function(e){this.props.searchYelp(this.state.term,this.state.location,this.state.sortBy),e.preventDefault()}},{key:"renderSortByOptions",value:function(){var e=this;return Object.keys(this.sortByOptions).map((function(t){var n=e.sortByOptions[t];return s.a.createElement("li",{className:e.getSortByClass(n),key:n,onClick:e.handleSortByChange.bind(e,n)},t)}))}},{key:"render",value:function(){return s.a.createElement("div",{className:"SearchBar"},s.a.createElement("div",{className:"SearchBar-sort-options"},s.a.createElement("ul",null,this.renderSortByOptions())),s.a.createElement("div",{className:"SearchBar-fields"},s.a.createElement("input",{onChange:this.handleTermChange,placeholder:"Search Businesses"}),s.a.createElement("input",{onChange:this.handleLocationChange,placeholder:"Where?"})),s.a.createElement("div",{className:"SearchBar-submit"},s.a.createElement("a",{onClick:this.handleSearch},"Let's Go")))}}]),n}(s.a.Component)),f={search:function(e,t,n){return fetch("https://corsanywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=".concat(e,"&location=").concat(t,"&sort_by=").concat(n),{headers:{Authorization:"Bearer ".concat("sP5eSul4f480F-oNSWCkmvnp2IlDFR-r2j9JJQHGRYFBI9S8im_raIsnlli7eBNxD8PMYoVwue8MQWW48Wlxde5U73ZXceiuKlfaXhjt2sMo7WcC_e-0EX7g-jdVYHYx")}}).then((function(e){return e.json()})).then((function(e){if(e.businesses)return e.businesses.map((function(e){return{id:e.id,imageSrc:e.image_url,name:e.name,address:e.location.address1,city:e.location.city,state:e.location.state,zipCode:e.location.zip_code,category:e.categories[0].title,rating:e.rating,reviewCount:e.review_count,longitude:e.coordinates.longitude,latitude:e.coordinates.latitude}}))}))}},v=(n(17),function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(e){var a;return Object(o.a)(this,n),(a=t.call(this,e)).state={businesses:[]},a.searchYelp=a.searchYelp.bind(Object(l.a)(a)),a}return Object(c.a)(n,[{key:"searchYelp",value:function(e,t,n){var a=this;f.search(e,t,n).then((function(e){a.setState({businesses:e})}))}},{key:"render",value:function(){return s.a.createElement("div",{className:"App"},s.a.createElement("h1",null,"ravenous"),s.a.createElement(m,{searchYelp:this.searchYelp}),s.a.createElement(p,{businesses:this.state.businesses}))}}]),n}(s.a.Component)),b=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function g(e){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var t=e.installing;t.onstatechange=function(){"installed"===t.state&&(navigator.serviceWorker.controller?console.log("New content is available; please refresh."):console.log("Content is cached for offline use."))}}})).catch((function(e){console.error("Error during service worker registration:",e)}))}i.a.render(s.a.createElement(v,null),document.getElementById("root")),function(){if("serviceWorker"in navigator){if(new URL("/ravenous",window.location).origin!==window.location.origin)return;window.addEventListener("load",(function(){var e="".concat("/ravenous","/service-worker.js");b?function(e){fetch(e).then((function(t){404===t.status||-1===t.headers.get("content-type").indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):g(e)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(e):g(e)}))}}()}],[[8,1,2]]]);
//# sourceMappingURL=main.81b0e4f8.chunk.js.map