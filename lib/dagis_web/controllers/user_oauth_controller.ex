defmodule DagisWeb.UserOauthController do
  use DagisWeb, :controller

  alias Dagis.Accounts
  alias DagisWeb.UserAuth

  plug Ueberauth
  @rand_pass_length 32

  def callback(%{assigns: %{ueberauth_auth: %{info: user_info}}} = conn, _params) do
    user_params = %{email: user_info.email, password: random_password()}
    case Accounts.fetch_or_create_user(user_params) do
        {:ok, user} ->
          UserAuth.log_in_user(conn, user)
        _ ->
          conn
          |> put_flash(:error, "Authentication failed")
          |> redirect(to: "/occurrences")
      end
  end
  def callback(conn, _params) do
    conn
    |> put_flash(:error, "Authentication failed")
    |> redirect(to: "/occurrences")
  end

  defp random_password do
    :crypto.strong_rand_bytes(@rand_pass_length) |> Base.encode64()
  end

end
