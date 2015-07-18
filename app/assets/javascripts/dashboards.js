$(document).ready(function() {
  google.maps.event.addDomListener(window, 'load', init);
});


function init () {
  markers = [];
  map = googleMap.map();
  googleMap.setInitialLocation();
  searchBox.run();
  googleMap.addClickListener();


}


googleMap = {
  options: {zoom: 13},
  map: function () {
    return new google.maps.Map(document.getElementById("map-canvas"), this.options);
  },
  addClickListener: function () {
    google.maps.event.addListener(map, 'click', function(event) {
      Instagram.getPictures(event.latLng);
      Twitter.getTweets(event.latLng);
    });
  },
  setInitialLocation: function () {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        Instagram.getPictures(latLng);
      },
      function () {
        // some place in Long Island
        var latLng = new google.maps.LatLng(40.8, 73.3);
        Instagram.getPictures(latLng);
      },
      {timeout: 10000}
    );
  },
  addMarkerListener: function (marker, item) {
    google.maps.event.addListener(marker, 'click', function() {
      map.panTo(marker.getPosition());
      $.fancybox({
        content: Fancybox.html(item)
      });
      recentMedia.addListener();
    });
  },
  clearMarkers: function () {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }
}


recentMedia = {
  addListener: function () {
    $('.show-user-recent-media').click(function () {
      $.fancybox.close();
      var id = $(this).data("id");
      Instagram.getUserRecentMedia(id);
      map.setZoom(10);
    });
  }
}


searchBox = {
  input: function () {
    return (document.getElementById('pac-input'));
  },
  run: function () {
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.input());
    var box = new google.maps.places.SearchBox(this.input());
    google.maps.event.addListener(box, 'places_changed', function() {
      var places = box.getPlaces();
      if (places.length == 0) {
        return;
      } else {
        var place = places[0];
        Instagram.getPictures(place.geometry.location);
      }
    });

  }
}


Instagram = {
  getPictures: function (latLng) {
    $.ajax({
      type: "POST",
      url: "dashboards/instagram_search",
      data: this.instaLatLng(latLng),
      dataType: "json",
      success: function (data) {
        socialMap.dropPins(latLng, data);
      }
    });
  },
  instaLatLng: function (googleLatLng) {
    return {latitude: googleLatLng.lat(), longitude: googleLatLng.lng()}
  },
  captionText: function (instagramItem) {
    return instagramItem.caption ? instagramItem.caption.text : "";
  },
  getUserRecentMedia: function (id) {
    $.ajax({
      type: "POST",
      url: "dashboards/user_recent_media",
      data: {id: id},
      dataType: "json",
      success: function (data) {
        googleMap.clearMarkers();
        var location = data[0].location
        var latLng = new google.maps.LatLng(location.latitude, location.longitude);
        socialMap.dropPins(latLng, data);
      }
    });
  }
}


socialMap = {
  createMarker: function (latLng, thumbnail) {
    var images = {
      url: thumbnail,
      scaledSize: new google.maps.Size(50, 50)
    };
    return new google.maps.Marker({
      position: latLng,
      map: map,
      icon: images,
      animation: google.maps.Animation.DROP
    });
  },
  dropPins: function (latLng, data) {
    map.panTo(latLng);
    var self = this;
    $.each(data, function(i, item) {
      var location = new google.maps.LatLng(item.location.latitude, item.location.longitude);
      var thumbnail = item.images.thumbnail.url
      var marker = self.createMarker(location, thumbnail);
      markers.push(marker);
      googleMap.addMarkerListener(marker, item);
    });
  }

}

Twitter = {
  getTweets: function (latLng) {
    $.ajax({
      type: "POST",
      url: "dashboards/twitter_search",
      data: Instagram.instaLatLng(latLng),
      dataType: "json",
      success: function (data) {
        _.each(data, function (tweet) {
          if (tweet.coordinates != null) {
            var infowindow = new google.maps.InfoWindow({
              content: tweet.text
            });

            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]),
              map: map,
            });

            google.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map,marker);
            });
          }
        });
      }
    });
  }
}
