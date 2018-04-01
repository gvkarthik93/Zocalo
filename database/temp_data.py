def tempLoginReplyData():
	data = { "status":1,
    "message":"Success",
	"courses":
	[{"course_id": 1, "course_name": "CS 5412",  "course_title": "Cloud Computing"},
    {"course_id": 2, "course_name": "CS 5413",  "course_title": "Software Computing"}]}

	return data

def tempPostData():
	data = { "status":1,
    "message":"Success",
	"posts":
	[{"pid":41,"header": "Is there an exam tomorrow?" ,"summary": "I am having a conflict. Do we have an exam tomorrow?", "tag": "Exam", "vote": 10, "time":"03-08-2018", "author": "Alice"},
	{"pid":51, "header": "What's SQLITE?" ,"summary": "What's the best resource?", "tag": "Project 1", "vote": 10, "time":"03-06-2018", "author": "Sihan"},
	{"pid":63, "header": "Can we use Sqlite?" ,"summary": "Wondering if we can use it or not", "tag": "Project 1", "vote": 10, "time":"03-05-2018", "author": "Karthik"},
	{"pid":67, "header": "What's difference betwen MongoDb and Sqlite?" ,"summary": "Both seems cool.", "tag": "Project 1", "vote": 10, "time":"03-04-2018", "author": "Miles"},
	{"pid":12, "header": "Do we need to finish it before due date?" ,"summary": "I am lazy.", "tag": "Exam", "vote": 10, "time":"03-03-2018", "author": "Alice"},
	{"pid":44, "header": "Is it necessary to do epic frontend for project?" ,"summary": "I am a React fan.", "tag": "Just Alice Things", "vote": 10, "time":"03-02-2018", "author": "Alice"},
	{"pid":21, "header": "Should I join Google or GS?" ,"summary": "I am confused!!!", "tag": "Just Alice Things", "vote": 10, "time":"03-01-2018", "author": "Alice"}]}

	return data

def tempPostDetailData():
	data = { "status":1,
	    "message":"Success",
		"post": {
			"pid":52,
			"header":"When is the exam and where is it?",
			"description":"(D)I need the exact date and location for the exam.",
			"tags":["Exam","Logistics","Other"],
			"replies":
			[{"rid":0, "author":"Sihan", "time": "2018-03-31 20:40:00", "vote": 3, "answer":"Today is a good day for exam."},
			{"rid":1, "author":"Jack", "time": "2018-03-31 21:40:00", "vote": 5, "answer":"I believe it's in Gates G01, maybe I am wrong, can some TA confirm this?"},
			{"rid":2, "author":"Jane", "time": "2018-03-31 22:40:00", "vote": 11, "answer":"Disagree with the last post, I believe it's in startler 101. Correct me if I am wrong."},
			{"rid":3, "author":"Peter", "time": "2018-03-31 23:40:00", "vote": 22, "answer":"Disagree again with the reply above. It's a take home exam."},
			{"rid":4, "author":"Dan", "time": "2018-03-31 23:41:00", "vote": 0, "answer":"I don't know"},
			{"rid":5, "author":"Lilly", "time": "2018-03-31 23:46:22", "vote": 1, "answer":"Agree with floor 4."}]
		}
	}

	return data
