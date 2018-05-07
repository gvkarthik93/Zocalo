from zocalo.service.user_service import UserService
from zocalo.service.post_service import PostService
from zocalo.service.course_service import CourseService
import pandas as pd
import datetime
import json

class IndexService:
	def __init__(self):
		self.service = PostService()
		self.dataFrame = None
		self.lastUpdatedTime = None

	# Build index during run time
	def runTimeIndex(self):
		print ("Building runtime index")
		data = self.service.get_all_data()
		self.dataFrame = pd.DataFrame(data)
		self.lastUpdatedTime = datetime.datetime.now()
		return self.dataFrame

	# Update Index every minute
	def updateIndex(self):
		print ("Updating index")
		data = self.service.get_all_data(self.lastUpdatedTime)
		df = pd.DataFrame(data)
		self.dataFrame.append(df)

	def createIndex(self):
		return self.runTimeIndex()

	def searchIndexedData(self,query):
		documents = list()
		for (idx, row) in self.dataFrame.iterrows():
			doc = dict()
			if self.stringSearch(row.loc['header'],query) or self.stringSearch(row.loc['description'],query):
				doc["pid"] = row.loc['pid']
				doc["header"] = row.loc['header']
				doc["description"] = row.loc['description']
				documents.append(doc)
		return documents

	def convertDftoJson(self, data):
		print ("Converting data to json format")
		return json.dumps(data)

	def stringSearch(self, text, pattern):
		la = self.computePatternList(pattern)
		i,j = 0,0
		while i<len(text) and j<len(pattern):
			if text[i]==pattern[j]:
				i+=1
				j+=1
			else:
				if j!= 0:
					j = la[j-1]
				else:
					i+=1
			if j == len(pattern):
				return True
		return False

	def computePatternList(self, pattern):
		index = 0
		lookupArray = [0] * len(pattern)
		i = 1
		while i < len(pattern):
			if pattern[i] == pattern[index]:
				lookupArray[i] = index + 1
				index += 1
				i+=1
			else:
				if index != 0:
					index = lookupArray[index-1]
				else:
					lookupArray[i] = 0
					i+=1
		return lookupArray