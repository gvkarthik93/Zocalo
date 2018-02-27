import os
import sys
from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'

    user_name = Column(String(100), primary_key=True)
    password = Column(String(100), nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)  	

    def __repr__(self):
        return "<User(user_name='%s', password='%s', name='%s', email='%s')>" % (
                self.user_name, self.fullname, self.password, self.email)	

engine = create_engine('mysql+mysqldb://root:0529@localhost:3306/Zocalo')

Base.metadata.create_all(engine)
