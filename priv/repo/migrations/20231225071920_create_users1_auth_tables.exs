defmodule Dagis.Repo.Migrations.CreateUsers1AuthTables do
  use Ecto.Migration

  def change do
    execute "CREATE EXTENSION IF NOT EXISTS citext", ""

    create table(:users1) do
      add :email, :citext, null: false
      add :hashed_password, :string, null: false
      add :confirmed_at, :naive_datetime
      timestamps()
    end

    create unique_index(:users1, [:email])

    create table(:users1_tokens) do
      add :user_id, references(:users1, on_delete: :delete_all), null: false
      add :token, :binary, null: false
      add :context, :string, null: false
      add :sent_to, :string
      timestamps(updated_at: false)
    end

    create index(:users1_tokens, [:user_id])
    create unique_index(:users1_tokens, [:context, :token])
  end
end
