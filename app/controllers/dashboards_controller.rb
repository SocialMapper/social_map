class DashboardsController < ApplicationController
  def index
  end

  def instagram_search
    @instagrams = Instagram.media_search(params[:latitude],params[:longitude], { distance: 500 })
    @instagrams.map! do |instagram|
      if instagram["caption"] && instagram["caption"]["text"]
        instagram["caption"]["text"] = emojify_string(instagram["caption"]["text"])
      end
      instagram
    end
    @instagrams.map! do |instagram|
      instagram["comments"]["data"].map! do |comment|
        comment["text"] = emojify_string(comment["text"])
        comment
      end
      instagram
    end
    respond_to do |format|
      format.json {render :json => @instagrams }
    end
  end

  private

  def emojify_string(string)
    arr = string.split("").map do |e|
      emoji = Emoji.find_by_unicode(e)
      if emoji
        image_path = "images/emoji/#{emoji.image_filename}"
        %(<img alt="#$1" src="#{image_path}" style="vertical-align:middle" width="20" height="20" />)
      else
        e
      end
    end
    arr.join("")
  end

end
