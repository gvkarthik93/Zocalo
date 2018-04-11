import sys
import os
import bcrypt
sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))
from sqlalchemy import create_engine, exists
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm.exc import MultipleResultsFound
from Zocalo.database.database_setup import *

engine = create_engine('sqlite:///database/Zocalo.db')
Session = sessionmaker(bind=engine)
session = Session()

class UserService:
    def hash_password(self, pwd):
        # hashed_pwd = bcrypt.hashpw(pwd.encode('utf-8'), bcrypt.gensalt(17))
        return pwd
        # return hashed_pwd

    def login(self, data):
        try:
            user = session.query(User).filter_by(
                username=data["username"]).one()
        except KeyError:
            return {"status":0, "message":"Invalid JSON field", "courses":[]}
        except NoResultFound:
            return {"status":0, "message":"No username found", "courses":[]}
        except MultipleResultsFound:
            pass

        try:
            # if not bcrypt.checkpw(data["password"], user.password):
            if user.password != self.hash_password(data["password"]):
                return {"status":0, "message":"Wrong password", "courses":[]}
        except KeyError:
            return {"status":0, "message":"Invalid JSON field", "courses":[]}

        # get all the course id associated with the user
        course_list = []
        for uc in user.courses:
            c = uc.u_c
            d = {}
            d["course_id"] = c.id
            d["course_name"] = c.course_name
            d["course_title"] = c.course_title
            course_list.append(d)

        return {"status":1, "message":"Success", "courses":course_list}


    def register(self, data):

        # check duplicate email and username
        try:
            if session.query(
                exists().where(User.username==data["username"])).scalar():
                return {"status":0, "message":"Username existed"}
            if session.query(
                exists().where(User.email==data["email"])).scalar():
                return {"status":0, "message":"Email existed"}
            pwd = self.hash_password(data["password"])
            new_user = User(
                username=data["username"],
                password=pwd,
                name=data["name"],
                email=data["email"]
            )
        except KeyError:
            return {"status":0, "message":"Invalid JSON field"}

        session.add(new_user)
        session.commit()
        return {"status":1, "message":"Success"}

    def change_password(self, data):
        try:
            user = session.query(User).filter_by(
                username=data["username"]).one()
        except KeyError:
            return {"status":0, "message":"Invalid JSON field"}
        except NoResultFound:
            return {"status":0, "message":"No username founded"}
        except MultipleResultsFound:
            pass

        try:
            user.password = self.hash_password(data["password"])
        except KeyError:
            return {"status":0, "message":"Invalid JSON field"}

        session.commit()
        return {"status":1, "message":"Success"}

    def forget_password(self):
        pass
