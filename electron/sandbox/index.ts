import { BrowserWindow } from 'electron'

export async function setupSecureSandbox(window: BrowserWindow): Promise<void> {
  // Set up Content Security Policy
  window.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
          "style-src 'self' 'unsafe-inline'; " +
          "img-src 'self' data: https:; " +
          "font-src 'self' data:; " +
          "connect-src 'self' https: wss:;"
        ]
      }
    })
  })

  // Disable navigation to external URLs
  window.webContents.on('will-navigate', (event) => {
    event.preventDefault()
  })

  // Disable new window creation
  window.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' }
  })
}
