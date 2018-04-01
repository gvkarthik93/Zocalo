from sqlalchemy import create_engine
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class EmailSetting(Base):
    __tablename__ = 'email_setting'

    id = Column(Integer, primary_key=True)
    type = Column(String(100), nullable=False)

    users = relationship("User", back_populates="email_setting")

    def __repr__(self):
        return "<Email_setting(id='%s', type='%s')>" % (
                self.id, self.type)


class UserCourse(Base):
    __tablename__ = 'user_course'

    username = Column(String(100), ForeignKey("users.username"), primary_key=True)
    course_id = Column(Integer, ForeignKey("courses.id"), primary_key=True)
    role_id = Column(Integer, ForeignKey("role.id"), nullable=False)
    
    c_u = relationship("User", back_populates="courses")
    u_c = relationship("Course", back_populates="users")


class User(Base):
    __tablename__ = 'users'

    username = Column(String(100), primary_key=True)
    password = Column(String(100), nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False) 
    email_setting_id = Column(Integer, ForeignKey("email_setting.id"))

    email_setting = relationship("EmailSetting", back_populates="users")
    courses = relationship("UserCourse", back_populates="c_u")
    replies = relationship("Reply", back_populates="user")

    def __repr__(self):
        return "<User(username='%s', password='%s', name='%s', email='%s')>" % (
                self.username, self.name, self.password, self.email)

class Course(Base):
    __tablename__ = 'courses'

    id = Column(Integer, primary_key=True)
    course_name = Column(String(100), nullable=False)
    school_id = Column(Integer, ForeignKey("schools.id"))
    course_title = Column(String(100), nullable=False)

    users = relationship("UserCourse", back_populates="u_c")
    posts = relationship("Post", back_populates="course")

    school = relationship("School", back_populates="courses")

    def __repr__(self):
        return "<Course(course_name='%s', school_id='%s', course_title='%s')>" % (
                self.course_name, self.school_id, self.course_title)

class School(Base):
    __tablename__ = 'schools'

    id = Column(Integer, primary_key=True)
    school_name = Column(String(100), nullable=False)

    courses = relationship("Course", back_populates="school")

    def __repr__(self):
        return "<School(id='%s', school_name='%s')>" % (
                self.id, self.school_name)

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

    posts = relationship("Post", back_populates="visibility_type")

    def __repr__(self):
        return "<VisibilityType(id='%s', type='%s')>" % (
                self.id, self.type)


class PostType(Base):
    __tablename__ = 'post_type'

    id = Column(Integer, primary_key=True)
    type = Column(String(100), nullable=False)

    posts = relationship("Post", back_populates="post_type")

    def __repr__(self):
        return "<PostType(id='%s', type='%s')>" % (
                self.id, self.type)


class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True)
    header = Column(String(100), nullable=False)
    summary = Column(String(500))
    description = Column(String(1000))
    create_time = Column(DateTime, default=func.now())
    tag = Column(String(100))
    vote_count = Column(Integer, default=0)
    post_username = Column(String(100), ForeignKey("users.username"))
    answerer_username = Column(String(100), ForeignKey("users.username"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    post_type_id = Column(Integer, ForeignKey("post_type.id"))
    visibility_type_id = Column(Integer, ForeignKey("visibility_type.id"))

    visibility_type = relationship("VisibilityType", back_populates="posts")
    post_type = relationship("PostType", back_populates="posts")
    course = relationship("Course", back_populates="posts")
    replies = relationship("Reply", back_populates="post")
    
    post_author = relationship("User", foreign_keys=[post_username])
    answer_ta = relationship("User", foreign_keys=[answerer_username])
    
    def __repr__(self):
        return "<Post(header='%s', summary='%s', description='%s', \
                create_time='%s', post_username='%s', answer='%s', vote_count='%s')>" % (
                    self.header, self.summary, self.description, \
                    self.create_time, self.post_username, self.answerer_username, 
                    self.vote_count)

class Reply(Base):
    __tablename__ = 'replies'

    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    username = Column(String(100), ForeignKey("users.username"))
    answer = Column(String(1000))
    create_time = Column(DateTime, default=func.now())
    vote_count = Column(Integer, default=0)

    post = relationship("Post", back_populates="replies")
    user = relationship("User", back_populates="replies")

    def __repr__(self):
        return "<Reply(postid='%s', answer='%s', create_time='%s', \
                username='%s', vote_count='%s')>" % ( 
                    self.post_id, self.answer, self.username, \
                    self.create_time, self.vote_count)


engine = create_engine('sqlite:///Zocalo.db')

Base.metadata.create_all(engine)
