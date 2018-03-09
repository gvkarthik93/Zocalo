import os
import tornado.httpserver
import tornado.ioloop
import tornado.web
import json
import tornado.escape
from temp_data import tempData

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('./index.html')

class LoginHandler(tornado.web.RequestHandler):
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        print (data)
        print (self.request.getall())
        response = tempData()
        self.write(json.dumps(response))

class SignupHandler(tornado.web.RequestHandler):
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        response = tempData()
        self.write(json.dumps(response))

class GetPostContent(tornado.web.RequestHandler):
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        response = tempData()
        self.write(json.dumps(response))

def main():
    application = tornado.web.Application([
        (r"/", MainHandler),
        (r"/login", LoginHandler),
        (r"/sign_up", SignupHandler),
        (r'/(.*)', tornado.web.StaticFileHandler, {'path': './'}),
        (r"/image/*.png", tornado.web.StaticFileHandler, {'path':'./image/'}),
    ])
    http_server = tornado.httpserver.HTTPServer(application)
    port = int(os.environ.get("PORT", 8002))
    http_server.listen(port)
    tornado.ioloop.IOLoop.instance().start()
 
if __name__ == "__main__":
    main()