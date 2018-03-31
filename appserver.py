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
            if result["status"]:
                ps = PostService()
                response = ps.get_questions()
                self.write(json.dumps(response))
            else:
                self.write(json.dumps(
                    {"status":0, "message":result["message"]}))

        elif param == "signup":
            try:
                data = tornado.escape.json_decode(self.request.body)
            except:
                self.write(json.dumps(
                    {"status":0, "message":"Invalid json format"}))
                return
            us = UserService()
            result = us.register(data)
            if result["status"]:
                ps = PostService()
                response = ps.get_questions()
                self.write(json.dumps(response))
            else:
                self.write(json.dumps(
                    {"status":0, "message":result["message"]}))

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
    def post(self, param=None):
        if param is None:
            print ("Send all the posts from the database")
        else:
            data = tornado.escape.json_decode(self.request.body)
            print (data)
            print ("Send specific post")

    def delete(self, param=None):
        if param is None:
            print ("Need to provide specific post details")
        else:
            print ("Delete specific post")

# /edits/Post
# /edits/Content
# /edits/Comments

def main():
    application = tornado.web.Application([
        (r"/", MainHandler),
        
        (r"/access/(.*)", AccessHandler),
        (r"/access", AccessHandler),

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