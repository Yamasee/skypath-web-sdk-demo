# SkyPath Web SDK Demo

A React app that shows the [SkyPath Web SDK](https://www.npmjs.com/package/@skypath-io/web-sdk) on a map: turbulence observations, forecast, OneLayer and ADS-B data, with the altitude, severity and time filters a real client would have.

|                   |                                                                          |
| ----------------- | ------------------------------------------------------------------------ |
| **Live demo**     | [yamasee.github.io/skypath-web-sdk-demo](https://yamasee.github.io/skypath-web-sdk-demo/) |
| **SDK docs**      | [docs.skypath.io/js](https://docs.skypath.io/js/introduction)            |
| **About the demo**| [docs.skypath.io/js/demo-app](https://docs.skypath.io/js/demo-app)       |
| **Node**          | `>= 22.14.0` (see `.nvmrc`)                                              |

## Run it locally

```bash
git clone https://github.com/Yamasee/skypath-web-sdk-demo.git
cd skypath-web-sdk-demo
nvm use
npm install
npm run dev
```

Open [localhost:5173/skypath-web-sdk-demo/](http://localhost:5173/skypath-web-sdk-demo/) and sign in with one of:

- **API key** — your SkyPath API key, a user ID and your company name;
- **Signed JWT** — a JWT signed by your server and your partner ID.

> [!NOTE]
> No SkyPath credentials yet? [Contact us](https://skypath.io/contact/).

## Where to look

| What                                  | File                                                 |
| ------------------------------------- | ---------------------------------------------------- |
| Creating the SDK and signing in       | `src/AuthWrapper.jsx`                                |
| Flow lifecycle and listeners          | `src/hooks/hexagons/useHexagonsFlow.js`              |
| One hook per flow                     | `src/hooks/{observations,forecast,oneLayer,adsb}/`   |
| Which flows run, and turning them on and off | `src/hooks/general/useMapLayers.js`          |
| Map polygon from the viewport         | `src/components/organisms/MapView.jsx`               |
| SDK constants used by the controls    | `src/config.js`                                      |

Each flow is created when its hook mounts and terminated when it unmounts. OneLayer already includes observations, so the demo runs OneLayer when it is available for your account and Observations otherwise.

## Scripts

| Command           | What it does                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Dev server with hot reload                |
| `npm run build`   | Production build into `dist/`             |
| `npm run preview` | Serves the production build               |
| `npm run lint`    | ESLint                                    |

Pull requests run lint and the build. Every push to `master` deploys the live demo to GitHub Pages.

## Stack

React, Vite, [deck.gl](https://deck.gl) over [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) through `react-map-gl`, Tailwind CSS, Radix UI and zod.
