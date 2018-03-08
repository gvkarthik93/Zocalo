from sqlalchemy import create_engine
from sqlalchemy import Column, String, Integer, Time, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class EmailSetting(Base):
    __tablename__ = 'email_setting'

    id = Column(Integer, primary_key=True)
    type = Column(String(100), nullable=False)

    # users = relationship("User", back_populates="email_setting")

    def __repr__(self):
        return "<Email_setting(id='%s', type='%s')>" % (
                self.id, self.type)

class User(Base):
    __tablename__ = 'users'

    user_name = Column(String(100), primary_key=True)
    password = Column(String(100), nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False) 
    email_setting_id = Column(Integer, ForeignKey("email_setting.id"))

    # email_setting = relationship("EmailSetting", back_populates="users")
    # courses = relationship("UserCourse", back_populates="users")

    
    def __repr__(self):
        return "<User(user_name='%s', password='%s', name='%s', email='%s')>" % (
                self.user_name, self.name, self.password, self.email)

class Course(Base):
    __tablename__ = 'courses'

    id = Column(Integer, primary_key=True)
    course_name = Column(String(100), nullable=False)
    school_name = Column(String(100), nullable=False)
    course_title = Column(String(100), nullable=False)

    # users = relationship("UserCourse", back_populates="courses")
    # post = relationship("Course", back_populates="posts")

    def __repr__(self):
        return "<Course(course_name='%s', school_name='%s', course_title='%s')>" % (
                self.course_name, self.school_name, self.course_title)

class UserCourse(Base):
    __tablename__ = 'user_course'

    user_name = Column(String(100), ForeignKey("users.user_name"), primary_key=True)
    course_id = Column(Integer, ForeignKey("courses.id"), primary_key=True)
    role_id = Column(Integer, ForeignKey("role.id"), nullable=False)

    # user = relationship("User", back_populates="courses")
    # course = relationship("Course", back_populates="users")

class Role(Base):
    __tablename__ = 'role'

    id = Column(Integer, primary_key=True)
    type = Column(String(100), nullable=False)

    def __repr__(self):
        return "<Role(id='%s', type='%s')>" % (
                self.id, self.type)


class VisibilityType(Base):
    __tablename__ = 'visibility_type'

    id = Column(Integer, primary_key=True)
    type = Column(String(100), nullable=False)

    # post = relationship("Post", back_populates="visibility_type")

    def __repr__(self):
        return "<VisibilityType(id='%s', type='%s')>" % (
                self.id, self.type)


class PostType(Base):
    __tablename__ = 'post_type'

    id = Column(Integer, primary_key=True)
    type = Column(String(100), nullable=False)

    # post = relationship("Post", back_populates="visibility_type")

    def __repr__(self):
        return "<PostType(id='%s', type='%s')>" % (
                self.id, self.type)


class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True)
    header = Column(String(100), nullable=False)
    short_description = Column(String(500))
    description = Column(String(1000))
    create_time = Column(Time, nullable=False)
    post_username = Column(String(100), ForeignKey("users.user_name"))
    answerer = Column(String(100), ForeignKey("users.user_name"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    post_type = Column(Integer, ForeignKey("post_type.id"))
    visibility = Column(Integer, ForeignKey("visibility_type.id"))
    vote_count = Column(Integer, default=0)

    # post_author = relationship("User", use_list=False, foreign_keys=[post_username], back_populates="posts")
    # answer_ta = relationship("User", use_list=False, foreign_keys=[answerer], back_populates="posts")
    # course = relationship("Course", back_populates="posts")
    # reply = relationship("Reply", back_populates="posts")

    def __repr__(self):
        return "<Post(header='%s', short_description='%s', description='%s', \
                create_time='%s', post_username='%s', answer='%s', vote_count='%s')>" % (
                    self.header, self.short_description, self.description, \
                    self.create_time, self.post_username, self.answer, self.vote_count)

class Reply(Base):
    __tablename__ = 'replies'

    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id"))    
    answer = Column(String(1000))
    create_time = Column(Time, nullable=False)
    username = Column(String(100), ForeignKey("users.user_name"))
    vote_count = Column(Integer, default=0)

    # post = relationship("Post", back_populates="replies")
    # user = relationship("User", use_list=False, back_populates="users")

    def __repr__(self):
        return "<Reply(postid='%s', answer='%s', create_time='%s', \
                username='%s', vote_count='%s')>" % ( 
                    self.post_id, self.answer, self.create_time, \
                    self.username, self.vote_count)


engine = create_engine('sqlite:///Zocalo.db')

Base.metadata.create_all(engine)
