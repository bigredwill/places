// var map;

var map;
var currentPosition;
var localStoreObject = "places";

var $input = $("#nameinput");
var $places = $("#placeholder");

$(window).load(initializeMap);


function initializeMap() {

        var mapOptions = {
          center: new google.maps.LatLng(37.3356,-121.8811),
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.TERRAIN,
          streetViewControl: false
        };
       map = new google.maps.Map(document.getElementById("mapholder"),
            mapOptions);
       getLocation();
       displayPlaces();
  }

//add ability for tags
function addPlace(){
  var place = $input.val();
  if(place === "" || place === $input.prop("defaultValue"))
  {
    $input.val($input.prop("defaultValue"));
  } else {
    if(typeof(Storage) !== "undefined") {
      if(!localStorage.places) { 
        localStorage.setItem(localStoreObject,JSON.stringify([])); 
      }

      var storedPlaces = JSON.parse(localStorage.getItem(localStoreObject));
      var newPlace = {"name":place, "latlon":{"latitude":map.getCenter().lat(), "longitude":map.getCenter().lng()}, "tags":""};
      storedPlaces.push(newPlace);
      localStorage.setItem(localStoreObject,JSON.stringify(storedPlaces));
      //add to place list
      $places.prepend(getPlaceElement(newPlace));

    } else {
      $places.val("This only works with local storage enabled on your device.");
    }
  }
}

function removePlace(placeToRemove){
  var storedPlaces = $.parseJSON(localStorage.getItem(localStoreObject));
  for(placeName in storedPlaces)
  {
    if(storedPlaces[placeName].name === placeToRemove)
    {
      delete storedPlaces[placeName];
    }
  }
}

function displayPlaces(){
  $places.empty();
  if(typeof(Storage)!=="undefined") {
    if(localStorage.places) {
      var placesToDisplay = JSON.parse(localStorage.getItem(localStoreObject));
      //reverse order, recent on top
      for (i in placesToDisplay) {
        var node = getPlaceElement(placesToDisplay[i]);
        $places.prepend(node);
        var newPos = new google.maps.LatLng(placesToDisplay[i].latlon.latitude,placesToDisplay[i].latlon.longitude);
        addMarker(newPos);
        }
      }
    }
  }

function addMarker(addPos)
{
  var marker = new google.maps.Marker({
          position: addPos,
          map: map
        });
  return marker;
}
function getPlaceElement(placeObject){
  var node = document.createElement('div');
  node.setAttribute('data-role', 'collapsible');
  console.log(placeObject.latlon);
  node.innerHTML = "<h1>"+placeObject.name +"</h1>" + "<p>" + placeObject.latlon.latitude + " " + placeObject.latlon.longitude+ "</p>";
  return node;
}


function getLocation(){
  if(navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(showPositionOnMap,showError);
  }
  else {
    $places.innerHTML = "GeoLocation is not supported by this browser";
  }
}

function setCurrentPosition (position){
  currentPosition = position;
}

function showPositionOnMap(position) {
  newPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
  setCurrentPosition(newPosition);
  map.setCenter(newPosition);
  map.setZoom(15);
}

function clearLocalStorage() {
  localStorage.clear();
  displayPlaces();
}


function showError(error) {
  switch(error.code)
    {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
    }
  }



//returns a string containing html for a static img from google maps
function getMapImage(latlon)
{
  var img_url = "https://maps.googleapis.com/maps/api/staticmap?zoom=15&size=250x250&sensor=false&maptype=roadmap&markers=color:red|"+latlon;
  return "<img href = '"+"' src= "+img_url+" >";
}


$("#addPlaceButton").click(function(){
  console.log("addPlaceScreen");
  addPlace();
});

$("#addPlace").click(function() {
  console.log("addPlaceButton");
  addPlace();
});

$("#currentLocationButton").click(function() {
  console.log("currentLocationButton");
  getLocation();
});

$("#clearLocalStorage").click(function() {
  console.log("clearingLocalStorage");
  clearLocalStorage();
});

$input.focus(function() {
  console.log("focus in");
  $input.css('color', 'green');
  if($input.val()===this.defaultValue){
    $input.val("");
  }
});

$input.blur(function() {
  console.log("focusout");
  $(this).css({
    color: 'light-grey'
  });
  if($input.val()===""){
    $input.val(this.defaultValue);
  }
});

