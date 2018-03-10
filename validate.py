from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm.exc import MultipleResultsFound
from database_setup import User, Base
import numpy as np

engine = create_engine('mysql+mysqldb://root:0529@localhost:3306/Zocalo')
Session = sessionmaker(bind=engine)
session = Session()

class ValidateCredentials:
    def validate_login_details(self):
        userDb = FetchCredentials()
        user_details = userDB.fetch_user_details()
        user_details = np.asmatrix(user_details)
        if input_credentials ["user_name"] not in user_details[:,0]:
            return "Invalid Username"
        else input_credentials ["email"] in user_details[:,2]:
            return "Email already Registered"
        return "Valid User"

    def validate_signup_details(self, input_credentials):
        userDb = FetchCredentials()
        user_details = userDB.fetch_user_details()
        user_details = np.asmatrix(user_details)
        if input_credentials ["user_name"] in user_details[:,0]:
            return "Username Taken"
        elif input_credentials ["email"] in user_details[:,2]:
            return "Email already Registered"
        registerCredentials = UserCredentials()
        registerCredentials.register(input_credentials)

class FetchCredentials:
    def fetch_user_details(self):
        # Fetch Username, Password, EmailID
        # Returns a tuple or list
        # Example [('Username', 'Password',  'EmailID'), ('Username', 'Password',  'EmailID'), ...]

class UserCredentials:
    def login(self, u_n, pwd):
            try:
                user = session.query(User).filter_by(user_name=u_n).one()
            except NoResultFound:
                return False

            return user.password == pwd

    def register(self, info):
        new_user = User(
            user_name=info["user_name"], 
            password=info["password"],
            name=info["name"], 
            email=info["email"]
        )

        session.add(new_user)
        session.commit()

