import sys
import os
import datetime
sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))
from sqlalchemy import create_engine, and_, exists
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm.exc import MultipleResultsFound
from Zocalo.database.database_setup import *

engine = create_engine('sqlite:///database/Zocalo.db')
# engine = create_engine('sqlite:///../database/Zocalo.db')
Session = sessionmaker(bind=engine)
session = Session()


class PostService:
    def get_all_questions(self, start=None):
        end = datetime.datetime.now()
        courses = session.query(Course).all()
        data = []
        for c in courses:
            course = {}
            course["cid"] = c.id
            course["course_name"] = c.course_name
            course["course_title"] = c.course_title
            course["posts"] = []
            for p in c.posts:
                if start is None or \
                   p.last_edit_time > start and p.last_edit_time < end:
                    p_d = {}
                    p_d["pid"] = p.id
                    p_d["description"] = p.description
                    p_d["tags"] = []
                    for tg in p.tags:
                        p_d["tags"].append(tg.p_t.name)
                    p_d["vote"] = p.vote_count
                    p_d["create_time"] = str(p.create_time)
                    p_d["last_edit_time"] = str(p.last_edit_time)
                    p_d["author"] = p.post_username
                    p_d["visibility"] = p.visibility_type.type
                    p_d["post_type"] = p.post_type.type
                    course["posts"].append(p_d)
            data.append(course)
        return data

    def get_questions(self, data):
        try:
            course = session.query(Course).\
                filter_by(id=data["course_id"]).one()
        except NoResultFound:
            print("Nothing found")
            return {"status": 0, "message": "No post founded", "posts": []}
        except MultipleResultsFound:
            print("should not happen")

        if not session.query(
            exists().where(and_(
                UserCourse.username == data["username"],
                UserCourse.course_id == data["course_id"]))).scalar():
            return {"status": 0, "message": "User not registed", "posts": []}

        post_list = []
        for p in course.posts:
            d = {}
            d["pid"] = p.id
            d["header"] = p.header
            d["description"] = p.description
            d["tags"] = []
            for tg in p.tags:
                d["tags"].append(tg.p_t.name)
            d["vote"] = p.vote_count
            d["time"] = str(p.create_time)
            d["author"] = p.post_username
            d["post_type"] = p.post_type.type
            post_list.append(d)

        return {"status": 1, "message": "Success", "posts": post_list}

    def get_all_answers(self, start=None):
        end = datetime.datetime.now()
        posts = session.query(Post).all()
        data = []
        for p in posts:
            post = {}
            post["answers"] = []
            for r in p.replies:
                if start is None or \
                   r.last_edit_time > start and r.last_edit_time < end:
                    reply = {}
                    reply["rid"] = r.id
                    reply["answer"] = r.answer
                    reply["vote"] = r.vote_count
                    reply["create_time"] = str(r.create_time)
                    reply["last_edit_time"] = str(r.last_edit_time)
                    reply["author"] = r.username
                    post["answers"].append(reply)

            if start is not None and \
               (post["answers"] == [] and p.last_edit_time < start):
                    continue

            post["pid"] = p.id
            post["header"] = p.header
            post["description"] = p.description
            post["vote"] = p.vote_count
            post["create_time"] = str(p.create_time)
            post["last_edit_time"] = str(p.last_edit_time)
            post["author"] = p.post_username
            post["visibility"] = p.visibility_type.type
            post["post_type"] = p.post_type.type
            post["tags"] = []
            for tg in p.tags:
                post["tags"].append(tg.p_t.name)
            post["cid"] = p.course.id
            post["course_name"] = p.course.course_name
            post["course_title"] = p.course.course_title
            data.append(post)
        return data

    def get_post(self, pid, data):
        try:
            post = session.query(Post).filter_by(id=pid).one()
        except NoResultFound:
            return {"status": 0, "message": "No post founded", "post": []}
        except MultipleResultsFound:
            print("should not happen")

        if not session.query(
            exists().where(and_(
                UserCourse.username == data["username"],
                UserCourse.course_id == data["course_id"]))).scalar():
            return {"status": 0, "message": "User not registed", "posts": []}

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

        return {"status": 1, "message": "Success", "post": p}

    def delete_post(self, p_id):
        count = session.query(Post).filter_by(id=p_id).delete()
        session.commit()
        return {"status": 1, "message": "Success"} if count == 1 \
            else {"status": 0, "message": "Post does not exist"}

    def delete_reply(self, r_id):
        count = session.query(Reply).filter_by(id=r_id).delete()
        session.commit()
        return {"status": 1, "message": "Success"} if count == 1 \
            else {"status": 0, "message": "Reply does not exist"}

    def edit_post(self, pid, data):
        try:
            post = session.query(Post).filter_by(id=pid).one()
        except NoResultFound:
            return {"status": 0, "message": "Post does not exist"}
        except MultipleResultsFound:
            print("should not happen")

        try:
            post.header = data["header"],
            post.summary = data["summary"],
            post.description = data["description"],
            post.post_username = data["author"],
            post.course_id = data["course_id"],
            post.post_type_id = data["post_type_id"]
        except KeyError:
            return {"status": 0, "message": "Invalid JSON field"}

        session.add(post)
        session.commit()
        return {"status": 1, "message": "Success"}

    def edit_reply(self, rid, data):
        try:
            reply = session.query(Reply).filter_by(id=rid).one()
        except NoResultFound:
            return {"status": 0, "message": "Reply does not exist"}
        except MultipleResultsFound:
            print("should not happen")

        try:
            reply.post_id = rid,
            reply.username = data["username"],
            reply.answer = data["answer"]
        except KeyError:
            return {"status": 0, "message": "Invalid JSON field"}

        session.add(reply)
        session.commit()
        return {"status": 1, "message": "Success"}

    def create_post(self, data):
        try:
            pt = session.query(PostType).filter_by(type=data["post_type"]).one()
        except KeyError:
            return {"status": 0, "message": "Invalid JSON field"}
        except NoResultFound:
            return {"status": 0, "message": "Invalid post type"}
        except MultipleResultsFound:
            print("should not happen")

        try:
            vt = session.query(VisibilityType).filter_by(type=data["visibility"]).one()
        except KeyError:
            return {"status": 0, "message": "Invalid JSON field"}
        except NoResultFound:
            return {"status": 0, "message": "Invalid visibility type"}
        except MultipleResultsFound:
            print("should not happen")

        pt_id = pt.id
        vt_id = vt.id
        try:
            new_post = Post(
                header=data["header"],
                description=data["description"],
                post_username=data["author"],
                course_id=data["course_id"],
                post_type_id=pt_id,
                visibility_type_id=vt_id
            )
        except KeyError:
            return {"status": 0, "message": "Invalid JSON field"}

        session.add(new_post)
        session.commit()
        return {"status": 1, "message": "Success"}

    def create_reply(self, pid, data):
        try:
            new_reply = Reply(
                post_id=pid,
                answer=data["answer"],
                username=data["username"]
            )
        except KeyError:
            return {"status": 0, "message": "Invalid JSON field"}

        session.add(new_reply)
        session.commit()
        return {"status": 1, "message": "Success"}
