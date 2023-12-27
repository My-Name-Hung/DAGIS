# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :dagis,
  ecto_repos: [Dagis.Repo]

# Configures the endpoint
config :dagis, DagisWeb.Endpoint,
  url: [host: "localhost"],
  render_errors: [
    formats: [html: DagisWeb.ErrorHTML, json: DagisWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: Dagis.PubSub,
  live_view: [signing_salt: "TKaUAr8i"]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :dagis, Dagis.Mailer, adapter: Swoosh.Adapters.Local

# Configure esbuild (the version is required)
config :esbuild,
  version: "0.17.11",
  default: [
    args:
      ~w(js/app.js --bundle --target=es2017 --outdir=../priv/static/assets --external:/fonts/* --external:/images/*),
    cd: Path.expand("../assets", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
  ]

# Configure tailwind (the version is required)
config :tailwind,
  version: "3.3.2",
  default: [
    args: ~w(
      --config=tailwind.config.js
      --input=css/app.css
      --output=../priv/static/assets/app.css
    ),
    cd: Path.expand("../assets", __DIR__)
  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Config Auth Google
config :ueberauth, Ueberauth,
  providers: [
    google: {Ueberauth.Strategy.Google, []},
    github: {Ueberauth.Strategy.Github, [default_scope: "user:email"]},
    facebook: {Ueberauth.Strategy.Facebook, []}
  ]

config :ueberauth, Ueberauth.Strategy.Google.OAuth,
  client_id: "519317591544-2v81tnpa3u76nj5rcqiemcv8aqit4682.apps.googleusercontent.com",
  client_secret: "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"

# Config auth github
config :ueberauth, Ueberauth.Strategy.Github.OAuth,
  client_id: "af6121e121d89581993b",
  client_secret: "6048bd2a3d0cd42f04552ebcc5d830a7e0db33a9"

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
