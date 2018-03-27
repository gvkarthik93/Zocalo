import os
import tornado.httpserver
import tornado.ioloop
import tornado.web
import json
import tornado.escape
from temp_data import tempData

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        print ("Main")
        self.render('./index.html')

# Handle the login requests
class LoginHandler(tornado.web.RequestHandler):
    def post(self, p1=None, p2=None):
        data = tornado.escape.json_decode(self.request.body)
        print (data)
        print ("param: ",p1)
        print ("param: ",p2)
        print ("Login")
        response = tempData()
        self.write(json.dumps(response))

    def get(self, param, p2):
        data = tornado.escape.json_decode(self.request.body)
        print (data)
        print ("param: ",param)
        print ("Login")
        response = tempData()
        self.write(json.dumps(response))

    def delete(self):
        print ("Delete")

    def put(self):
        print ("PUT")

class SignupHandler(tornado.web.RequestHandler):
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        response = tempData()
        print ("Signup")
        self.write(json.dumps(response))

# /edits/Post
# /edits/Content
# /edits/Comments

def main():
    application = tornado.web.Application([
        (r"/", MainHandler),
        
        (r"/login/(.*)/(.*)", LoginHandler),
        (r"/login/(.*)", LoginHandler),
        (r"/login", LoginHandler),

        (r"/sign_up", SignupHandler),
        (r"/display", DisplayContent),
        (r'/(.*)', tornado.web.StaticFileHandler, {'path': './'}),
        (r"/image/*.png", tornado.web.StaticFileHandler, {'path':'./image/'}),


    ])
    http_server = tornado.httpserver.HTTPServer(application)
    port = int(os.environ.get("PORT", 8002))
    http_server.listen(port)
    print ("Server Running on Port: ", port)
    tornado.ioloop.IOLoop.instance().start()
 
if __name__ == "__main__":
    main()