# Serveur de developpement local - Stever PDF Compress
# Lance un serveur HTTP statique et ouvre l'application dans le navigateur.
# Usage: python serve.py
import http.server
import os
import socketserver
import sys
import threading
import webbrowser

PORT = 8080
os.chdir(os.path.dirname(os.path.abspath(__file__)))


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


with socketserver.TCPServer(("", PORT), QuietHandler) as httpd:
    url = "http://localhost:{PORT}/index.html".format(PORT=PORT)
    if "--no-browser" not in sys.argv:
        threading.Thread(target=lambda: webbrowser.open(url), daemon=True).start()
    print("Stever PDF Compress - serveur local sur {0}".format(url))
    print("Appuyez sur Ctrl+C pour arreter.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nArrete.")