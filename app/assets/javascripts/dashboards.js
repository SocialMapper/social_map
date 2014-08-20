$( document ).ready(function() {

  var handler = Gmaps.build('Google');

  handler.buildMap({ provider: {zoom: 14}, internal: {id: 'geolocation'} }, function(){
    if(navigator.geolocation)
      navigator.geolocation.getCurrentPosition(displayOnMap);
  });

  function displayOnMap(position){
    var marker = handler.addMarker({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });

    handler.map.centerOn(marker);

    google.maps.event.addListener(handler.getMap(), 'click', function(event) {
      var lat = event.latLng.lat();
      var lng = event.latLng.lng();
      $.ajax({
        type: "POST",
        url: "dashboards/instagram_search",
        data: ({latitude: lat, longitude: lng}),
        dataType: "json",
        success: function (data) {
          $.each(data, function(i, item) {
            console.log(item.location.latitude + " " + item.location.longitude + " " + item.user.username);
          });
        }
      });
    });
  }; // end displayOnMap()

  $.each(gon.instagram_search, function(i, item) {
      console.log(item);
      var html = "<tr><td>" + item.user.full_name + "</td><td>" + "<img src=\"" + item.user.profile_picture + "\"/>" + "</td><td>" + "<img src=\"" + item.images.thumbnail.url + "\"/>" + "</td>" + "<td>" + item.likes.count + "</td><td>" + item.user.username + "</td></tr>";
      $('.table').append(html);
  });

});
