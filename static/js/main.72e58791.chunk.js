(this.webpackJsonprestaurant=this.webpackJsonprestaurant||[]).push([[0],{30:function(e,t,s){},38:function(e,t,s){e.exports=s(57)},46:function(e,t,s){},47:function(e,t,s){},53:function(e,t,s){},54:function(e,t,s){},55:function(e,t,s){},57:function(e,t,s){"use strict";s.r(t);var n=s(0),a=s.n(n),o=s(32),r=s.n(o),i=(s(46),s(71));s(47);class c extends a.a.Component{constructor(){super(),this.state={link:""}}componentDidMount(){const{address:e,city:t,state:s,zipCode:n,name:a}=this.props.business;this.getPlaceID(e,t,s,n,a).then(e=>this.setState({link:e}))}getPlaceID(e,t,s,n,a){const o="".concat(e,", ").concat(t,", ").concat(s," ").concat(n),r=encodeURIComponent("".concat(a," ").concat(o)),i="https://www.google.com/maps/search/?api=1&query=".concat(r);return Promise.resolve(i)}render(){return a.a.createElement("div",{className:"Business"},a.a.createElement("div",{className:"image-container"},a.a.createElement("img",{src:this.props.business.imageSrc,alt:this.props.business.name})),a.a.createElement("h2",null,this.props.business.name),a.a.createElement("div",{className:"Business-information"},a.a.createElement("div",{className:"Business-address"},a.a.createElement(i.a,{underline:"none",href:this.state.link,target:"_blank",rel:"noopener noreferrer"},a.a.createElement("p",null,this.props.business.address),a.a.createElement("p",null,this.props.business.city),a.a.createElement("p",null,this.props.business.state,", ",this.props.business.zipCode))),a.a.createElement("div",{className:"Business-reviews"},a.a.createElement("h3",null,this.props.business.category),a.a.createElement("h3",{className:"rating"},this.props.business.rating," stars"),a.a.createElement("p",null,this.props.business.reviewCount," reviews"))))}}var l=c;s(53),s(30);class h extends a.a.Component{render(){return a.a.createElement("div",{className:"BusinessList"},this.props.isLoading?a.a.createElement("div",{className:"LoadingBar"}):this.props.searchPerformed?0===this.props.businesses.length?a.a.createElement("div",{className:"BusinessList-empty"},a.a.createElement("p",null,"No businesses found. Please try another search.")):this.props.businesses.map(e=>a.a.createElement(l,{business:e,key:e.id})):a.a.createElement("div",{className:"BusinessList-empty"},a.a.createElement("p",null,"Please enter a type of food and location to get recommendations.")))}}var d=h;s(54);class u extends a.a.Component{constructor(e){super(e),this.sortByOptions={"Best Match":"best_match","Highest Rated":"rating","Most Reviewed":"review_count"},this.getUserLocation=()=>{navigator.geolocation?navigator.geolocation.getCurrentPosition(e=>{const{latitude:t,longitude:s}=e.coords;this.reverseGeocode(t,s)},e=>{console.error("Error getting user location:",e)}):console.error("Geolocation is not supported by this browser.")},this.reverseGeocode=(e,t)=>{const s="https://maps.googleapis.com/maps/api/geocode/json?latlng=".concat(e,",").concat(t,"&key=").concat("AIzaSyAFjagYUP76eJQmoDDGze9TtHboIBpY_0s");fetch(s).then(e=>e.json()).then(e=>{if(e.results&&e.results.length>0){const t=e.results[0].address_components.find(e=>e.types.includes("postal_code"));t&&this.setState({location:t.long_name})}}).catch(e=>console.error("Error reverse geocoding:",e))},this.state={term:"",location:"",sortBy:"best_match"},this.handleTermChange=this.handleTermChange.bind(this),this.handleLocationChange=this.handleLocationChange.bind(this),this.handleSearch=this.handleSearch.bind(this)}getSortByClass(e){return this.state.sortBy===e?"active":""}handleSortByChange(e){this.setState({sortBy:e},()=>{this.handleSearch()})}handleTermChange(e){this.setState({term:e.target.value})}handleLocationChange(e){this.setState({location:e.target.value})}handleSearch(e){e&&e.preventDefault(),this.state.term&&this.state.location&&this.props.searchYelp(this.state.term,this.state.location,this.state.sortBy)}renderSortByOptions(){return Object.keys(this.sortByOptions).map(e=>{let t=this.sortByOptions[e];return a.a.createElement("li",{className:this.getSortByClass(t),key:t,onClick:this.handleSortByChange.bind(this,t)},e)})}render(){return a.a.createElement("div",{className:"SearchBar"},a.a.createElement("div",{className:"SearchBar-sort-options"},a.a.createElement("ul",null,this.renderSortByOptions())),a.a.createElement("div",{className:"SearchBar-fields"},a.a.createElement("input",{onChange:this.handleTermChange,placeholder:"Search Businesses"}),a.a.createElement("input",{onChange:this.handleLocationChange,placeholder:"Where?",value:this.state.location}),a.a.createElement("button",{onClick:this.getUserLocation},"Use My Location")),a.a.createElement("div",{className:"SearchBar-submit"},a.a.createElement(i.a,{underline:"none",onClick:this.handleSearch},"Let's Go")))}}var m=u;var p={search:(e,t,s)=>fetch("https://morning-stream-08762.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=".concat(e,"&location=").concat(t,"&sort_by=").concat(s,"&limit=48"),{headers:{Authorization:"Bearer ".concat("sP5eSul4f480F-oNSWCkmvnp2IlDFR-r2j9JJQHGRYFBI9S8im_raIsnlli7eBNxD8PMYoVwue8MQWW48Wlxde5U73ZXceiuKlfaXhjt2sMo7WcC_e-0EX7g-jdVYHYx")}}).then(e=>e.json()).then(e=>{if(e.businesses)return e.businesses.map(e=>({id:e.id,imageSrc:e.image_url,name:e.name,address:e.location.address1,city:e.location.city,state:e.location.state,zipCode:e.location.zip_code,category:e.categories[0].title,rating:e.rating,reviewCount:e.review_count,longitude:e.coordinates.longitude,latitude:e.coordinates.latitude}))})};s(55);class g extends a.a.Component{constructor(e){super(e),this.state={businesses:[],searchPerformed:!1,isLoading:!1},this.searchYelp=this.searchYelp.bind(this)}searchYelp(e,t,s){this.setState({isLoading:!0}),p.search(e,t,s).then(e=>{this.setState({businesses:e,searchPerformed:!0,isLoading:!1})})}render(){return a.a.createElement("div",{className:"App"},a.a.createElement("h1",null,"ravenous"),a.a.createElement(m,{searchYelp:this.searchYelp}),a.a.createElement(d,{businesses:this.state.businesses,searchPerformed:this.state.searchPerformed,isLoading:this.state.isLoading}))}}var v=g;const f=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function E(e){navigator.serviceWorker.register(e).then(e=>{e.onupdatefound=()=>{const t=e.installing;t.onstatechange=()=>{"installed"===t.state&&(navigator.serviceWorker.controller?console.log("New content is available; please refresh."):console.log("Content is cached for offline use."))}}}).catch(e=>{console.error("Error during service worker registration:",e)})}r.a.render(a.a.createElement(v,null),document.getElementById("root")),function(){if("serviceWorker"in navigator){if(new URL("/ravenous",window.location).origin!==window.location.origin)return;window.addEventListener("load",()=>{const e="".concat("/ravenous","/service-worker.js");f?function(e){fetch(e).then(t=>{404===t.status||-1===t.headers.get("content-type").indexOf("javascript")?navigator.serviceWorker.ready.then(e=>{e.unregister().then(()=>{window.location.reload()})}):E(e)}).catch(()=>{console.log("No internet connection found. App is running in offline mode.")})}(e):E(e)})}}()}},[[38,1,2]]]);
//# sourceMappingURL=main.72e58791.chunk.js.map