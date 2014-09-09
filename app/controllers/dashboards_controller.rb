class DashboardsController < ApplicationController
  def index
  end

  def instagram_search
    @instagrams = Instagram.media_search(params[:latitude],params[:longitude], { distance: 500 })
    respond_to do |format|
      format.json {render :json => @instagrams }
    end
  end

  def instagram_comments
    @comments = Instagram.media_comments(params[:instagram_id])
    respond_to do |format|
      format.json {render :json => @comments }
    end
  end
end
