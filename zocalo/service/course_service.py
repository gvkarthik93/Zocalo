from sqlalchemy import exists
from sqlalchemy import create_engine, and_
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm.exc import MultipleResultsFound
from zocalo.database.schema import *


engine = create_engine('sqlite:///Zocalo.db')
Session = sessionmaker(bind=engine)
session = Session()


class CourseService:
    def check_register(self, username, cid):
        return session.query(
            exists().where(and_(
                UserCourse.username == username,
                UserCourse.course_id == cid))).scalar()

    def create_tag(self, cid, data):
        if not self.check_register(data["username"], cid):
            return {"status": 0, "message": "User not registed"}

        # check duplicate tag name
        try:
            count = session.query(exists().where(and_(
                Tag.course_id == cid,
                Tag.name == data["name"]))).scalar()
        except KeyError:
            return {"status": 0, "message": "Invalid JSON field"}

        if count != 0:
            return {"status": 0, "message": "Tag already existed"}

        try:
            new_tag = Tag(
                name=data["name"],
                course_id=cid
            )
        except KeyError:
            return {"status": 0, "message": "Invalid JSON field"}

        session.add(new_tag)
        session.commit()
        return {"status": 1, "message": "Success"}

    def edit_tag(self, data):
        pass

    def delete_tag(self, cid, tag_name, data):
        if not self.check_register(data["username"], cid):
            return {"status": 0, "message": "User not registed"}

        try:
            tag = session.query(Tag).filter_by(course_id=cid). \
                filter_by(name=tag_name).one()
        except NoResultFound:
            return {"status": 0, "message": "No tag founded"}
        except MultipleResultsFound:
            print("should not happen")

        session.delete(tag)
        session.commit()
        return {"status": 1, "message": "Success"}


    #data: c_name, s_id, c_title
    #input: course_name, school_id, course_title
    #output: status, message
    def createCourse(self, data):
        try:
            #check if the course already exist for that school
            if session.query(
                exists().where(and_(Course.school_id==data["s_id"], \
                    Course.course_name==data["c_name"]))).scalar():
                return {"status":0, "message":"Course name already exists for this school"}
            #check if course title already exist for that school
            if session.query(
                exists().where(and_(Course.school_id==data["s_id"], \
                    Course.course_title==data["c_title"]))).scalar():
                return {"status":0, "message":"Course title already exists for this school"}

            new_course = Course(
                course_name = data["c_name"],
                school_id = data["s_id"],
                course_title = data["c_title"]
            )
        except KeyError:
                return {"status":0, "message":"Invalid JSON field"}

        session.add(new_course)
        session.commit()
        return {"status":1, "message":"Course added!"}

    #data: u_name
    #input: username
    #output: status, message, course_list
    def getCourse(self,data):
        #get school_id of user
        try:
            user = session.query(User).\
                filter_by(user_name=data["u_name"]).one()
            sch_id = user.school_id
        except NoResultFound:
            return {"status":0, "message":"User not founded", "course_list":[]}
        except MultipleResultsFound:
            print("should not happen")

        #find courses associated with school_id    
        try:
            courses = session.query(Course).\
                filter_by(school_id=sch_id).one()
        except NoResultFound:
            return {"status":0, "message":"No courses found for this school", "course_list":[]}
        except MultipleResultsFound:
            print("should not happen")

        course_list = []
        for c in courses:
            d = {}
            d["course_id"] = c.id
            d["course_name"] = c.course_name
            course_list.append(d)

        return {"status":1, "message":"Success", "course_list":course_list}

    #data: u_name, c_id
    #input: username, course
    #add user,course to userCourse table 
    #output: status, message
    #assume user and course_id are valid inputs
    def enrollStudent(self,data):
        #role_id set to 1 because enrollUser is for enrolling students
        new_enrollment = UserCourse(
            user_name = data["u_name"],
            course_id = data["c_id"],
            role_id = 1
        )
        session.add(new_enrollment)
        session.commit()
        return {"status":1, "message":"Success"}
