import json
from sqlalchemy import create_engine, and_
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm.exc import MultipleResultsFound
from database_setup import Base, Course, Post, Reply

engine = create_engine('sqlite:///Zocalo.db')
Session = sessionmaker(bind=engine)
session = Session()

class PostService:

    def get_questions(self, s_name, c_name):
        try:
            course = session.query(Course).\
            filter_by(school_name=s_name).filter_by(course_name=c_name).one()
        except NoResultFound:
            return (0, "No post founded")
        except MultipleResultsFound:
            print("should not happen")

        resp = {}
        for p in course.posts:
            resp[p.id] = {}
            resp[p.id]["header"] = p.header
            resp[p.id]["summary"] = p.summary
            resp[p.id]["tag"] = p.tag
            resp[p.id]["vote"] = p.vote_count
            resp[p.id]["time"] = str(p.create_time)
            resp[p.id]["author"] = p.post_username

        return (1, json.dumps(resp))

    def get_post(self, p_id):
        try:
            post = session.query(Post).filter_by(id=p_id).one()
        except NoResultFound:
            return (0, "Post does not exist")
        except MultipleResultsFound:
            print("should not happen")

        resp = {}
        resp["post_desc"] = post.description 
        for r in post.replies:
            resp[r.id] = {}
            resp[r.id]["answer"] = r.answer
            resp[r.id]["vote"] = r.vote_count
            resp[r.id]["time"] = str(r.create_time)
            resp[r.id]["author"] = r.username

        return (1, json.dumps(resp))

    def delete_post(self, p_id):
        count = session.query(Post).filter_by(id=p_id).delete()
        session.commit()
        return (1, "Success") if count == 1 else (0, "Post does not exist")

    def delete_reply(self, r_id):
        count = session.query(Reply).filter_by(id=r_id).delete()
        session.commit()
        return (1, "Success") if count == 1 else (0, "Reply does not exist")

    def edit_post(self, p_id, d):
        try:
            post = session.query(Post).filter_by(id=p_id).one()
        except NoResultFound:
            return (0, "Post does not exist")
        except MultipleResultsFound:
            print("should not happen")

        # Need a way to check if keys in d is ok


    def edit_reply(self, r_id, d):
        try:
            post = session.query(Post).filter_by(id=p_id).one()
        except NoResultFound:
            return (0, "Post does not exist")
        except MultipleResultsFound:
            print("should not happen")

        # Need a way to check if keys in d is ok

    def create_post(self, data):
        try:
            new_post = Post(
                header=data["header"], 
                summary=data["summary"], 
                description=data["desc"], 
                post_username=data["author"], 
                course_id=data["cid"])
        except:
            return (0, "Fail to create post")

        session.add(new_post)
        session.commit()
        return (1, "Success")

    def create_reply(self, data):
        try:
            new_reply = Reply(
                post_id=data["pid"],
                answer=data["answer"], 
                username=data["author"])
        except:
            return (0, "Fail to create reply")

        session.add(new_reply)
        session.commit()
        return (1, "Success")




