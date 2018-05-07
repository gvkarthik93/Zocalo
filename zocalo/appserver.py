import os
import tornado.httpserver
import tornado.ioloop
import tornado.web
import json
import tornado.escape
import pandas as pd
from zocalo.service.user_service import UserService
from zocalo.service.post_service import PostService
from zocalo.service.course_service import CourseService
from zocalo.service.index_service import IndexService
from zocalo.util.auth_util import AuthUtil

# Keep track of number of repeated function calls
count = 0
index = IndexService()

# interval between function call in ms
interval_ms = 60000


class PeriodicFunctionHandler():
    def generic_func():
        global count
        count = count + 1
        global index
        index.updateIndex()
        print("Index has been updated " + str(count) + " times")


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('../index.html')


# Handle the access requests
class AccessHandler(tornado.web.RequestHandler):
    def post(self, param=None):
        if param is None:
            self.write(json.dumps(
                {"status": 0, "message": "Access Denied"}))
            return

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
            auth_header = self.request.headers.get('Authorization')
            au = AuthUtil()
            msg = au.checkToken(auth_header)
            if not msg[0]:
                self.write(msg[1])

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
            print(data)

        elif param == "schools":
            data = tornado.escape.json_decode(self.request.body)
            print(data)
            # Get all the schools in the database

    def delete(self, param=None):
        if param is None:
            print ("Send No access Code")
        elif param == "delete":
            print ("Delete the credential")


# Handle the requests associated with posts
class PostsHandler(tornado.web.RequestHandler):
    # To fetch all the posts
    def get(self, param1=None):
        try:
            cid = self.get_query_argument("cid")
        except:
            self.write(json.dumps(
                {"status":0, "message":"course id needed"}))
            return

        auth_header = self.request.headers.get('Authorization')
        au = AuthUtil()
        msg = au.checkToken(auth_header)
        if not msg[0]:
            self.write(msg[1])
            return

        data = {}
        data["username"] = msg[1]["username"]
        data["course_id"] = cid
        ps = PostService()
        if param1 is None:
            response = ps.get_questions(data)
            self.write(json.dumps(response))
        else:
            response = ps.get_post(param1, data)
            self.write(json.dumps(response))

    # To create new posts and answers
    def post(self, param1=None, param2=None, param3=None, param4=None):
        auth_header = self.request.headers.get('Authorization')
        au = AuthUtil()
        msg = au.checkToken(auth_header)
        if not msg[0]:
            self.write(msg[1])

        try:
            data = tornado.escape.json_decode(self.request.body)
        except:
            self.write(json.dumps(
                {"status": 0, "message": "Invalid json format"}))
            return
        data["username"] = msg[1]["username"]
        ps = PostService()

        # posts/
        if param1 is None and param2 is None and param3 is None \
           and param4 is None:
            response = ps.create_post(data)
            self.write(json.dumps(response))

        # posts/{pid}/answer
        elif param1 is not None and param2 == "answer" and param3 is None \
                and param4 is None:
            response = ps.create_reply(param1, data)
            self.write(json.dumps(response))

        # posts/{pid}/vote
        elif param2 == "vote" and param3 is None and param4 is None:
            response = ps.update_post_vote(param1, data)
            self.write(json.dumps(response))

        # posts/{pid}/answer/{rid}/vote
        elif param2 == "answer" and param4 == "vote":
            response = ps.update_reply_vote(param1, data)
            self.write(json.dumps(response))

    # To edit specific post or answer
    def put(self, param1=None, param2=None, param3=None, param4=None):
        auth_header = self.request.headers.get('Authorization')
        au = AuthUtil()
        msg = au.checkToken(auth_header)
        if not msg[0]:
            self.write(msg[1])

        try:
            data = tornado.escape.json_decode(self.request.body)
        except:
            self.write(json.dumps(
                {"status": 0, "message": "Invalid json format"}))
            return
        data["username"] = msg[1]["username"]
        ps = PostService()
        if param1 and not param2 and not param3:
            response = ps.edit_post(param1, data)
            self.write(json.dumps(response))

        elif param1 and param2 and param3:
            response = ps.edit_reply(param3, data)
            self.write(json.dumps(response))

    # To delete specific post or answer
    def delete(self, param1=None, param2=None, param3=None, param4=None):
        auth_header = self.request.headers.get('Authorization')
        au = AuthUtil()
        msg = au.checkToken(auth_header)
        if not msg[0]:
            self.write(msg[1])
        data = {}
        data["username"] = msg[1]["username"]
        ps = PostService()
        if param1 and not param2 and not param3:
            response = ps.delete_post(param1, data)
            self.write(json.dumps(response))
        elif param1 and param2 and param3:
            response = ps.delete_reply(param3, data)
            self.write(json.dumps(response))


class EnrollHandler(tornado.web.RequestHandler):
    def post(self, param1=None, param2=None):
        auth_header = self.request.headers.get('Authorization')
        au = AuthUtil()
        msg = au.checkToken(auth_header)
        if not msg[0]:
            self.write(msg[1])

        try:
            data = tornado.escape.json_decode(self.request.body)
        except:
            self.write(json.dumps(
                {"status": 0, "message": "Invalid json format"}))
            return
        data["username"] = msg[1]["username"]
        cs = CourseService()

        # /course/{cid}/tag
        if param1 is not None and param2 == "tag":
            response = cs.create_tag(param1, data)
            self.write(json.dumps(response))
        elif param1 is not None:
            try:
                data = tornado.escape.json_decode(self.request.body)
            except:
                self.write(json.dumps(
                    {"status": 0, "message": "Invalid json format"}))
                return

            # Enroll for course
            # Create courses

        else:
            # Invalid request type
            print("Invalid Request")

    def delete(self, param1=None, param2=None, param3=None, param4=None):
        auth_header = self.request.headers.get('Authorization')
        au = AuthUtil()
        msg = au.checkToken(auth_header)
        if not msg[0]:
            self.write(msg[1])
        data = {}
        data["username"] = msg[1]["username"]
        ps = CourseService()

        # /course/{cid}/tag/{tag_name}
        if param1 is not None and param2 == "tag" and param3 is not None:
            response = ps.delete_tag(param1, param3, data)
            self.write(json.dumps(response))


def main():
    application = tornado.web.Application([
        (r"/", MainHandler),
        (r"/LoginPage", MainHandler),
        (r"/SignupPage", MainHandler),
        (r"/MainPage", MainHandler),

        (r"/access/(.*)", AccessHandler),
        (r"/access", AccessHandler),

        (r"/posts/(.*)/(.*)/(.*)/(.*)", PostsHandler),
        (r"/posts/(.*)/(.*)/(.*)", PostsHandler),
        (r"/posts/(.*)/(.*)", PostsHandler),
        (r"/posts/(.*)", PostsHandler),
        (r"/posts", PostsHandler),

        (r"/course/(.*)/(.*)/(.*)", EnrollHandler),
        (r"/course/(.*)/(.*)", EnrollHandler),
        (r"/course/(.*)", EnrollHandler),

        (r'/(.*)', tornado.web.StaticFileHandler, {'path': './'}),
        (r"/image/*.png", tornado.web.StaticFileHandler, {'path':'./image/'}),


    ])
    http_server = tornado.httpserver.HTTPServer(application)
    port = int(os.environ.get("PORT", 8002))
    http_server.listen(port)
    
    global index
    index.createIndex()

    print ("Server Running on Port: ", port)
    #tornado request for repeated function call
    tornado.ioloop.PeriodicCallback(PeriodicFunctionHandler.generic_func,interval_ms).start()
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
