window.Fancybox =
  addComments: (comments) ->
    result = ""
    $.each comments, (i, comment) ->
      html = ""
      html += "<div class='col-md-12'>"
      html +=   "<img class=\"col-md-4\" src=#{comment.from.profile_picture}>"
      html +=   "<p class=\"col-md-8\">#{comment.text}</p>"
      html += "</div>"
      result += html
    result

  html: (instagramItem) ->
    result = ""
    result += "<div class=\"col-md-6\">"
    result +=   "<img class=\"img-responsive\" src=#{instagramItem.images.standard_resolution.url}>"
    result += "</div>"
    result += "<div class=\"col-md-6 comments\">#{Instagram.captionText(instagramItem)}"
    result +=   "<br>"
    result +=   @addComments(instagramItem.comments.data)
    result += "<div>"
    result
