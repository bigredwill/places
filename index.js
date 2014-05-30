
  //globals
  var $result, defaultValue = "Give your place a name", currentLocation  = null;
  var map;
  function initialize() {
    console.log("initialize");
        var mapOptions = {
          center: new google.maps.LatLng(37.3356,121.8811),
          zoom: 8
        };
        map = new google.maps.Map($('mapholder'),
            mapOptions);
        console.log("fuck");
    }
       google.maps.event.addDomListener(window, 'load', initialize);

  function load()
  {
    $result = $('#places');
    defaultValue = "Give your place a name";
    // getLocation();
    //  initialize();
    displayPlaces();
  }

  function textBoxIn(element){
    if(element.value === element.defaultValue)
    {
      element.value = "";
      element.style.color = "black";
    }
  }

  function textBoxOut(element){
    if(element.value === "")
    {
      element.value = element.defaultValue;
      element.style.color = "grey";
    }
    console.log("blur");
  }



  function clearLocalStorage()
  {
    localStorage.clear();
    displayPlaces();
  }

  function addPlace()
  {
    var place = document.getElementById("input").value;
    if(place===""||place===defaultValue) {
      place = "Enter a name";
    } else {
      if(typeof(Storage)!=="undefined")
      {
        if(!localStorage.locations) { localStorage.setItem("locations",JSON.stringify([])); }
        var locs = JSON.parse(localStorage.getItem("locations"));
        var newObject = {"name":place, "location":currentLocation};
        locs.push(newObject);
        localStorage.setItem("locations",JSON.stringify(locs));
        displayPlaces();

      } else {
        result.innerHTML = "Local storage is a requirement for this to work";
      }
    }

  }

  function displayPlaces()
  {
    result.innerHTML = "";
    if(typeof(Storage)!=="undefined")
    {
      if(localStorage.locations)
      {
        var locations = JSON.parse(localStorage.getItem("locations"));
        for (var i = locations.length - 1; i >= 0; i--) {
          var node = document.createElement('li');
          node.prop('data-role', 'collapsible');
          node.innerHTML = "<h1>"+locations[i].name +"</h1>" + "<p>" + locations[i].location + "</p>";
          result.appendChild(node);
          console.log(locations[i]);
        }
      }
    }
  }

  function getLocation()
  {
    if(navigator.geolocation)
    {
       navigator.geolocation.getCurrentPosition(showPositionOnMap,showError);
    }
    else
    {
      result.innerHTML = "GeoLocation is not supported by this browser";
    }
  }

  function showPositionOnMap(position)
  {

    currentLocation = position; 
    console.log(map);
    map.setLocation(currentLocation.coords.latitude,currentLocation.coords.longitude);
    console.log(map);
  }

  //returns a string containing html for a static img
  function getMapImage(latlon)
  {
    var img_url = "https://maps.googleapis.com/maps/api/staticmap?zoom=15&size=250x250&sensor=false&maptype=roadmap&markers=color:red|"+latlon;
    return "<img href = '"+"' src= "+img_url+" >";
  }


  function showError(error)
    {
    switch(error.code)
      {
      case error.PERMISSION_DENIED:
        document.getElementById("result").innerHTML="User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        document.getElementById("result").innerHTML="Location information is unavailable."
        break;
      case error.TIMEOUT:
        document.getElementById("result").innerHTML="The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
        document.getElementById("result").innerHTML="An unknown error occurred."
        break;
      }
    }


