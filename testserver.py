import os
import tornado.httpserver
import tornado.ioloop
import tornado.web

 
class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('./index.html')

def main():
    application = tornado.web.Application([
        (r"/", MainHandler),
        (r'/(.*)', tornado.web.StaticFileHandler, {'path': './'}),
        (r"/image/*.png", tornado.web.StaticFileHandler, {'path':'./image/'}),
    ])
    http_server = tornado.httpserver.HTTPServer(application)
    port = int(os.environ.get("PORT", 8000))
    http_server.listen(port)
    tornado.ioloop.IOLoop.instance().start()
 
if __name__ == "__main__":
    main()