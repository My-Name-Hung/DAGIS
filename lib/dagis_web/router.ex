defmodule DagisWeb.Router do
  use DagisWeb, :router

  import DagisWeb.UserAuth



  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {DagisWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_current_user
  end

  pipeline :google do
  plug Plug.Parsers,
      parsers: [:urlencoded],
      pass: ["text/html"]


end

  pipeline :api do
    plug :accepts, ["json"]


  end

  scope "/", DagisWeb do
    pipe_through :browser

    get "/", PageController, :home
    live "/map",MapLive
    live "/bad", BaLive
    live "/tasks", TaskController

  end



  # Other scopes may use custom stacks.
  # scope "/api", DagisWeb do
  #   pipe_through :api
  # end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:dagis, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: DagisWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end




  ## Authentication routes

  scope "/", DagisWeb do
    pipe_through [:browser, :redirect_if_user_is_authenticated]
      get "/auth/:provider", UserOauthController, :request
      get "/auth/:provider/callback", UserOauthController, :callback
    live_session :redirect_if_user_is_authenticated,
      on_mount: [{DagisWeb.UserAuth, :redirect_if_user_is_authenticated}] do
      live "/users1/register", UserRegistrationLive, :new
      live "/users1/log_in", UserLoginLive, :new
      live "/users1/reset_password", UserForgotPasswordLive, :new
      live "/users1/reset_password/:token", UserResetPasswordLive, :edit
    end

    post "/users1/log_in", UserSessionController, :create
  end

  scope "/", DagisWeb do
    pipe_through [:browser, :require_authenticated_user]

    live_session :require_authenticated_user,
      on_mount: [{DagisWeb.UserAuth, :ensure_authenticated}] do
      live "/users1/settings", UserSettingsLive, :edit
      live "/users1/settings/confirm_email/:token", UserSettingsLive, :confirm_email
    end
  end

  scope "/", DagisWeb do
    pipe_through [:browser]

    delete "/users1/log_out", UserSessionController, :delete

    live_session :current_user,
      on_mount: [{DagisWeb.UserAuth, :mount_current_user}] do
      live "/users1/confirm/:token", UserConfirmationLive, :edit
      live "/users1/confirm", UserConfirmationInstructionsLive, :new
    end
  end
end
