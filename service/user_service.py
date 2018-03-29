import sys
import os
import bcrypt
sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))
from sqlalchemy import create_engine
from sqlalchemy import exists
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm.exc import MultipleResultsFound
from Zocalo.db.database_setup import *

engine = create_engine('sqlite:///../database/Zocalo.db')
Session = sessionmaker(bind=engine)
session = Session()

class UserService:

    def hash_password(self, pwd):
        hashed_pwd = bcrypt.hashpw(pwd, bcrypt.gensalt(17))
        return hashed_pwd

    def check_valid(self, input_email):
        #use exist because we are just trying to find if input_email exist already, can switch back to try, except clause
        exist = session.query(exists().where(User.email==input_email)).scalar()
        if exist:
            return (1, "This e-mail is already in the database")
        else:
            return(0, "This e-mail is not in the database")

    def login(self, u_n, pwd):
        try:
            user = session.query(User).filter_by(user_name=u_n).one()
        except NoResultFound:
            return (0, "No username founded")
        except MultipleResultsFound:
            pass

        return (1, "Success") if user.password == self.hash_password(pwd) \
            else (0, "Wrong password")


    def register(self, info):
        # check validate
        pwd = self.hash_password(info["password"])
        new_user = User(
            user_name=info["user_name"], 
            password=pwd,
            name=info["name"], 
            email=info["email"]
        )

        session.add(new_user)
        session.commit()
        return (1, "Success")

    def change_password(self, u_n, pwd): 
        try:
            user = session.query(User).filter_by(user_name=u_n).one()
        except NoResultFound:
            return (0, "No username founded")
        except MultipleResultsFound:
            pass

        user.password = self.hash_password(pwd)
        session.commit()
        return (1, "Success")   

    def forget_password(self):
        pass
