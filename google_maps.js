var map;

// ==============================================================
//			LOCATOR BUTTON & CURRENT LOCATION FUNCTION
// ==============================================================
// NOTE: 	Locator button code and div tag is located below at tickmark {locator-button}.
//			The div is created located inside the acctual map, so included in the code for 
//			the map construction.

function CenterControl(controlDiv, map) {

	// Set CSS for the locator button.
	var locationUI = document.createElement('div');
	locationUI.style.backgroundColor = 'white';
	locationUI.style.backgroundImage = "url('img/location_icon.png')";
	locationUI.style.backgroundSize = "100% 100%";
	locationUI.style.height = '25px';
	locationUI.style.width = '25px';
	locationUI.style.border = '2px solid #fff';
	locationUI.style.borderRadius = '3px';
	locationUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
	locationUI.style.cursor = 'pointer';
	locationUI.title = 'Locate';
	controlDiv.appendChild(locationUI);

	// Setup the click event listeners. Sets a marker to your current latlng.
	locationUI.addEventListener('click', function() {
		if (navigator.geolocation) {
			
			//Creates a marker variable to be used when the pos is found.
			//The variable is located outside of the .watchPosition function.
			//The .watchPosition function acts like a loop and continues to track the location.
			//If the variable was located inside the function, a new marker would
			//be created each time there was map-refresh (not a page refresh).
			//The map-refresh occurs periodically outside the control of the user.
			var myMarker = new google.maps.Marker({
				map: map,
				title: 'You are here'				
			});
			
			//Finds cordinates, sets location/zoom and adds myMarker.
			//The .watchPosition continues running and tracks movements of the myMarker.
			navigator.geolocation.watchPosition(function(position) {
				var pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				
				map.setCenter(pos);
				map.setZoom(14);
				myMarker.setPosition(pos);
				
				//Function centers/zooms back to myMarker location that has already been created.
				locationUI.addEventListener('click', function() {
					map.setCenter(pos);
					map.setZoom(14);
				});
			},
			
			//Creates and alert if the navigator.gelocation does not run.
			function() {
			  handleLocationError(true, alert, map.getCenter());
			});
			
		} else {
			// Browser doesn't support Geolocation
			handleLocationError(false, alert, map.getCenter());
		}
	});
}





// ==========================================================================
//			MAP CREATOR FUNCTION: Sets markers for coffeeshop locations.
// ==========================================================================
function initMap() {
	//====================  SETS THE MAP  ====================
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 32.335023, lng: -90.176559},//Sneaky Beans
		zoom: 2,
		//Google Style
		styles: [
			{
				featureType: 'all',
				stylers: [
					{ saturation: -80 }
				]
			},
			{
				featureType: 'road.arterial',
				elementType: 'geometry',
				stylers: [
					{ hue: '#00ffee' },
					{ saturation: 50 }
				]
			},
			{
				featureType: 'poi.business',
				elementType: 'labels',
				stylers: [
					{ visibility: 'off' }
				]
			}
		]
	});
	//====================  SETS THE MAP END  ====================
	

	
	//====================  SETS COFFEE SHOP MARKERS  ====================
	// Creating a global infoWindow object that will be reused by all markers
	var infoWindow = new google.maps.InfoWindow();
	
	$.getJSON('json/cs_shops.json', function(JSONdata){
		var coffeeShops = JSONdata;


		// Looping through the coffeeShops data
		for (var i = 0, length = coffeeShops.length; i < length; i++) {
			var data = coffeeShops[i],
				latLng = new google.maps.LatLng(data.lat, data.lng);

			// Creating a marker and putting it on the map
			var marker = new google.maps.Marker({
				position: latLng,
				map: map,
				icon: 'img/location_icon_test.png',
				title: data.title
			});
			
			// Creating a closure to retain the correct data, notice how I pass the current data in the loop into the closure (marker, data)
			(function(marker, data) {

				// Attaching a click event to the current marker
				google.maps.event.addListener(marker, "click", function(e) {
					infoWindow.setContent(
						data.titleAnchor
						+ "<br><br>"
						+ data.address 
						+ "<br>" 
						+ data.directions
					);
					
					infoWindow.open(map, marker);
					document.getElementById("mainBodyTitle").innerHTML = "<h2>" + data.title + "</h2>";
					document.getElementById("homeParagraph").style.display = "none";
					document.getElementById("aboutCoffeeShop").innerHTML = "<p>" + data.aboutTheCS + "</p>";
					document.getElementById("aboutTheArea").innerHTML = "<p><br>" + data.aboutTheArea + "</p>";
				});
			})(marker, data);
		}		
	});
	//====================  SETS COFFEE SHOP MARKERS END ====================
	
	
	
	//{locator-button}
	//====================  SETS LOCATOR BUTTON ====================	
	// Create the DIV to hold the control and call the CenterControl()
	// constructor passing in this DIV.
	var centerControlDiv = document.createElement('div');
	var centerControl = new CenterControl(centerControlDiv, map);

	centerControlDiv.index = 1;
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);
	//====================  SETS LOCATOR BUTTON END ====================
}
	

	
							
 
	
