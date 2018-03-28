import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))
import json
from sqlalchemy import exists
from sqlalchemy import create_engine, and_
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm.exc import MultipleResultsFound
from Zocalo.db.database_setup import *
# from database_setup import Base, Course, Role, UserCourse, User

engine = create_engine('sqlite:///../db/Zocalo.db')
Session = sessionmaker(bind=engine)
session = Session()

class CourseService:
    def createCourse(self, c_name, s_name, c_title, c_id):
        
        #might have to create a table for schools, so we know whether or not it is a valid school before creating a course 
        #check if c_id is already used
        course_exist = session.query(exists().where(Course.id == c_id)).scalar()
        if course_exist:
            return(0, "Error: This course already exist in db")
        else:
            new_course = Course(
                id = c_id,
                course_name = c_name,
                school_name = s_name,
                course_title = c_title
            )
            session.add(new_course)
            session.commit()
            return(1,"Success")
    
    def enrollUser(self, u_name, c_id, r_id):
        
        #check if user is in user table
        user_exist = session.query(exists().where(User.user_name == u_name)).scalar()
        course_exist = session.query(exists().where(Course.id == c_id)).scalar() 
        #check if course_id exists
        
        if user_exist and course_exist:        
            new_enrollment = UserCourse(
                user_name = u_name,
                course_id = c_id,
                role_id = r_id
            )
            session.add(new_enrollment)
            session.commit()
            return(1,"Success")
        elif user_exist == False and course_exist == False:
            return(0, "Error: User and Course not in DB")
        elif user_exist == False:
            return(0, "Error: User not in DB")
        else:
            return(0, "Error: Course not in DB")
        
        