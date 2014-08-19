$( document ).ready(function() {
  
	  $.each(gon.instagram_search, function(i, item) {
	  	console.log(item);
	    var html = "<tr><td>" + item.user.full_name + "</td><td>" + "<img src=\"" + item.user.profile_picture + "\"/>" + "</td><td>" + "<img src=\"" + item.images.thumbnail.url + "\"/>" + "</td>" + "<td>" + item.likes.count + "</td><td>" + item.user.username + "</td></tr>";
	    $('.table').append(html);
	});


});