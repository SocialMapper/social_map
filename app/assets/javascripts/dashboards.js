$(document).ready(function() {
  google.maps.event.addDomListener(window, 'load', function() {
    googleMap = {
      options: {zoom: 13},
      map: function () {
        return new google.maps.Map(document.getElementById("map-canvas"), this.options);
      }
    }

    map = googleMap.map();

    var markers = [];


    //var input = (document.getElementById('pac-input'));
      //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    //var searchBox = new google.maps.places.SearchBox(
    //[>* @type {HTMLInputElement} <](input));

    //google.maps.event.addListener(searchBox, 'places_changed', function() {
      //var places = searchBox.getPlaces();

      //if (places.length == 0) {
        //return;
      //}
      //for (var i = 0, marker; marker = markers[i]; i++) {
        //marker.setMap(null);
      //}

      //markers = [];
      //var bounds = new google.maps.LatLngBounds();
      //for (var i = 0, place; place = places[i]; i++) {
        //var image = {
          //url: place.icon,
          //size: new google.maps.Size(0, 0)
        //};
        //var marker = new google.maps.Marker({
          //map: map,
          //icon: image,
          //position: place.geometry.location
        //});
        //markers.push(marker);
        //bounds.extend(place.geometry.location);
      //}
      //map.fitBounds(bounds);
      //map.setZoom(13);
      //getPictures(marker.position);
    //});

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

    function getComments (instagramId) {
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
        addMarkerListener(marker, item);
      });
    }

    function addMarkerListener (marker, item) {
      google.maps.event.addListener(marker, 'click', function() {
        map.panTo(marker.getPosition());
        $.fancybox({
          content: fancyboxContent(item),
          title: captionText(item)
        });
        getComments(item.id);
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
});
