import os
import tornado.httpserver
import tornado.ioloop
import tornado.web
import json
import tornado.escape
from database.temp_data import tempData

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('./index.html')

# Handle the access requests
class AccessHandler(tornado.web.RequestHandler):
    def post(self, param=None):
        if param is None:
            print ("Send No Access Code")
        elif param == "login":
            data = tornado.escape.json_decode(self.request.body)
            print (data)
            # Login Function
        elif param == "signup":
            data = tornado.escape.json_decode(self.request.body)
            print (data)
            # Signup Function
        else:
            print ("Error 404")
        response = tempData()
        self.write(json.dumps(response))

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