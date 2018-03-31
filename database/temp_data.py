def tempData():
	data = {"ID1":{"Post": "Is there an exam tomorrow?" ,"Desc": "I am having a conflict. Do we have an exam tomorrow?", "TAG": "Exam", "VOTE": 10, "Time":"03-08-2018", "Author": "Alice"},
	"ID2":{"Post": "What's SQLITE?" ,"Desc": "What's the best resource?", "TAG": "Project 1", "VOTE": 10, "Time":"03-06-2018", "Author": "Sihan"},
	"ID3":{"Post": "Can we use Sqlite?" ,"Desc": "Wondering if we can use it or not", "TAG": "Project 1", "VOTE": 10, "Time":"03-05-2018", "Author": "Karthik"},
	"ID4":{"Post": "What's difference betwen MongoDb and Sqlite?" ,"Desc": "Both seems cool.", "TAG": "Project 1", "VOTE": 10, "Time":"03-04-2018", "Author": "Miles"},
	"ID5":{"Post": "Do we need to finish it before due date?" ,"Desc": "I am lazy.", "TAG": "Exam", "VOTE": 10, "Time":"03-03-2018", "Author": "Alice"},
	"ID6":{"Post": "Is it necessary to do epic frontend for project?" ,"Desc": "I am a React fan.", "TAG": "Just Alice Things", "VOTE": 10, "Time":"03-02-2018", "Author": "Alice"},
	"ID7":{"Post": "Should I join Google or GS?" ,"Desc": "I am confused!!!", "TAG": "Just Alice Things", "VOTE": 10, "Time":"03-01-2018", "Author": "Alice"}}

	return data

def tempPostData():
	data = {
	"pid":52, 
	"description":"I need the exact date and location for the exam.",
	"replies":
	{{"rid":0, "author":"Sihan", "time": "2018-03-31 20:40:00", "vote": 3, "answer":"Today is a good day for exam."}
	{"rid":1, "author":"Jack", "time": "2018-03-31 21:40:00", "vote": 5, "answer":"I believe it's in Gates G01, maybe I am wrong, can some TA confirm this?"}
	{"rid":2, "author":"Jane", "time": "2018-03-31 22:40:00", "vote": 11, "answer":"Disagree with the last post, I believe it's in startler 101. Correct me if I am wrong."}
	{"rid":3, "author":"Peter", "time": "2018-03-31 23:40:00", "vote": 22, "answer":"Disagree again with the reply above. It's a take home exam."}
	{"rid":4, "author":"Dan", "time": "2018-03-31 23:41:00", "vote": 0, "answer":"I don't know"}
	{"rid":5, "author":"Lilly", "time": "2018-03-31 23:46:22", "vote": 1, "answer":"Agree with floor 4."}}}

	return data	
