require 'instagram'
class DashboardsController < ApplicationController
  before_action :set_dashboard, only: [:show, :edit, :update, :destroy]

  def index
    @dashboards = Dashboard.all
    # distance is in meters max is 5000 (3.106856 miles)
    gon.instagram_search = Instagram.media_search("40.7769060","-73.9800650", { :distance => 1000, :count => 10 })
  end

  def instagram_search
    @instagrams = Instagram.media_search(params[:latitude],params[:longitude])
    respond_to do |format|
      format.json {render :json => @instagrams }
    end
  end

  def show
  end

  def new
    @dashboard = Dashboard.new
  end

  def edit
  end

  def create
    @dashboard = Dashboard.new(dashboard_params)

    respond_to do |format|
      if @dashboard.save
        format.html { redirect_to @dashboard, notice: 'Dashboard was successfully created.' }
        format.json { render :show, status: :created, location: @dashboard }
      else
        format.html { render :new }
        format.json { render json: @dashboard.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @dashboard.update(dashboard_params)
        format.html { redirect_to @dashboard, notice: 'Dashboard was successfully updated.' }
        format.json { render :show, status: :ok, location: @dashboard }
      else
        format.html { render :edit }
        format.json { render json: @dashboard.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @dashboard.destroy
    respond_to do |format|
      format.html { redirect_to dashboards_url, notice: 'Dashboard was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  def set_dashboard
    @dashboard = Dashboard.find(params[:id])
  end

  def dashboard_params
    params.require(:dashboard).permit(:uid, :provider, :user_id, :name, :first_name, :last_name, :location, :description, :urls, :image, :phone, :email, :token, :secret)
  end
end
