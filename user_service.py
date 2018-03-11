from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm.exc import MultipleResultsFound
from database_setup import User, Base

engine = create_engine('sqlite:///Zocalo.db')
Session = sessionmaker(bind=engine)
session = Session()

class UserService:

    def hash_password(self, pwd):
        return pwd

    def check_valid():
        pass

    def login(self, u_n, pwd):
        try:
            user = session.query(User).filter_by(user_name=u_n).one()
        except NoResultFound:
            return (-1, "No username founded")
        except MultipleResultsFound:
            pass

        return (1, "Success") if user.password == self.hash_password(pwd) \
            else (-1, "Wrong password")


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
            return (-1, "No username founded")
        except MultipleResultsFound:
            pass

        user.password = self.hash_password(pwd)
        session.commit()
        return (1, "Success")   

    def reset_password(self):
        pass

    def check_admin(self):
        pass
