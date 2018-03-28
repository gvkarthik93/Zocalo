import os
import tornado.httpserver
import tornado.ioloop
import tornado.web
import json
import tornado.escape
#from temp_data import tempData

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
        #response = tempData()
        #self.write(json.dumps(response))

    def delete(self, param=None):
        if param is None:
            print ("Send No access Code")
        elif param == "delete":
            print ("Delete the credential")

# /edits/Post
# /edits/Content
# /edits/Comments

def main():
    application = tornado.web.Application([
        (r"/", MainHandler),
        
        (r"/access/(.*)", AccessHandler),
        (r"/access", AccessHandler),


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