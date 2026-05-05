import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Hide the default menu bar
  win.setMenuBarVisibility(false);

  // In production, load the built React app
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    // In dev, load Vite's dev server (assumes standard setup)
    // fallback if no web server running is to also load the file build
    win.loadFile(path.join(__dirname, '../dist/index.html')).catch(() => {
        win.loadURL('http://localhost:3000');
    });
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
