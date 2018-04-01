import os
import tornado.httpserver
import tornado.ioloop
import tornado.web
import json
import tornado.escape
from service.user_service import UserService
from service.post_service import PostService

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('./index.html')

# Handle the access requests
class AccessHandler(tornado.web.RequestHandler):
    def post(self, param=None):
        if param is None:
            self.write(json.dumps(
                {"status":0, "message":"Access Denied"}))
        
        elif param == "login":
            try:
                data = tornado.escape.json_decode(self.request.body)
            except:
                self.write(json.dumps(
                    {"status":0, "message":"Invalid json format"}))
                return
            us = UserService()
            result = us.login(data)
            self.write(json.dumps(result))

        elif param == "signup":
            try:
                data = tornado.escape.json_decode(self.request.body)
            except:
                self.write(json.dumps(
                    {"status":0, "message":"Invalid json format"}))
                return
            us = UserService()
            result = us.register(data)
            self.write(json.dumps(result))

        elif param == "changepwd":
            try:
                data = tornado.escape.json_decode(self.request.body)
            except:
                self.write(json.dumps(
                    {"status":0, "message":"Invalid json format"}))
                return
            us = UserService()
            result = us.change_password(data)
            self.write(json.dumps(
                {"status":result["status"], "message":result["message"]}))

        elif param == "forgotpwd":
            data = tornado.escape.json_decode(self.request.body)
            print (data)

    def delete(self, param=None):
        if param is None:
            print ("Send No access Code")
        elif param == "delete":
            print ("Delete the credential")

# Handle the requests associated with posts
class PostsHandler(tornado.web.RequestHandler):
    def post(self, param1=None, param2=None, param3=None):
        if param1 is None:
            try:
                data = tornado.escape.json_decode(self.request.body)
            except:
                self.write(json.dumps(
                    {"status":0, "message":"Invalid json format"}))
                return

            ps = PostService()
            response = ps.get_questions(data)
            self.write(json.dumps(response))

        else:
            try:
                data = tornado.escape.json_decode(self.request.body)
            except:
                self.write(json.dumps(
                    {"status":0, "message":"Invalid json format"}))
                return

            ps = PostService()
            response = ps.get_post(param1, data)
            self.write(json.dumps(response))

    def delete(self, param1=None, param2=None, param3=None):
        if param1 and not param2 and not param3:
            print ("Delete specific post")
        elif param1 and param2 and param3:
            print ("Delete specific specific answer related to specific post")

def main():
    application = tornado.web.Application([
        (r"/", MainHandler),
        
        (r"/access/(.*)", AccessHandler),
        (r"/access", AccessHandler),

        (r"/posts/(.*)/(.*)/(.*)", PostsHandler),
        (r"/posts/(.*)/(.*)", PostsHandler),
        (r"/posts/(.*)", PostsHandler),
        (r"/posts", PostsHandler),

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