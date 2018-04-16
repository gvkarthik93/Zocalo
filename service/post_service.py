import sys
import json
import os
sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))
from sqlalchemy import create_engine, and_, exists
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm.exc import MultipleResultsFound
from Zocalo.database.database_setup import *

engine = create_engine('sqlite:///database/Zocalo.db')
Session = sessionmaker(bind=engine)
session = Session()

class PostService:
    def get_questions(self, data):
        try:
            course = session.query(Course).\
                filter_by(id=data["course_id"]).one()
        except NoResultFound:
            return {"status":0, "message":"No post founded", "posts":[]}
        except MultipleResultsFound:
            print("should not happen")

        if not session.query(
            exists().where(and_(UserCourse.username==data["username"], \
                UserCourse.course_id==data["course_id"]))).scalar():
            return {"status":0, "message":"User not registed", "posts":[]}

        post_list = []
        for p in course.posts:
            d = {}
            d["pid"] = p.id
            d["header"] = p.header
            d["summary"] = p.summary
            d["tags"] = []
            for tg in p.tags:
                d["tags"].append(tg.p_t.name)
            d["vote"] = p.vote_count
            d["time"] = str(p.create_time)
            d["author"] = p.post_username
            post_list.append(d)

        return {"status":1, "message":"Success", "posts":post_list}

    def get_post(self, pid, data):
        try:
            post = session.query(Post).filter_by(id=pid).one()
        except NoResultFound:
            return {"status":0, "message":"No post founded", "post":[]}
        except MultipleResultsFound:
            print("should not happen")

        if not session.query(
            exists().where(and_(UserCourse.username==data["username"], \
                UserCourse.course_id==data["course_id"]))).scalar():
            return {"status":0, "message":"User not registed", "posts":[]}

        p = {}
        p["pid"] = post.id
        p["header"] = post.header
        p["description"] = post.description
        p["tags"] = []
        for tg in post.tags:
            p["tags"].append(tg.p_t.name)
        p["replies"] = []
        for r in post.replies:
            rd = {}
            rd["rid"] = r.id
            rd["author"] = r.username
            rd["time"] = str(r.create_time)
            rd["vote"] = r.vote_count
            rd["answer"] = r.answer
            p["replies"].append(rd)

        return {"status":1, "message":"Success", "post":p}

    def delete_post(self, p_id):
        count = session.query(Post).filter_by(id=p_id).delete()
        session.commit()
        return {"status":1, "message":"Success"} if count == 1 \
            else {"status":0, "message":"Post does not exist"}

    def delete_reply(self, r_id):
        count = session.query(Reply).filter_by(id=r_id).delete()
        session.commit()
        return {"status":1, "message":"Success"} if count == 1 \
            else {"status":0, "message":"Reply does not exist"}

    def edit_post(self, pid, data):
        try:
            post = session.query(Post).filter_by(id=pid).one()
        except NoResultFound:
            return {"status":0, "message":"Post does not exist"}
        except MultipleResultsFound:
            print("should not happen")


    def edit_reply(self, rid, data):
        try:
            post = session.query(Post).filter_by(id=rid).one()
        except NoResultFound:
            return {"status":0, "message":"Reply does not exist"}
        except MultipleResultsFound:
            print("should not happen")

    def create_post(self, data):
        try:
            new_post = Post(
                header=data["header"], 
                summary=data["summary"], 
                description=data["description"], 
                post_username=data["author"], 
                course_id=data["course_id"],
                post_type_id=data["post_type_id"])
        except KeyError:
            return {"status":0, "message":"Invalid JSON field"}

        session.add(new_post)
        session.commit()
        return {"status":1, "message":"Success"}

    def create_reply(self, pid, data):
        try:
            new_reply = Reply(
                post_id=pid,
                answer=data["answer"], 
                username=data["username"])
        except KeyError:
            return {"status":0, "message":"Invalid JSON field"}

        session.add(new_reply)
        session.commit()
        return {"status":1, "message":"Success"}


