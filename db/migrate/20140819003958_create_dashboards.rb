class CreateDashboards < ActiveRecord::Migration
  def change
    create_table :dashboards do |t|
      t.string :uid
      t.string :provider
      t.integer :user_id
      t.text :name
      t.text :first_name
      t.text :last_name
      t.text :location
      t.text :description
      t.text :urls
      t.text :image
      t.text :phone
      t.text :email
      t.text :token
      t.text :secret

      t.timestamps
    end
  end
end
