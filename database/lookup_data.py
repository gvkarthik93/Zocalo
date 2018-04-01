from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database_setup import *

engine = create_engine('sqlite:///Zocalo.db')
Base.metadata.bind = engine
Session = sessionmaker(bind=engine)
session = Session()

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
pt1 = PostType(type="Public")
pt2 = PostType(type="Private")
pt3 = PostType(type="Note")
pt4 = PostType(type="Poll")
session.add(pt1)
session.add(pt2)
session.add(pt3)
session.add(pt4)

# # visbility type
# vt1 = VisibilityType(type=)
# vt2 = VisibilityType(type=)

session.commit()

