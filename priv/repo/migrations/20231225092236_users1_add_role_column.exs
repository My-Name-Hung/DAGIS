defmodule Dagis.Repo.Migrations.Users1AddRoleColumn do
  use Ecto.Migration

  def change do
    alter table("users1") do
      add :role, :text
    end
  end
end
