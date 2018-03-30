import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from Zocalo.db.database_setup import *

engine = create_engine('sqlite:///../database/Zocalo.db')
Base.metadata.bind = engine
Session = sessionmaker(bind=engine)
session = Session()

s1 = School(school_name="Cornell University")

c1 = Course(course_name = "CS 5412", school_id = 1,
      course_title = "Cloud Computing")
c2 = Course(course_name = "CS 5780", school_id = 1,
      course_title = "Machine Learning")

u1 = User(user_name="SihanC", password="abcdefg", name="Sihan Chen", 
        email="sc2288@cornell.edu")

p1 = Post(header="When is the midterm", summary="as header", 
    description="What is the exact time of midterm? Wherer is the midterm?", 
    vote_count=35, post_username="SihanC", 
    course_id=1)

p2 = Post(header="What is paxos", summary="Can someone please explain paxos", 
    description="What's up, put ur hands up", vote_count=35, 
    post_username="SihanC", course_id=1)

r1 = Reply(post_id=1, username="SihanC", answer="Tomorrow at noon.", vote_count=3)

r2 = Reply(
        post_id=1, username="SihanC", 
        answer="Sorry, wrong answer, it should be tomorrow evening", 
        vote_count=50)

session.add(s1)
session.add(c1)
session.add(c2)
session.add(p1)
session.add(p2)
session.add(r1)
session.add(r2)
session.commit()