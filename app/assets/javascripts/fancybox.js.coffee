window.Fancybox =
  addComments: (comments) ->
    result = ""
    $.each comments, (i, comment) ->
      html = ""
      html += "<div class='col-md-12 comment-row'>"
      html +=   "<img class=\"col-md-4 commenter-image\" src=#{comment.from.profile_picture}>"
      html +=   "<p class=\"col-md-8\">@#{comment.from.username}: #{comment.text}</p>"
      html += "</div>"
      result += html
    result

  html: (instagramItem) ->
    username = instagramItem.user.username
    result = ""
    result += "<div class=\"col-md-6\">"
    result +=   "<img class=\"img-responsive\" src=#{instagramItem.images.standard_resolution.url}>"
    result += "</div>"
    result += "<div class=\"col-md-6 comments\">"
    result +=   "<p class=\"show-user-recent-media\" data-id=#{instagramItem.user.id}>Click here to see @#{username}'s recent pictures on a map"
    result +=   "<p>@#{username}: #{Instagram.captionText(instagramItem)}</p>"
    result +=   "<br><br>"
    result +=   @addComments(instagramItem.comments.data)
    result += "<div>"
    result
