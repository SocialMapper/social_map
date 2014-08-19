require 'test_helper'

class DashboardsControllerTest < ActionController::TestCase
  setup do
    @dashboard = dashboards(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:dashboards)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create dashboard" do
    assert_difference('Dashboard.count') do
      post :create, dashboard: { description: @dashboard.description, email: @dashboard.email, first_name: @dashboard.first_name, image: @dashboard.image, last_name: @dashboard.last_name, location: @dashboard.location, name: @dashboard.name, phone: @dashboard.phone, provider: @dashboard.provider, secret: @dashboard.secret, token: @dashboard.token, uid: @dashboard.uid, urls: @dashboard.urls, user_id: @dashboard.user_id }
    end

    assert_redirected_to dashboard_path(assigns(:dashboard))
  end

  test "should show dashboard" do
    get :show, id: @dashboard
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @dashboard
    assert_response :success
  end

  test "should update dashboard" do
    patch :update, id: @dashboard, dashboard: { description: @dashboard.description, email: @dashboard.email, first_name: @dashboard.first_name, image: @dashboard.image, last_name: @dashboard.last_name, location: @dashboard.location, name: @dashboard.name, phone: @dashboard.phone, provider: @dashboard.provider, secret: @dashboard.secret, token: @dashboard.token, uid: @dashboard.uid, urls: @dashboard.urls, user_id: @dashboard.user_id }
    assert_redirected_to dashboard_path(assigns(:dashboard))
  end

  test "should destroy dashboard" do
    assert_difference('Dashboard.count', -1) do
      delete :destroy, id: @dashboard
    end

    assert_redirected_to dashboards_path
  end
end
