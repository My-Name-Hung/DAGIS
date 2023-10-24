defmodule Dagis.Repo do
  use Ecto.Repo,
    otp_app: :dagis,
    adapter: Ecto.Adapters.Postgres
end
