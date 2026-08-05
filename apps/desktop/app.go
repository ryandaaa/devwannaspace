package main

import (
	"context"
	"fmt"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx context.Context
	mu  sync.Mutex
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// StartExternalLogin starts a temporary local HTTP loopback server on port 34567
// and opens the system's default web browser to the provided Clerk login URL.
// When Clerk redirects back to http://localhost:34567/callback,
// Go intercepts the URL parameters, closes the temporary server, displays a success page,
// and returns the query string back to React.
func (a *App) StartExternalLogin(clerkSignInUrl string) (string, error) {
	listener, err := net.Listen("tcp", "127.0.0.1:34567")
	if err != nil {
		return "", fmt.Errorf("gagal membuka server loopback lokal di port 34567: %v", err)
	}

	resultChan := make(chan string, 1)
	errChan := make(chan error, 1)

	server := &http.Server{
		Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.URL.Path == "/callback" || r.URL.Path == "/" {
				w.Header().Set("Content-Type", "text/html; charset=utf-8")
				fmt.Fprint(w, `
					<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="utf-8">
						<title>Authenticated - devwannaspace</title>
						<style>
							body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #0c0c0f; color: #ededef; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
							.container { text-align: center; max-width: 360px; padding: 32px 28px; background: #14141a; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.5); }
							h1 { font-size: 17px; font-weight: 600; color: #ededef; margin: 0 0 6px 0; letter-spacing: -0.3px; }
							p { color: #8a8f98; font-size: 13px; line-height: 1.5; margin: 0; }
						</style>
					</head>
					<body>
						<div class="container">
							<h1>Authenticated</h1>
							<p>You can close this tab and return to devwannaspace.</p>
						</div>
						<script>
							setTimeout(function() {
								window.close();
							}, 1200);
						</script>
					</body>
					</html>
				`)
				resultChan <- r.URL.RawQuery
			} else {
				http.NotFound(w, r)
			}
		}),
	}

	go func() {
		if err := server.Serve(listener); err != nil && err != http.ErrServerClosed {
			errChan <- err
		}
	}()

	// Buka browser eksternal bawaan OS
	runtime.BrowserOpenURL(a.ctx, clerkSignInUrl)

	// Tunggu balasan callback atau batas timeout 5 menit
	select {
	case res := <-resultChan:
		runtime.WindowShow(a.ctx)
		runtime.WindowUnminimise(a.ctx)
		go func() {
			time.Sleep(500 * time.Millisecond)
			server.Shutdown(context.Background())
		}()
		return res, nil
	case err := <-errChan:
		return "", err
	case <-time.After(5 * time.Minute):
		server.Shutdown(context.Background())
		return "", fmt.Errorf("waktu proses login habis (timeout 5 menit)")
	}
}

// getSessionFilePath returns the persistent path to store auth session data
func (a *App) getSessionFilePath() (string, error) {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	dir := filepath.Join(configDir, "devwannaspace")
	if err := os.MkdirAll(dir, 0700); err != nil {
		return "", err
	}
	return filepath.Join(dir, "auth_session.json"), nil
}

// SaveSession saves the raw auth query string persistently and atomically on disk
func (a *App) SaveSession(sessionData string) error {
	a.mu.Lock()
	defer a.mu.Unlock()
	filePath, err := a.getSessionFilePath()
	if err != nil {
		return err
	}
	tmpPath := filePath + ".tmp"
	if err := os.WriteFile(tmpPath, []byte(sessionData), 0600); err != nil {
		return err
	}
	return os.Rename(tmpPath, filePath)
}

// GetSession reads the saved auth query string from disk
func (a *App) GetSession() (string, error) {
	a.mu.Lock()
	defer a.mu.Unlock()
	filePath, err := a.getSessionFilePath()
	if err != nil {
		return "", err
	}
	data, err := os.ReadFile(filePath)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

// ClearSession deletes the saved auth query string from disk
func (a *App) ClearSession() error {
	a.mu.Lock()
	defer a.mu.Unlock()
	filePath, err := a.getSessionFilePath()
	if err != nil {
		return err
	}
	tmpPath := filePath + ".tmp"
	_ = os.Remove(tmpPath)
	if err := os.Remove(filePath); err != nil && !os.IsNotExist(err) {
		return err
	}
	return nil
}


