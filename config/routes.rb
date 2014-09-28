Rails.application.routes.draw do
  resources :dashboards
  root 'dashboards#index'
  post "dashboards/instagram_search"
  post "dashboards/user_recent_media"
  post "dashboards/twitter_search"
end
