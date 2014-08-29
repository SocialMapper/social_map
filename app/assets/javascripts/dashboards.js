$(document).ready(function() {
  google.maps.event.addDomListener(window, 'load', function() {
    var mapOptions = {
      zoom: 11
    };

    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    var infowindow;

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        getPictures(latLng);
      });
    } else {
      var australia = new google.maps.LatLng(-34.397, 150.644);
      map.setCenter(australia);
    };

    google.maps.event.addListener(map, 'click', function(event) {
      getPictures(event.latLng);
    });

    function getPictures (latLng) {
      $.ajax({
        type: "POST",
        url: "dashboards/instagram_search",
        data: instagramFormattedLatLng(latLng),
        dataType: "json",
        success: function (data) {
          dropPins(latLng, data);
        }
      });
    }

    function instagramFormattedLatLng (latLng) {
      return {latitude: latLng.lat(), longitude: latLng.lng()}
    }
    // helpful to see how the response comes in when necessary
    //console.log(gon.instagram_search);
    function dropPins (latLng, data) {
      map.setCenter(latLng);
      // Resets Zoom Everytime new pins were dropped
      // map.setZoom(13);
      $.each(data, function(i, item) {
        var location = new google.maps.LatLng(item.location.latitude, item.location.longitude);
        var marker = createMarker(location);
        addMarkerListener(marker, item);
      });
    }

    function addMarkerListener (marker, item) {
      google.maps.event.addListener(marker, 'click', function() {
        // slighty nicer way to pan picture to picture
        map.panTo(marker.getPosition());
        // will add in fancybox here

        if (infowindow) { infowindow.close() };
        infowindow = new google.maps.InfoWindow({
          content: "<img src=" + item.images.standard_resolution.url + ">",
          //offsets info window -- will replace with modal box
          pixelOffset: new google.maps.Size(-300, 400)
        });
        infowindow.open(map, marker);
      });
    }



    function createMarker (latLng) {
      // just playing around with google provided icons
      var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
      return new google.maps.Marker({
        position: latLng,
        map: map,
        icon: iconBase + 'schools_maps.png'
      });
    }

  });
});

