"""This file is used to create temporary data for testing purpose."""

import datetime
import hashlib, binascii
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from zocalo.database.schema import Base, School, Course, Tag, User, UserCourse, \
    Post, Reply, PostTag

def hash_password(pwd):
    dk = hashlib.pbkdf2_hmac('sha256', pwd.encode(), b'salt',100000)
    password = binascii.hexlify(dk)
    return password

def create_tmp_data(base, engine):
    base.metadata.bind = engine
    Session = sessionmaker(bind=engine)
    session = Session()

    # schools
    s1 = School(school_name="Cornell University")

    # courses
    c1 = Course(course_name="CS 5412", school_id=1, course_title="Cloud Computing", term_id=1)
    c2 = Course(course_name="CS 5780", school_id=1, course_title="Machine Learning", term_id=1)

    # tags associated with the course
    tg1 = Tag(course_id=1, name="exam")
    tg2 = Tag(course_id=1, name="project1")
    tg3 = Tag(course_id=1, name="project2")
    tg4 = Tag(course_id=1, name="project3")
    tg5 = Tag(course_id=1, name="hw1")

    # users
    p1 = hash_password("sc123")
    p2 = hash_password("kb123")
    p3 = hash_password("kl456")
    p4 = hash_password("cn123")
    u1 = User(username="SihanC", password=p1, name="Sihan Chen", email="sc2288@cornell.edu", school_id=1)
    u2 = User(username="Ken_B", password=p2, name="Ken Birman", email="kb123@cornell.edu", school_id=1)
    u3 = User(username="Kilian", password=p3, name="Kilian Winberg", email="kw456@cornell.edu", school_id=1)
    u4 = User(username="Conor", password=p4, name="Conor Mcgregor", email="cm@cornell.edu", school_id=1)

    # enroll students
    uc1 = UserCourse(username="SihanC", course_id=1, role_id=3)
    uc2 = UserCourse(username="SihanC", course_id=2, role_id=3)
    uc3 = UserCourse(username="Ken_B", course_id=1, role_id=1)
    uc4 = UserCourse(username="Kilian", course_id=2, role_id=1)
    uc5 = UserCourse(username="Conor", course_id=1, role_id=3)

    # posts
    p1 = Post(
        header="When is the midterm", create_time=datetime.datetime.now(), last_edit_time=datetime.datetime.now(),
        description="What is the exact time of midterm? Wherer is the midterm?",
        up_vote=3, down_vote=0, post_username="SihanC", course_id=1, post_type_id=1, visibility_type_id=1)

    p2 = Post(
        header="What is paxos", description="I heard paxos is a name of a place, where is it? I want to visit it",
        up_vote=1, down_vote=5, post_username="SihanC", course_id=1, post_type_id=1, visibility_type_id=1,
        create_time=datetime.datetime.now(), last_edit_time=datetime.datetime.now(),)

    p3 = Post(
        header="ZooKeeper?", create_time=datetime.datetime.now(), last_edit_time=datetime.datetime.now(),
        description="I heard ZooKeeper is a name of a movie. Why are we studying it?",
        up_vote=10, down_vote=0, post_username="Conor", course_id=1, post_type_id=1, visibility_type_id=2)

    # replies
    r1 = Reply(post_id=1, username="Conor", answer="Tomorrow at noon.", up_vote=1, down_vote=0,
    	       create_time=datetime.datetime.now(), last_edit_time=datetime.datetime.now())
    r2 = Reply(post_id=1, username="Ken_B", answer="Conor is right.", up_vote=1, down_vote=4,
    	       create_time=datetime.datetime.now(), last_edit_time=datetime.datetime.now())
    r3 = Reply(post_id=1, username="Ken_B", answer="Sorry, wrong answer, it should be tomorrow evening", 
    	       up_vote=20, down_vote=1, create_time=datetime.datetime.now(), last_edit_time=datetime.datetime.now())

    # post_tags
    pt1 = PostTag(post_id=1, tag_id=1)
    pt2 = PostTag(post_id=1, tag_id=2)
    pt3 = PostTag(post_id=1, tag_id=4)
    pt4 = PostTag(post_id=2, tag_id=3)

    # adding to database
    session.add(s1)
    session.add(c1)
    session.add(c2)
    session.add(tg1)
    session.add(tg2)
    session.add(tg3)
    session.add(tg4)
    session.add(tg5)
    session.add(u1)
    session.add(u2)
    session.add(u3)
    session.add(u4)
    session.add(uc1)
    session.add(uc2)
    session.add(uc3)
    session.add(uc4)
    session.add(uc5)
    session.add(p1)
    session.add(p2)
    session.add(p3)
    session.add(r1)
    session.add(r2)
    session.add(r3)
    session.add(pt1)
    session.add(pt2)
    session.add(pt3)
    session.add(pt4)

    session.commit()


if __name__ == '__main__':
    engine = create_engine('sqlite:///Zocalo.db')
    create_tmp_data(Base, engine)

