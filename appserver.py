from http.server import HTTPServer, BaseHTTPRequestHandler
import socketserver
import os
import http.server
from os import curdir, sep
import mimetypes
import cgi
import threading
import sqlite3
import json

PORT = int(os.environ.get('PORT', 8080))

class myHandler(BaseHTTPRequestHandler):
    #Handler for GET requests
    def do_GET(self):
        if self.path=="/":
            self.path="/index.html"

        if self.path=="/index":
            self.path="/index.html"

        try:
            #Open the static file requested and send it
            #Check the file extension required
            #Set the right mime type
            #rb is used to read all the mime types and display them
            f = open(curdir + sep + self.path, 'rb')
            mimetype, _ = mimetypes.guess_type(self.path)
            try:
                self.send_response(200)
                self.send_header('Content-type',mimetype)
                self.end_headers()
                self.wfile.write(f.read())
                f.close()
            except:
                print ("Connection Aborted: Established connection has been dropped")
            return
        except IOError:
            self.send_error(404,'File Not Found: %s' % self.path)

    def do_POST(self):
        if self.path == "/login":
            # Logic
            dataVariable = self.headers['Content-Length']
            #dataVariable contains the length of the variable provided in the string format
            dataVar = int(dataVariable)
            user_input = self.rfile.read(dataVar).decode().strip()
            print ("user input: ", user_input)

            if True:
                validation_response = {"User_Detail":"Valid"}
                validation_response = json.dumps(validation_response)
                print ("Valid User")
                self.send_response(200)
                self.send_header("Content-type", "text/plain")
                self.send_header("Access-Control-Allow-Origin", "localhost:3000")
                self.end_headers()
                self.flush_headers()
                self.wfile.write(validation_response.encode("utf-8"))
            else:
                print ("Invalid User")

        if self.path == "/post_question":
            # Logic
            print ("post question")

        if self.path == "/update":
            # Logic
            print ("Update Post")

        if self.path == "/delete":
            # Logic
            print ("Delete Post")


class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    pass

try:
    server = ThreadedTCPServer(('', PORT), myHandler)
    print ('Started httpserver on port ' , PORT)
    server.allow_reuse_address = True
    server.serve_forever()

except KeyboardInterrupt:
    print ('CTRL + C RECEIVED - Shutting down the REST server')
    server.socket.close()
