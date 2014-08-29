$(document).ready(function() {

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
        map.setCenter(event.latLng);
        map.setZoom(13);
        $.each(data, function(i, item) {
          var infowindow = new google.maps.InfoWindow({
            content: "<img src=" + item.images.low_resolution.url + ">"
          });
          console.log(item);
          var location = new google.maps.LatLng(item.location.latitude, item.location.longitude);
          var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: "blah"
          });
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map, marker);
          });
        });
      }
    });
  });

});

