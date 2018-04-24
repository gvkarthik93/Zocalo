from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database_setup import *

engine = create_engine('sqlite:///Zocalo.db')
Base.metadata.bind = engine
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
pt1 = PostType(type="post")
pt2 = PostType(type="note")
pt3 = PostType(type="poll")
session.add(pt1)
session.add(pt2)
session.add(pt3)


session.commit()
