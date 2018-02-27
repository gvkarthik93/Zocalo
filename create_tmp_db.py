from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database_setup import Base, User

engine = create_engine('mysql+mysqldb://root:0529@localhost:3306/Zocalo')
Base.metadata.bind = engine
Session = sessionmaker(bind=engine)
session = Session()

user1 = User(user_name="u1", password="p1", name="Peter" , email="u1@cornell.edu")
session.add(user1)
session.commit()

user2 = User(user_name="u2", password="p2" , name="Jeff" , email="u2@cornell.edu")
session.add(user2)
session.commit()

user3 = User(user_name="u3", password="p3" , name="Lisa", email="u3@cornell.edu")
session.add(user3)
session.commit()

user4 = User(user_name="u4", password="p4" , name="David", email="u4@cornell.edu")
session.add(user4)
session.commit()

user5 = User(user_name="u5", password="p5" , name="Alice" , email="u5@cornell.edu")
session.add(user5)
session.commit()





