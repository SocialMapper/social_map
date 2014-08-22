$(document).ready(function() {

  //var handler = Gmaps.build('Google');

  //handler.buildMap({ provider: {zoom: 14}, internal: {id: 'geolocation'} }, function(){
    //if(navigator.geolocation)
      //navigator.geolocation.getCurrentPosition(displayOnMap);
  //});

  //function displayOnMap(position){
    //var marker = handler.addMarker({
      //lat: position.coords.latitude,
      //lng: position.coords.longitude
    //});

    //handler.map.centerOn(marker);

    //google.maps.event.addListener(handler.getMap(), 'click', function(event) {
      //var lat = event.latLng.lat();
      //var lng = event.latLng.lng();
      //$.ajax({
        //type: "POST",
        //url: "dashboards/instagram_search",
        //data: ({latitude: lat, longitude: lng}),
        //dataType: "json",
        //success: function (data) {
          //setCenter(event.latLng)
          //$.each(data, function(i, item) {
            //console.log(item.location.latitude + " " + item.location.longitude + " " + item.user.username);
          //});
        //}
      //});
    //});

  //}; // end displayOnMap()

  var mapOptions = {
    zoom: 11
  };

  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      map.setCenter(initialLocation);
    });
  } else {
    var australia = new google.maps.LatLng(-34.397, 150.644);
    map.setCenter(australia);
  };

  $.each(gon.instagram_search, function(i, item) {
    var location = new google.maps.LatLng(item.location.latitude, item.location.longitude);
    new google.maps.Marker({
      position: location,
      map: map,
      title: "blah"
    });
  });

  google.maps.event.addListener(map, 'click', function(event) {
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    $.ajax({
      type: "POST",
      url: "dashboards/instagram_search",
      data: ({latitude: lat, longitude: lng}),
      dataType: "json",
      success: function (data) {
        map.setCenter(event.latLng)
        $.each(data, function(i, item) {
          console.log(item);
          var location = new google.maps.LatLng(item.location.latitude, item.location.longitude);
          new google.maps.Marker({
            position: location,
            map: map,
            title: "blah"
          });
        });
      }
    });
  });

});

