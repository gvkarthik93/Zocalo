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
            self.write(json.dumps(result))

        elif param == "forgotpwd":
            data = tornado.escape.json_decode(self.request.body)
            print (data)

        elif param == "schools":
            data = tornado.escape.json_decode(self.request.body)
            print (data)
            # Get all the schools in the database

    def delete(self, param=None):
        if param is None:
            print ("Send No access Code")
        elif param == "delete":
            print ("Delete the credential")


# Handle the requests associated with posts
class PostsHandler(tornado.web.RequestHandler):
    def get(self, param1=None, param2=None, param3=None):
        try:
            data = tornado.escape.json_decode(self.request.body)
        except:
            self.write(json.dumps(
                {"status":0, "message":"Invalid json format"}))
            return

        if param1 is None:
            ps = PostService()
            response = ps.get_questions(data)
            self.write(json.dumps(response))
        else:
            ps = PostService()
            response = ps.get_post(param1, data)
            self.write(json.dumps(response))

    def post(self, param1=None, param2=None, param3=None):
        try:
            data = tornado.escape.json_decode(self.request.body)
        except:
            self.write(json.dumps(
                {"status":0, "message":"Invalid json format"}))
            return

        if param1 is None and param2 is None:
            ps = PostService()
            response = ps.create_post(data)
            self.write(json.dumps(response))
        else:
            ps = PostService()
            response = ps.create_reply(param1, data)
            self.write(json.dumps(response))

    def delete(self, param1=None, param2=None, param3=None):
        if param1 and not param2 and not param3:
            ps = PostService()
            response = ps.delete_post(param1)
            self.write(json.dumps(response))

        elif param1 and param2 and param3:
            ps = PostService()
            response = ps.delete_reply(param3)
            self.write(json.dumps(response))           


class EnrollHandler(tornado.web.RequestHandler):
    def post(self, param1=None):
        if param1 is not None:
            try:
                data = tornado.escape.json_decode(self.request.body)
            except:
                self.write(json.dumps(
                    {"status":0, "message":"Invalid json format"}))
                return

            # Enroll for course

        else:
            # Invalid request type
            print ("Invalid Request")


def main():
    application = tornado.web.Application([
        (r"/", MainHandler),
        (r"/LoginPage", MainHandler),
        (r"/SignupPage", MainHandler),
        (r"/MainPage", MainHandler),

        (r"/access/(.*)", AccessHandler),
        (r"/access", AccessHandler),

#/enroll/course
#/access/schools

        (r"/posts/(.*)/(.*)/(.*)", PostsHandler),
        (r"/posts/(.*)/(.*)", PostsHandler),
        (r"/posts/(.*)", PostsHandler),
        (r"/posts", PostsHandler),

        (r"/enroll/(.*)", EnrollHandler),

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
