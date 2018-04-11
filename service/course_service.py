import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))
import json
from sqlalchemy import exists
from sqlalchemy import create_engine, and_
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm.exc import MultipleResultsFound
from Zocalo.database.database_setup import *

engine = create_engine('sqlite:///database/Zocalo.db')
Session = sessionmaker(bind=engine)
session = Session()

class CourseService:
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
