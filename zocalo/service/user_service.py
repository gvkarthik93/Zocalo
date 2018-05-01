import sys
import os
import bcrypt
import hashlib, binascii
from sqlalchemy import create_engine, exists
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm.exc import MultipleResultsFound
from zocalo.database.database_setup import *
from zocalo.util.auth_util import AuthUtil

engine = create_engine('sqlite:///zocalo/database/Zocalo.db')
Session = sessionmaker(bind=engine)
session = Session()


class UserService:
    def hash_password(self, pwd):
        dk = hashlib.pbkdf2_hmac('sha256', pwd.encode(), b'salt',100000)
        password = binascii.hexlify(dk)
        return password.decode()

    def login(self, data):
        try:
            user = session.query(User).filter_by(username=data["username"]).one()
        except KeyError:
            return {"status": 0, "message": "Invalid JSON field", "courses": []}
        except NoResultFound:
            return {"status": 0, "message": "No username found", "courses": []}
        except MultipleResultsFound:
            pass

        try:
            # if not bcrypt.checkpw(data["password"], user.password):
            print(user.password)
            print(self.hash_password(data["password"]))
            if user.password != self.hash_password(data["password"]):
                return {"status": 0, "message": "Wrong password", "courses": []}
        except KeyError:
            return {"status": 0, "message": "Invalid JSON field", "courses": []}

        # get all the course id associated with the user
        course_list = []
        for uc in user.courses:
            c = uc.u_c
            d = {}
            d["course_id"] = c.id
            d["course_name"] = c.course_name
            d["course_title"] = c.course_title
            course_list.append(d)

        # generate Token
        a_u = AuthUtil()
        jwt_token = a_u.generateToken(user.username)

        return {"status": 1, "message": "Success",
                "courses": course_list, "token": jwt_token.decode("utf-8")}

    def register(self, data):
        # check duplicate email and username
        try:
            if session.query(
                exists().where(User.username == data["username"])
            ).scalar():
                return {"status": 0, "message": "Username existed"}
            if session.query(
                exists().where(User.email == data["email"])
            ).scalar():
                return {"status": 0, "message": "Email existed"}
            pwd = self.hash_password(data["password"])
            new_user = User(
                username=data["username"],
                password=pwd,
                name=data["name"],
                email=data["email"]
            )
        except KeyError:
            return {"status": 0, "message": "Invalid JSON field"}

        session.add(new_user)
        session.commit()
        return {"status": 1, "message": "Success"}

    def change_password(self, data):
        try:
            user = session.query(User).filter_by(
                username=data["username"]).one()
        except KeyError:
            return {"status": 0, "message": "Invalid JSON field"}
        except NoResultFound:
            return {"status": 0, "message": "No username founded"}
        except MultipleResultsFound:
            pass

        try:
            user.password = self.hash_password(data["password"])
        except KeyError:
            return {"status": 0, "message": "Invalid JSON field"}

        session.commit()
        return {"status": 1, "message": "Success"}

    def forget_password(self):
        pass
