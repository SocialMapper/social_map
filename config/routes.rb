Rails.application.routes.draw do
  resources :dashboards
  root 'dashboards#index'
  post "dashboards/instagram_search"
end
