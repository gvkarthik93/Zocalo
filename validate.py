from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm.exc import MultipleResultsFound
from database_setup import User, Base

engine = create_engine('mysql+mysqldb://root:0529@localhost:3306/Zocalo')
Session = sessionmaker(bind=engine)
session = Session()

class ValidateCredentials:
    def validate_login_details(self):
        # Fetch Username, Password, EmailID

    def validate_signup_details(self):
        # Fetch Username, Password, EmailID

class FetchCredentials:
    def fetch_user_details(self):
        # Fetch Username, Password, EmailID

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

