def tempLoginReplyData():
	data = { "status":1,
    "message":"Success",
	"posts":
	[{"pid":41,"post": "Is there an exam tomorrow?" ,"description": "I am having a conflict. Do we have an exam tomorrow?", "tag": "Exam", "vote": 10, "time":"03-08-2018", "author": "Alice"},
	{"pid":51, "post": "What's SQLITE?" ,"description": "What's the best resource?", "tag": "Project 1", "vote": 10, "time":"03-06-2018", "author": "Sihan"},
	{"pid":63, "post": "Can we use Sqlite?" ,"description": "Wondering if we can use it or not", "tag": "Project 1", "vote": 10, "time":"03-05-2018", "author": "Karthik"},
	{"pid":67, "post": "What's difference betwen MongoDb and Sqlite?" ,"description": "Both seems cool.", "tag": "Project 1", "vote": 10, "time":"03-04-2018", "author": "Miles"},
	{"pid":12, "post": "Do we need to finish it before due date?" ,"description": "I am lazy.", "tag": "Exam", "vote": 10, "time":"03-03-2018", "author": "Alice"},
	{"pid":44, "post": "Is it necessary to do epic frontend for project?" ,"description": "I am a React fan.", "tag": "Just Alice Things", "vote": 10, "time":"03-02-2018", "author": "Alice"},
	{"pid":21, "post": "Should I join Google or GS?" ,"description": "I am confused!!!", "tag": "Just Alice Things", "vote": 10, "time":"03-01-2018", "author": "Alice"}]}

	return data

def tempPostData():
	data = {
	"posts":
	[{"pid":41,"post": "Is there an exam tomorrow?" ,"description": "I am having a conflict. Do we have an exam tomorrow?", "tag": "Exam", "vote": 10, "time":"03-08-2018", "author": "Alice"},
	{"pid":51, "post": "What's SQLITE?" ,"description": "What's the best resource?", "tag": "Project 1", "vote": 10, "time":"03-06-2018", "author": "Sihan"},
	{"pid":63, "post": "Can we use Sqlite?" ,"description": "Wondering if we can use it or not", "tag": "Project 1", "vote": 10, "time":"03-05-2018", "author": "Karthik"},
	{"pid":67, "post": "What's difference betwen MongoDb and Sqlite?" ,"description": "Both seems cool.", "tag": "Project 1", "vote": 10, "time":"03-04-2018", "author": "Miles"},
	{"pid":12, "post": "Do we need to finish it before due date?" ,"description": "I am lazy.", "tag": "Exam", "vote": 10, "time":"03-03-2018", "author": "Alice"},
	{"pid":44, "post": "Is it necessary to do epic frontend for project?" ,"description": "I am a React fan.", "tag": "Just Alice Things", "vote": 10, "time":"03-02-2018", "author": "Alice"},
	{"pid":21, "post": "Should I join Google or GS?" ,"description": "I am confused!!!", "tag": "Just Alice Things", "vote": 10, "time":"03-01-2018", "author": "Alice"}]}

	return data

def tempPostDetailData():
	data = {
	"pid":52,
	"post":"When is the exam and where is it?",
	"description":"I need the exact date and location for the exam.",
	"tags":["Exam","Logistics","Other"],
	"replies":
	[{"rid":0, "author":"Sihan", "time": "2018-03-31 20:40:00", "vote": 3, "answer":"Today is a good day for exam."},
	{"rid":1, "author":"Jack", "time": "2018-03-31 21:40:00", "vote": 5, "answer":"I believe it's in Gates G01, maybe I am wrong, can some TA confirm this?"},
	{"rid":2, "author":"Jane", "time": "2018-03-31 22:40:00", "vote": 11, "answer":"Disagree with the last post, I believe it's in startler 101. Correct me if I am wrong."},
	{"rid":3, "author":"Peter", "time": "2018-03-31 23:40:00", "vote": 22, "answer":"Disagree again with the reply above. It's a take home exam."},
	{"rid":4, "author":"Dan", "time": "2018-03-31 23:41:00", "vote": 0, "answer":"I don't know"},
	{"rid":5, "author":"Lilly", "time": "2018-03-31 23:46:22", "vote": 1, "answer":"Agree with floor 4."}]
	}

	return data
