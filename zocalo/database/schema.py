import datetime
from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy import false
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


class UserPost(Base):
    __tablename__ = 'user_post'

    username = Column(String(100), ForeignKey("users.username"), primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id"), primary_key=True)
    viewed = Column(Boolean, server_default=false())
    vote = Column(Integer, default=0)

    u_p = relationship("Post", back_populates="users")
    p_u = relationship("User", back_populates="posts")


class UserReply(Base):
    __tablename__ = 'user_reply'

    username = Column(String(100), ForeignKey("users.username"), primary_key=True)
    reply_id = Column(Integer, ForeignKey("replies.id"), primary_key=True)
    vote = Column(Integer, default=0)

    u_r = relationship("Reply", back_populates="users")
    r_u = relationship("User", back_populates="replies")


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
    school_id = Column(Integer, ForeignKey("schools.id"))

    email_setting = relationship("EmailSetting", back_populates="users")
    courses = relationship("UserCourse", back_populates="c_u")
    answers = relationship("Reply", back_populates="user")
    school = relationship("School", back_populates="users")
    posts = relationship("UserPost", back_populates="p_u")
    replies = relationship("UserReply", back_populates="r_u")

    def __repr__(self):
        return "<User(username='%s', password='%s', name='%s', email='%s')>" % (
            self.username, self.name, self.password, self.email)


class Term(Base):
    __tablename__ = 'term'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)

    courses = relationship("Course", back_populates="term")


class Course(Base):
    __tablename__ = 'courses'

    id = Column(Integer, primary_key=True)
    course_name = Column(String(100), nullable=False)
    school_id = Column(Integer, ForeignKey("schools.id"))
    course_title = Column(String(100), nullable=False)
    term_id = Column(Integer, ForeignKey("term.id"))

    users = relationship("UserCourse", back_populates="u_c")
    posts = relationship("Post", back_populates="course")
    tags = relationship("Tag", back_populates="course")
    school = relationship("School", back_populates="courses")
    term = relationship("Term", back_populates="courses")

    def __repr__(self):
        return "<Course(course_name='%s', school_id='%s', course_title='%s')>" % (
            self.course_name, self.school_id, self.course_title)


class School(Base):
    __tablename__ = 'schools'

    id = Column(Integer, primary_key=True)
    school_name = Column(String(100), nullable=False)

    courses = relationship("Course", back_populates="school")
    users = relationship("User", back_populates="school")

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
        return "<Role(id='%s', type='%s')>" % (
            self.id, self.type)


class PostType(Base):
    __tablename__ = 'post_type'

    id = Column(Integer, primary_key=True)
    type = Column(String(100), nullable=False)

    posts = relationship("Post", back_populates="post_type")

    def __repr__(self):
        return "<PostType(id='%s', type='%s')>" % (
            self.id, self.type)


class PostTag(Base):
    __tablename__ = 'post_tag'

    post_id = Column(Integer, ForeignKey("posts.id"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tag.id"), primary_key=True)

    p_t = relationship("Tag", back_populates="posts")
    t_p = relationship("Post", back_populates="tags")


class Tag(Base):
    __tablename__ = 'tag'

    id = Column(Integer, primary_key=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    name = Column(String(50), nullable=False)

    course = relationship("Course", back_populates="tags")
    posts = relationship("PostTag", cascade="all, delete-orphan", back_populates="p_t")

    def __repr__(self):
        return "<Tag(id='%d', course_id='%d'), name='%s'>" % (
            self.id, self.course_id)


class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True)
    header = Column(String(100), nullable=False)
    description = Column(String(1000))
    create_time = Column(DateTime)
    last_edit_time = Column(DateTime)
    up_vote = Column(Integer, default=0)
    down_vote = Column(Integer, default=0)
    view_count = Column(Integer, default=0)
    post_username = Column(String(100), ForeignKey("users.username"))
    answerer_username = Column(String(100), ForeignKey("users.username"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    post_type_id = Column(Integer, ForeignKey("post_type.id"))
    visibility_type_id = Column(Integer, ForeignKey("visibility_type.id"))

    visibility_type = relationship("VisibilityType", back_populates="posts")
    post_type = relationship("PostType", back_populates="posts")
    course = relationship("Course", back_populates="posts")
    replies = relationship("Reply",cascade="all, delete-orphan", back_populates="post")
    tags = relationship("PostTag", cascade="all, delete-orphan", back_populates="t_p")
    users = relationship("UserPost", cascade="all, delete-orphan", back_populates="u_p")
    post_author = relationship("User", foreign_keys=[post_username])
    answer_ta = relationship("User", foreign_keys=[answerer_username])

    def __repr__(self):
        return "<Post(header='%s', description='%s', \
                create_time='%s', post_username='%s', answer='%s')>" % (
            self.header, self.description,
            self.create_time, self.post_username, self.answerer_username)


class Reply(Base):
    __tablename__ = 'replies'

    __mapper_args__ = {
        'confirm_deleted_rows': False
    }

    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    username = Column(String(100), ForeignKey("users.username"))
    answer = Column(String(1000))
    create_time = Column(DateTime)
    last_edit_time = Column(DateTime)
    up_vote = Column(Integer, default=0)
    down_vote = Column(Integer, default=0)

    post = relationship("Post", back_populates="replies")
    user = relationship("User", back_populates="answers")
    users = relationship("UserReply", cascade="all, delete-orphan", back_populates="u_r")

    def __repr__(self):
        return "<Reply(postid='%s', answer='%s', create_time='%s', \
                username='%s')>" % (
            self.post_id, self.answer, self.username,
            self.create_time)
