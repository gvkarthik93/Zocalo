from user_service import UserService
from post_service import PostService
import pandas as pd
import datetime

class IndexSchema:
	def __init__(self):
		self.service = PostService()
		self.dataFrame = None
		self.lastUpdatedTime = None

	def runTimeIndex(self):
		print ("Building runtime index")
		data = self.service.get_all_questions()
		self.dataFrame = pd.DataFrame(data)
		self.lastUpdatedTime = datetime.datetime.now()
		print (self.dataFrame)

	def updateIndex(self):
		print ("Updating index")
		data = self.service.get_all_questions_wtime(self.lastUpdatedTime)
		df = pd.DataFrame(data)
		self.dataFrame.append(df)

	def createIndex(self):
		self.runTimeIndex()

	def searchIndexedData(self):
		print ("Search the data in dataframe")

	def editIndexedData(self):
		print ("Edit the data in dataframe")

	def convertDftoJson(self):
		print ("Converts dataframe to Json to send response back to client")

id = IndexSchema()
id.createIndex()