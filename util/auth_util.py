import jwt
from datetime import datetime, timedelta

# Metadata for token
JWT_SECRET = 'secret'
JWT_ALGORITHM = 'HS256'
JWT_EXP_MINUTES = 20

class AuthUtil:
    def checkToken(self, auth_header):
        if auth_header is None or not auth_header.startswith('Bearer '):
            return (0, json.dumps({"status":0, "message":"Missing Token"}))

        jwt_token = auth_header.split(" ")[1]
        if jwt_token:
            try:
                payload = jwt.decode(jwt_token, JWT_SECRET, 
                                     algorithms=[JWT_ALGORITHM])
            except (jwt.DecodeError, jwt.ExpiredSignatureError):
                return (0, json.dumps(
                {"status":0, "message":"Invalid Token"}))
        return (1, "")

    def generateToken(self, username):
        print(datetime.now())
        payload = {
            'username': username,
            'exp': datetime.utcnow() + timedelta(minutes=JWT_EXP_MINUTES)
        }
        return jwt.encode(payload, JWT_SECRET, JWT_ALGORITHM)