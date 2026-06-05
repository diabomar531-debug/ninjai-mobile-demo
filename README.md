# ninjai-extension-demo

Interactive browser-extension prototype for Ninjai, a universal AI wallet and smart routing layer for using AI anywhere in the browser.

## Run locally

```powershell
npm install
npm run dev
```

Then open `http://127.0.0.1:5173/`.

## Build Chrome Extension

```powershell
npm run build
```

The unpacked Chrome extension is emitted to `dist`.

## Load In Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select the `dist` folder from this project.
5. Open any normal webpage, highlight text, and click the floating **Ask Ninjai** pill.
