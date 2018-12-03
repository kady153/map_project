// all location names and their cordinations
var all_locations = [
	{
		name: 'jumaira',
		lat: 25.111156,
		lng: 55.142358
	},
	{
		name: 'Burj Khalifa',
		lat: 25.197152,
		lng: 55.274113
	},
	{
		name: 'burj elarab',
		lat: 25.141025,
		lng: 55.185815
	},
	{
		name: 'Mall of the Emirates',
		lat: 25.119153,
		lng:55.200735
	},
	{
		name: 'Dubai Zoo',
		lat: 25.222809,
		lng: 55.256540
	}
];


function clickmap(){
  document.getElementById("map").style.cursor="grabbing";
}

function mouseUp(){
  document.getElementById("map").style.cursor="grab";
}

// creating new maps
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:25.146032, lng:55.239381},
    zoom: 12
    });


var Location = function(data) {
	var self = this;
	this.name = data.name;
	this.lat = data.lat;
	this.lng = data.lng;

	this.show = ko.observable(true);
	// new markers
	this.marker = new google.maps.Marker({
		position: new google.maps.LatLng(data.lat, data.lng),
		map: map,
		animation: google.maps.Animation.DROP,
		title: data.name
	});

	// requesting data from foursquare
	var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ',' + this.lng + '&client_id=1CCLIWFEF15ND53O2IW2DTIRO0KW1RVZTN4MGXN10BWBAJIP&client_secret=1SV3MVEGDV0BC2KU0IUO43IVX5IYERWPECLRBA3DMNYVWFBV &v=20160118&query=' + this.name;

	$.getJSON(foursquareURL).done(function(data) {
		var results = data.response.venues[0];
		self.street = results.location.formattedAddress[0];
     	self.city = results.location.formattedAddress[1];
	}).fail(square_error);
	//creates new info window
	this.infoWindow = new google.maps.InfoWindow({content: self.info});

	if(this.show() == true) {
		this.showMarker = ko.computed(function(){this.marker.setMap(map);}, this);
	}
	// onclick show window
	this.marker.addListener('click', function(){
		self.info = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city ;

        self.infoWindow.setContent(self.info);
        self.center=map.setCenter(this.getPosition());
		self.infoWindow.open(map, this);
	});
	// activte when user select location from list
	this.show_window = function(place) {
		google.maps.event.trigger(self.marker, 'click');
	};
};


      
function AppViewModel() {
	var self = this;

	this.searchlist = ko.observable("");

	this.locationList = ko.observableArray([]);

	all_locations.forEach(function(locationItem){
		self.locationList.push( new Location(locationItem));
	});

	this.filteredList = ko.computed( function() {
		var filter = self.searchlist().toLowerCase();
		if (!filter) {
			self.locationList().forEach(function(locationItem){
				locationItem.show(true);
			});
			return self.locationList();
		} else {
			return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
				var string = locationItem.name.toLowerCase();
				var result = (string.search(filter) >= 0);
				locationItem.show(result);
				return result;
			});
		}
	}, self);
}

ko.applyBindings(new AppViewModel());
}
// shows error when google maps fail
function showError() {
	alert("Google Maps has failed to load");
}
// shows error when Foursquare fail
function square_error(){
	alert("There was an error with the Foursquare");
}
// the following two functions are for closeing and opening menu
function actives(){
  document.getElementById("sidebar").style.left="0px";

}
function closemenu(){
  document.getElementById("sidebar").style.left="-200px";
  
}