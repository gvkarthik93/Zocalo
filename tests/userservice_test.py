import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))
from Zocalo.service.user_service import UserService

us1 = UserService()
u1 = {"user_name": "SihanC", "password": "abc", "name": "Sihan", "email": "sc2288@cornell.edu"}
u2 = {"user_name": "JackYan", "password": "abc", "name": "Jack", "email": "jc223@cornell.edu"}

print(us1.register(u1))
print(us1.login("SihanC", "123"))
print(us1.login("SihanC", "abc"))
print(us1.change_password("SihanC", "123"))
