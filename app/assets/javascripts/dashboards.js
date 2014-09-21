$(document).ready(function() {
  google.maps.event.addDomListener(window, 'load', init);
});


function init () {
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
    });
  },
  setInitialLocation: function () {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        Instagram.getPictures(latLng);
      },
      function () {
        // some place in Australia
        var latLng = new google.maps.LatLng(-34.397, 150.644);
        Instagram.getPictures(latLng);
      },
      {timeout: 10000}
    );
  },
  addMarkerListener: function (marker, item) {
    google.maps.event.addListener(marker, 'click', function() {
      map.panTo(marker.getPosition());
      $.fancybox({
        content: Fancybox.html(item),
        title: Instagram.captionText(item)
      });
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
  }
}


Fancybox = {
  addComments: function (comments) {
    var result = "";
    $.each(comments, function (i, comment) {
      var html = [
      "<div class='col-md-12'>",
      '<img class="col-md-4" src=',
      comment.from.profile_picture,
      '>',
      '<p class="col-md-8">',
      comment.text,
      '</p>',
      "</div>"].join("\n")
      result += html;
    });
    return result;
  },
  html: function (instagramItem) {
    return ['<div class="col-md-6">',
     '<img class="img-responsive"  src=',
     instagramItem.images.standard_resolution.url,
     '>',
    '</div>',
    '<div class="col-md-6 comments">',
    Instagram.captionText(instagramItem),
    '<br>',
    this.addComments(instagramItem.comments.data),
    '</div>'].join("\n")
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
      googleMap.addMarkerListener(marker, item);
    });
  }
}
