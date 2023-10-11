var map;
var arrMarkers = [];
var arrInfoWindows = [];

function mapInit(){
	var centerCoord = new google.maps.LatLng(37.775199, -81.186440); // WVU Tech beckley 37.776361, -81.186429
	// start Center Map
	function HomeControl(controlDiv, map) {

	  // Set CSS styles for the DIV containing the control
	  // Setting padding to 5 px will offset the control
	  // from the edge of the map.
	  controlDiv.style.padding = '1px';

	  // Set CSS for the control border.
	  var controlUI = document.createElement('div');
	  controlUI.style.backgroundColor = '#4c4d4f';
	  controlUI.style.backgroundColor = '#4c4d4f';
	  controlUI.style.opacity = '0.8';
	  controlUI.style.color = '#f0ede4';
	  controlUI.style.borderStyle = 'solid';
	  controlUI.style.borderWidth = '2px';
	  controlUI.style.cursor = 'pointer';
	  controlUI.style.textAlign = 'center';
	  controlUI.title = 'Reset the map to center';
	  controlDiv.appendChild(controlUI);

	  // Set CSS for the control interior.
	  var controlText = document.createElement('div');
	  controlText.style.fontFamily = 'Helvetica, Arial,sans-serif';
	  controlText.style.fontSize = '0.75em';
	  controlText.style.padding = '0.689em';
	  controlText.innerHTML = 'Center Map';
	  controlUI.appendChild(controlText);

	  // Setup the click event listeners: simply set the map to center of WVU Tech.
	  google.maps.event.addDomListener(controlUI, 'click', function() {
	    map.setCenter(centerCoord);
		map.setZoom(16);
	  });
	} // end Center Map

  var mapOptions = {
		zoom: 16,
		center: centerCoord,
		mapTypeId: google.maps.MapTypeId.ROADMAP,

    styles: [
      {
        featureType: "poi.business",
        elementType: "labels",
        stylers:
        [
          {
            visibility: "off"
          }
        ]
      }
    ]
  };

	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	//start Center Map
	var homeControlDiv = document.createElement('div');
	var homeControl = new HomeControl(homeControlDiv, map);

  homeControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP].push(homeControlDiv);
	// end Center Map

	$.getJSON("https://designsystemv2demo.volutus.wvu.edu/map-data.json", {}, function(data){
			$.each(data.places, function(i, item){
			$("#markers").append('<li><a href="#" rel="' + i + '">' + item.title + '</a></li>');
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(item.lat, item.lng),
				map: map,
				title: item.title
			});
			arrMarkers[i] = marker;
			var infowindow = new google.maps.InfoWindow({
				maxWidth: 300,
				content: "<div id='infoWindow'><h3>"+ item.title +"</h3><p>"+ item.description +"</p></div>"
			});
			arrInfoWindows[i] = infowindow;
			google.maps.event.addListener(marker, 'click', function() {
				//for(x=0; x < infowindow.length; x++){ infowindow[x].close(); }
				for(x=0; x < arrInfoWindows.length; x++){ arrInfoWindows[x].close(); }
				infowindow.open(map, marker);
			});
		});
	});
}

$(function(){
	// initialize map (create markers, infowindows and list)
	mapInit();

	// "live" bind click event
	$(document).on("click", "#markers a", function(){
		var i = $(this).attr("rel");
		// this next line closes all open infowindows before opening the selected one
		for(x=0; x < arrInfoWindows.length; x++){ arrInfoWindows[x].close(); }
		arrInfoWindows[i].open(map, arrMarkers[i]);
	});
});

/* *** begin - KML LAYERS *** */

var staffparkingLayer = new google.maps.KmlLayer('https://admissions.wvutech.edu/public/staffparking-7.kml');
var commuterstudentparkingLayer = new google.maps.KmlLayer('https://admissions.wvutech.edu/public/permitparking-6.kml');
var residentstudentsparkingLayer = new google.maps.KmlLayer('https://admissions.wvutech.edu/public/residentstudentsparking-2.kml');
var visitorsparkingLayer = new google.maps.KmlLayer('https://admissions.wvutech.edu/public/visitorsparking-2.kml');
var hourlyparkingLayer = new google.maps.KmlLayer('https://admissions.wvutech.edu/public/hourlyparking-2.kml');

// Switch loop to toggle layers on and off
function boxclick(box,num) {
  switch (num) {
    case 1:
      if (box.checked) {
        staffparkingLayer.setMap(map);
      } else {
        staffparkingLayer.setMap(null);
      } break;
    case 2:
      if (box.checked) {
        commuterstudentparkingLayer.setMap(map);
      } else {
        commuterstudentparkingLayer.setMap(null);
      } break;
    case 3:
      if (box.checked) {
        residentstudentsparkingLayer.setMap(map);
      } else {
        residentstudentsparkingLayer.setMap(null);
      } break;
    case 4:
      if (box.checked) {
        visitorsparkingLayer.setMap(map);
      } else {
        visitorsparkingLayer.setMap(null);
      } break;
    case 5:
      if (box.checked) {
        hourlyparkingLayer.setMap(map);
      } else {
        hourlyparkingLayer.setMap(null);
      } break;
	}
}
/* *** end - KML Layers *** */
