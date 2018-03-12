from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm.exc import MultipleResultsFound
from database_setup import User, Base

engine = create_engine('sqlite:///Zocalo.db')
Session = sessionmaker(bind=engine)
session = Session()

class PostService:

    def get_questions(self, s_name, c_name):
        pass

    def get_post(self, p_id):
        pass

    def delete_post(self, p_id):
        pass

    def delete_reply(self, r_id):
        pass

    def edit_post(self, p_id):
        pass

    def edit_reply(self, r_id):
        pass

    def create_post(self, data):
        pass

    def create_reply(self, data):
        pass