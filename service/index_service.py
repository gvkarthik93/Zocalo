from user_service import UserService
from post_service import PostService
import pandas as pd

class IndexSchema:
	def __init__(self):
		self.service = PostService()
		self.dataFrame = None

	def runTimeIndex(self, postService):
		print ("Building runtime index")
		data = service.get_questions()
		self.dataFrame = pd.DataFrame(data)

	def updateIndex(self):
		print ("Updating index")
		data = service.get_questions_perquery()
		df = pd.DataFrame(data)
		# Update the self.dataframe here.

	def createIndex(self):
		self.runTimeIndex()

	def searchIndexData(self):
		print ("Search the data in dataframe")

	def convertDftoJson(self):
		print ("Converts dataframe to Json to send response back to client")