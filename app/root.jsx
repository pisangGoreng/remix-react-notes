import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react"
import styles from "~/styles/main.css"
import MainNavigation from "~/components/MainNavigation"

export const meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
})

// * Add global css
export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

// * FOR DISPLAY THE ERROR MESSAGE ON BROWSER
// * ONLY SHOW THE ERROR & REMOVE THE Outlet
export function ErrorBoundary({ error }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>An error occurred!</title>
      </head>
      <body>
        <header>
          <MainNavigation />
        </header>

        <main className="error">
          <h1>An error occurred!</h1>
          <p>{error.message}</p>
          <p>
            Back to <Link to="/">safety</Link>
          </p>
        </main>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export function CatchBoundary() {
  // * catch a error from throw json (remix)
  const coughtResponse = useCatch()

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>{coughtResponse.statusText}</title>
      </head>
      <body>
        <header>
          <MainNavigation />
        </header>

        <main className="error">
          <h1>{coughtResponse.statusText}</h1>
          <p>{coughtResponse.data?.message || "someting went wrong"}</p>
          <p>
            Back to <Link to="/">safety</Link>
          </p>
        </main>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {/* ADD CUSTOM MAIN NAVIGATION FOR EVERY PAGE */}
        <header>
          <MainNavigation />
        </header>

        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
