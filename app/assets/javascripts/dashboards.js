$(document).ready(function() {

  // google maps stuff
  var googleMap = {
    options: {zoom: 13},
    map: function () {
      return new google.maps.Map(document.getElementById("map-canvas"), this.options);
    },
    clickListener: function () {
      google.maps.event.addListener(map, 'click', function(event) {
        getPictures(event.latLng);
      });
    },
    setInitialLocation: function () {
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          getPictures(latLng);
        });
      } else {
        var australia = new google.maps.LatLng(-34.397, 150.644);
        map.setCenter(australia);
      };
    },
    addMarkerListener: function (marker, item) {
      google.maps.event.addListener(marker, 'click', function() {
        map.panTo(marker.getPosition());
        $.fancybox({
          content: fancyboxContent(item),
          title: captionText(item)
        });
        Instagram.getComments(item.id);
      });
    }
  }

  var map = googleMap.map();
  googleMap.clickListener();
  googleMap.setInitialLocation();


  // google maps search box
  var googleSearch = {
    input: (document.getElementById('pac-input')),
    controls: function () {
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    },
    searchBox: function () {
      return new google.maps.places.SearchBox((this.input));
    },
    addListener: function () {
      google.maps.event.addListener(this.searchBox, 'places_changed', function() {
        var places = this.searchBox.getPlaces();
        var place = places[0];
        getPictures(place.geometry.location);
      });
    }
  }

  var input = googleSearch.input;
  googleSearch.controls();
  var searchBox = googleSearch.searchBox();
  googleSearch.addListener();


  // instagram related stuff
  var Instagram = {
    getComments: function (instagramId) {
      $.ajax({
        type: "POST",
        url: "dashboards/instagram_comments",
        data: {instagram_id: instagramId},
        dataType: "json",
        success: function (data) {
          addCommentsToFancybox(data);
        }
      });
    }
  }

  function addCommentsToFancybox (comments) {
    var div = $(".comments");
    $.each(comments, function (i, comment) {
      div.append("<p>" + comment.text + "</p>");
    });
  }

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

  function dropPins (latLng, data) {
    map.setCenter(latLng);

    $.each(data, function(i, item) {
      var location = new google.maps.LatLng(item.location.latitude, item.location.longitude);
      var thumbnail = item.images.thumbnail.url
      var marker = createMarker(location, thumbnail);
      googleMap.addMarkerListener(marker, item);
    });
  }

  function fancyboxContent (instagramItem) {
    return ['<div class="col-md-6">',
     '<img class="img-responsive"  src=',
     instagramItem.images.standard_resolution.url,
     '>',
    '</div>',
    '<div class="col-md-6 comments">',
    captionText(instagramItem),
    '<br>',
    '<strong>Comments</strong>',
    '</div>'].join("\n")
  }

  function captionText (instagramItem) {
    return instagramItem.caption ? instagramItem.caption.text : ""
  }

  function createMarker (latLng, thumbnail) {
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
  }

});
