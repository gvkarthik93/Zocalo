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

# Handle the login requests
class LoginHandler(tornado.web.RequestHandler):
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        print (data)
        response = tempData()
        self.write(json.dumps(response))

class SignupHandler(tornado.web.RequestHandler):
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        response = tempData()
        self.write(json.dumps(response))

class PostNewQuestion(tornado.web.RequestHandler):
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        response = tempData()
        self.write(json.dumps(response))

class PostNewAnswer(tornado.web.RequestHandler):
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        response = tempData()
        self.write(json.dumps(response))

class GetSpecificPostContent(tornado.web.RequestHandler):
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        response = tempData()
        self.write(json.dumps(response))

class EditSpecificPost(tornado.web.RequestHandler):
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        response = tempData()
        self.write(json.dumps(response))

class DeleteSpecificPost(tornado.web.RequestHandler):
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        response = tempData()
        self.write(json.dumps(response))

class EditSpecificPostContent(tornado.web.RequestHandler):
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        response = tempData()
        self.write(json.dumps(response))

class DeleteSpecificPostContent(tornado.web.RequestHandler):
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        response = tempData()
        self.write(json.dumps(response))

class ChangePassword(tornado.web.RequestHandler):
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        response = tempData()
        self.write(json.dumps(response))

class ResetPassword(tornado.web.RequestHandler):
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        response = tempData()
        self.write(json.dumps(response))

class ChangeDisplayName(tornado.web.RequestHandler):
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        response = tempData()
        self.write(json.dumps(response))

def main():
    application = tornado.web.Application([
        (r"/", MainHandler),
        (r"/login", LoginHandler),
        (r"/sign_up", SignupHandler),
        (r"/post_details", GetPostContent),
        (r"/change_password", ChangePassword),
        (r"/reset_password", ResetPassword),
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