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
        hashed_pwd = bcrypt.hashpw(pwd.encode('utf-8'), bcrypt.gensalt(17))
        return hashed_pwd

    def login(self, data):
        try:
            user = session.query(User).filter_by(
                user_name=data["username"]).one()
        except KeyError:
            return (0, "Invalid JSON field")
        except NoResultFound:
            return (0, "No username founded")
        except MultipleResultsFound:
            pass

        try:
            if user.password != self.hash_password(data["password"]):
                return (0, "Wrong password")
        except KeyError:
            return (0, "Invalid JSON field")

        # (1, "Success", [list of course id])
        # get the questions associate with the user

        return (1, "Success")
        

    def register(self, data):

        # check duplicate email and username
        try:
            if session.query(
                exists().where(User.user_name==data["username"])).scalar():
                return (0, "username existed")
            if session.query(
                exists().where(User.email==data["email"])).scalar():
                return (0, "email existed")
            pwd = self.hash_password(data["password"])
            new_user = User(
                user_name=data["username"], 
                password=pwd,
                name=data["name"], 
                email=data["email"]
            )
        except KeyError:
            return (0, "Invalid JSON field")

        session.add(new_user)
        session.commit()
        return (1, "Success")

    def change_password(self, data): 
        try:
            user = session.query(User).filter_by(
                user_name=data["username"]).one()
        except KeyError:
            return (0, "Invalid JSON field")
        except NoResultFound:
            return (0, "No username founded")
        except MultipleResultsFound:
            pass

        try:
            user.password = self.hash_password(data["password"])
        except KeyError:
            return (0, "Invalid JSON field")

        session.commit()
        return (1, "Success")   

    def forget_password(self):
        pass
