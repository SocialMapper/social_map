class DashboardsController < ApplicationController
  def index
  end

  def instagram_search
    @instagrams = Instagram.media_search(params[:latitude],params[:longitude], { distance: 2500 })
    respond_to do |format|
      format.json {render :json => @instagrams }
    end
  end
end
