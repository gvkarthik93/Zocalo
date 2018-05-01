"""This module is used to create database schema and lookup data"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from zocalo.database.schema import Base, Term, EmailSetting, Role, PostType, VisibilityType


def create_schema(base, engine):
    """
    Create database schema.
    """
    base.metadata.create_all(engine)
    return engine

def create_lookup_data(base, engine):
    """
    Create lookup data.
    """
    base.metadata.bind = engine
    Session = sessionmaker(bind=engine)
    session = Session()

    # term setting
    t1 = Term(name="Spring 2018")
    t2 = Term(name="Fall 2018")
    t3 = Term(name="Spring 2019")
    t4 = Term(name="Fall 2019")
    session.add(t1)
    session.add(t2)
    session.add(t3)
    session.add(t4)

    # email setting type
    es1 = EmailSetting(type="No email")
    es2 = EmailSetting(type="Only important")
    es3 = EmailSetting(type="Hourly digest")
    session.add(es1)
    session.add(es2)
    session.add(es3)

    # role type
    r1 = Role(type="Instructor")
    r2 = Role(type="TA")
    r3 = Role(type="Student")
    session.add(r1)
    session.add(r2)
    session.add(r3)

    # post type
    pt1 = PostType(type="question")
    pt2 = PostType(type="note")
    pt3 = PostType(type="poll")
    session.add(pt1)
    session.add(pt2)
    session.add(pt3)

    # visibility type
    vt1 = VisibilityType(type="public")
    vt2 = VisibilityType(type="private")
    session.add(vt1)
    session.add(vt2)

    session.commit()


if __name__ == '__main__':
    engine = create_engine('sqlite:///Zocalo.db')
    create_schema(Base, engine)
    create_lookup_data(Base, engine)

