from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database_setup import Base, User

engine = create_engine('mysql+mysqldb://root:0529@localhost:3306/Zocalo')
Base.metadata.bind = engine
Session = sessionmaker(bind=engine)
session = Session()

session.add_all([
    User(user_name="u1", password="p1", name="Peter" , email="u1@cornell.edu"),
    User(user_name="u2", password="p2" , name="Jeff" , email="u2@cornell.edu"),
    User(user_name="u3", password="p3" , name="Lisa", email="u3@cornell.edu"),
    User(user_name="u4", password="p4" , name="David", email="u4@cornell.edu"),
    User(user_name="u5", password="p5" , name="Alice" , email="u5@cornell.edu")
])
session.commit()

