import { RouterProvider } from "react-router"
import { AppRouter } from "./router/app.router"

export const HeroesApp = () => {
  return (
    <>
    <RouterProvider router={AppRouter} />
    </>
  )
}
