
import sqlite3

class UserValidation():
	def __init__(self):
		print ("Initiating User Validation")

	def validateCredentials(self, username, password):
		#Logic
		try:
			#Currently connecting to DB for every POST request
			#You can change it to connect to DB based on the type of POST request rather than connecting for all POST requests
			conn = sqlite3.connect('test.db')
		except:
			print ("Database connection failed")

		print ("Validating User")
		return True

	def registerUser(self, userdetails):
		#Logic
		print ("Registering User")