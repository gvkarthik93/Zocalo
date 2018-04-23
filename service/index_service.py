from user_service import UserService
from post_service import PostService
import pandas as pd
import datetime

class IndexSchema:
	def __init__(self):
		self.service = PostService()
		self.dataFrame = None
		self.lastUpdatedTime = None

	def runTimeIndex(self, postService):
		print ("Building runtime index")
		data = service.get_all_questions()
		self.dataFrame = pd.DataFrame(data)
		self.lastUpdatedTime = datetime.datetime.now()

	def updateIndex(self):
		print ("Updating index")
		data = service.get_all_questions_wtime(self.lastUpdatedTime)
		df = pd.DataFrame(data)
		self.dataFrame.append(df)

	def createIndex(self):
		self.runTimeIndex()

	def searchIndexData(self):
		print ("Search the data in dataframe")

	def convertDftoJson(self):
		print ("Converts dataframe to Json to send response back to client")