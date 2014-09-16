class DashboardsController < ApplicationController
  def index
  end

  def instagram_search
    @instagrams = Instagram.media_search(params[:latitude],params[:longitude], { distance: 500 })
    @instagrams.map! do |instagram|
      instagram["caption"]["text"] = emojify_string(instagram["caption"]["text"])
      instagram
    end
    respond_to do |format|
      format.json {render :json => @instagrams }
    end
  end

  private

  def emojify_string(content)
    content.gsub(/<U\+([\w+-]+)>/) do |str|
      unicode = UnicodeHelper.to_unicode(str)
      emoji = Emoji.find_by_unicode(unicode)
      image_path = Rails.root.join("public", "assets", "emoji", emoji.image_filename)
      %(<img alt="#$1" src="#{image_path}" style="vertical-align:middle" width="20" height="20" />)
    end
  end
end
