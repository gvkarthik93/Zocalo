import json
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))
from Zocalo.service.post_service import PostService

ps1 = PostService()
tp = ps1.get_questions(1, "CS 5412")
print(tp[0])
d = json.loads(tp[1])
print(d)

tp1 = ps1.get_post(1)
print(tp1[0])
d = json.loads(tp1[1])
print(d)

print(ps1.delete_post(100))
print(ps1.delete_post(1))
print(ps1.delete_reply(100))
print(ps1.delete_reply(1))