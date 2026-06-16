#!/usr/bin/env python3
"""Tiny static server for the redesign that sends no-cache headers, so edited
CSS/JS/data always reload (avoids stale-asset confusion during dev/verification).
Usage:  python3 docs/redesign/tools/serve.py [port]   then open http://localhost:8848/site/
"""
import http.server, os, sys, pathlib

os.chdir(str(pathlib.Path(__file__).resolve().parents[1]))  # docs/redesign
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8848

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        super().end_headers()
    def log_message(self, *a): pass

# ThreadingHTTPServer: each request on its own thread so a browser keep-alive
# connection can't stall concurrent loads (the single-threaded server did).
with http.server.ThreadingHTTPServer(("", PORT), Handler) as httpd:
    httpd.daemon_threads = True
    print(f"serving docs/redesign on http://localhost:{PORT}/site/ (no-cache, threaded)")
    httpd.serve_forever()
