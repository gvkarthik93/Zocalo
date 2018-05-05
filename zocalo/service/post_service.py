import sys
import os
import datetime
from sqlalchemy import create_engine, and_, exists
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm.exc import MultipleResultsFound
from zocalo.database.schema import *

engine = create_engine('sqlite:///Zocalo.db')
Session = sessionmaker(bind=engine)
session = Session()


class PostService:
    def check_register(self, username, cid):
        return session.query(
            exists().where(and_(
                UserCourse.username == username,
                UserCourse.course_id == cid))).scalar()

    def get_all_data(self, start=None):
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
                    reply["up_vote"] = r.up_vote
                    reply["down_vote"] = r.down_vote
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
            post["up_vote"] = p.up_vote
            post["down_vote"] = p.down_vote
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

    def get_questions(self, data):
        try:
            course = session.query(Course).\
                filter_by(id=data["course_id"]).one()
        except NoResultFound:
            print("Nothing found")
            return {"status": 0, "message": "No post founded", "posts": []}
        except MultipleResultsFound:
            print("should not happen")

        if not self.check_register(data["username"], data["course_id"]):
            return {"status": 0, "message": "User not registed", "posts": []}

        post_list = []
        for p in course.posts:
            if p.visibility_type.type == "public" or \
                p.visibility_type.type == "private" and \
                data["username"] == p.post_username:
                d = {}
                d["pid"] = p.id
                d["header"] = p.header
                d["description"] = p.description
                d["tags"] = []
                for tg in p.tags:
                    d["tags"].append(tg.p_t.name)
                d["vote"] = p.up_vote
                d["time"] = str(p.create_time)
                d["author"] = p.post_username
                d["post_type"] = p.post_type.type
                d["visibility"] = p.visibility_type.type
                post_list.append(d)

        return {"status": 1, "message": "Success", "posts": post_list}

    def get_post(self, pid, data):
        try:
            post = session.query(Post).filter_by(id=pid).one()
        except NoResultFound:
            return {"status": 0, "message": "No post founded", "post": []}
        except MultipleResultsFound:
            print("should not happen")

        if not self.check_register(data["username"], data["course_id"]):
            return {"status": 0, "message": "User not registed", "posts": []}

        try:
            user_post = session.query(UserPost).filter_by(
                username=data["username"]).filter_by(post_id=pid).one()
            user_post.viewed = True
        except NoResultFound:
            user_post = UserPost(
                post_id=pid,
                username=data["username"],
                viewed=True,
                vote=0
            )
        except MultipleResultsFound:
            print("should not happen")

        post.view_count += 1
        session.add(post)
        session.add(user_post)
        session.commit()

        p = {}
        p["pid"] = post.id
        p["header"] = post.header
        p["description"] = post.description
        p["post_type"] = post.post_type.type
        p["visibility"] = post.visibility_type.type
        p["time"] = str(post.last_edit_time)
        p["voted"] = user_post.vote
        p["vote"] = post.up_vote
        p["author"] = post.post_username
        p["tags"] = []
        for tg in post.tags:
            p["tags"].append(tg.p_t.name)
        p["replies"] = []
        for r in post.replies:
            try:
                user_reply = session.query(UserReply).filter_by(
                    username=data["username"]).filter_by(reply_id=r.id).one()
            except NoResultFound:
                user_reply = UserReply(
                    reply_id=r.id,
                    username=data["username"]
                )
            except MultipleResultsFound:
                print("should not happen")
            session.add(user_reply)
            session.commit()
            rd = {}
            rd["rid"] = r.id
            rd["author"] = r.username
            rd["time"] = str(r.last_edit_time)
            rd["vote"] = r.up_vote
            rd["voted"] = user_reply.vote
            rd["answer"] = r.answer
            p["replies"].append(rd)

        return {"status": 1, "message": "Success", "post": p}

    def delete_post(self, p_id, data):
        try:
            post = session.query(Post).filter_by(id=p_id).one()
        except NoResultFound:
            return {"status": 0, "message": "No post founded"}
        except MultipleResultsFound:
            print("should not happen")

        if not self.check_register(data["username"], post.course_id):
            return {"status": 0, "message": "User not registed"}

        if post.post_username != data["username"]:
            return {"status": 0, "message": "Not the author of the post"}

        session.delete(post)
        session.commit()
        return {"status": 1, "message": "Success"}

    def delete_reply(self, r_id, data):
        try:
            reply = session.query(Reply).filter_by(id=r_id).one()
        except NoResultFound:
            return {"status": 0, "message": "No reply founded"}
        except MultipleResultsFound:
            print("should not happen")

        if not self.check_register(data["username"], reply.post.course_id):
            return {"status": 0, "message": "User not registed"}

        if reply.username != data["username"]:
            return {"status": 0, "message": "Not the author of the reply"}

        session.delete(reply)
        session.commit()
        return {"status": 1, "message": "Success"}

    def edit_post(self, pid, data):
        try:
            post = session.query(Post).filter_by(id=pid).one()
        except NoResultFound:
            return {"status": 0, "message": "Post does not exist"}
        except MultipleResultsFound:
            print("should not happen")

        if not self.check_register(data["username"], post.course_id):
            return {"status": 0, "message": "User not registed"}

        if post.post_username != data["username"]:
            return {"status": 0, "message": "Not the author of the post"}

        try:
            vt = session.query(VisibilityType).filter_by(type=data["visibility"]).one()
        except KeyError:
            return {"status": 0, "message": "Invalid JSON field"}
        except NoResultFound:
            return {"status": 0, "message": "Invalid visibility type"}
        except MultipleResultsFound:
            print("should not happen")

        try:
            post.header = data["header"]
            post.description = data["description"]
            post.visibility_type_id = vt.id
            post.last_edit_time = datetime.datetime.now()
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

        if not self.check_register(data["username"], reply.post.course_id):
            return {"status": 0, "message": "User not registed"}

        if reply.username != data["username"]:
            return {"status": 0, "message": "Not the author of the reply"}

        try:
            reply.answer = data["answer"]
            reply.last_edit_time = datetime.datetime.now()
        except KeyError:
            return {"status": 0, "message": "Invalid JSON field"}

        session.add(reply)
        session.commit()
        return {"status": 1, "message": "Success"}

    def create_post(self, data):
        if not self.check_register(data["username"], data["course_id"]):
            return {"status": 0, "message": "User not registed"}

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
                post_username=data["username"],
                course_id=data["course_id"],
                post_type_id=pt_id,
                visibility_type_id=vt_id,
                last_edit_time=datetime.datetime.now(),
                create_time=datetime.datetime.now()
            )
        except KeyError:
            return {"status": 0, "message": "Invalid JSON field"}

        session.add(new_post)
        session.commit()
        return {"status": 1, "message": "Success"}

    def create_reply(self, pid, data):
        try:
            post = session.query(Post).filter_by(id=pid).one()
        except NoResultFound:
            return {"status": 0, "message": "No post founded", "post": []}
        except MultipleResultsFound:
            print("should not happen")

        if not self.check_register(data["username"], post.course_id):
            return {"status": 0, "message": "User not registed"}

        try:
            new_reply = Reply(
                post_id=pid,
                answer=data["answer"],
                username=data["username"],
                create_time=datetime.datetime.now(),
                last_edit_time=datetime.datetime.now()
            )
        except KeyError:
            return {"status": 0, "message": "Invalid JSON field"}

        session.add(new_reply)
        session.commit()
        return {"status": 1, "message": "Success"}

    def update_post_vote(self, pid, data):
        try:
            post = session.query(Post).filter_by(id=pid).one()
        except NoResultFound:
            return {"status": 0, "message": "No corresponding post founded"}
        except MultipleResultsFound:
            print("should not happen")

        try:
            user_post = session.query(UserPost).filter_by(
                username=data["username"]).filter_by(post_id=pid).one()
            user_post.viewed = True
        except NoResultFound:
            user_post = UserPost(
                post_id=pid,
                username=data["username"],
                viewed=True,
                vote=0
            )
        except MultipleResultsFound:
            print("should not happen")

        # check if user has already voted the post
        try:
            if data["type"] == "up":
                if user_post.vote == 0:
                    post.up_vote += 1
                    user_post.vote = 1
                elif user_post.vote == 1:
                    return {"status": 0, "message": "Already upvoted"}
                else:
                    post.up_vote += 1
                    post.down_vote -= 1
                    user_post.vote = 1
            elif data["type"] == "down":
                if user_post.vote == 0:
                    post.down_vote += 1
                    user_post.vote = -1
                elif user_post.vote == -1:
                    return {"status": 0, "message": "Already downvoted"}
                else:
                    post.up_vote -= 1
                    post.down_vote += 1
                    user_post.vote = -1
            else:
                return {"status": 0, "message": "Invalid JSON field"}
        except:
            return {"status": 0, "message": "Invalid JSON field"}

        session.add(post)
        session.add(user_post)
        session.commit()
        return {"status": 1, "message": "Success"}

    def update_reply_vote(self, rid, data):
        try:
            reply = session.query(Reply).filter_by(id=rid).one()
        except NoResultFound:
            return {"status": 0, "message": "No corresponding post founded"}
        except MultipleResultsFound:
            print("should not happen")

        try:
            user_reply = session.query(UserReply).filter_by(
                username=data["username"]).filter_by(reply_id=rid).one()
        except NoResultFound:
            user_reply = UserReply(
                reply_id=rid,
                username=data["username"],
                vote=0
            )
        except MultipleResultsFound:
            print("should not happen")

        # check if user has already voted the reply
        try:
            if data["type"] == "up":
                if user_reply.vote == 0:
                    reply.up_vote += 1
                    user_reply.vote = 1
                elif user_reply.vote == 1:
                    return {"status": 0, "message": "Already upvoted"}
                else:
                    reply.down_vote -= 1
                    reply.up_vote += 1
                    user_reply.vote = 1
            elif data["type"] == "down":
                if user_reply.vote == 0:
                    reply.down_vote += 1
                    user_reply.vote = -1
                elif user_reply.vote == -1:
                    return {"status": 0, "message": "Already downvoted"}
                else:
                    reply.down_vote += 1
                    reply.up_vote -= 1
                    user_reply.vote = -1
            else:
                return {"status": 0, "message": "Invalid JSON field"}
        except:
            return {"status": 0, "message": "Invalid JSON field"}

        session.add(reply)
        session.add(user_reply)
        session.commit()
        return {"status": 1, "message": "Success"}
