#--
# Copyrights apply to this code. It may not be used to create training material,
# courses, books, articles, and the like
#--
defmodule DagisWeb.MapLive do
  use DagisWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end
end

