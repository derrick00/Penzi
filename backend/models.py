from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
import passlib.hash as _hash
class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    first_name = Column(String(250))
    last_name = Column(String(250))
    phone_number = Column(String(250), unique=True, nullable=False)
    age = Column(Integer)
    gender = Column(String(250))
    county = Column(String(250))
    town = Column(String(250))
    level_of_education = Column(String(250))
    profession = Column(String(250))
    marital_status = Column(String(250))
    religion = Column(String(250))
    ethnicity = Column(String(250))
    description = Column(String(250))
    last_active = Column(DateTime, default=datetime.utcnow)
    created = Column(DateTime, default=datetime.utcnow)

    match = relationship("Match", back_populates="user")

class Request(Base):
    __tablename__ = 'request'

    id = Column(Integer, primary_key=True)
    phone_number = Column(String(50))
    message = Column(String(200))
    received = Column(DateTime, default=datetime.utcnow)

class UserMessages(Base):
    __tablename__ = 'usermessages'

    id = Column(Integer, primary_key=True)
    phone_number = Column(String(50))
    received = Column(DateTime, default=datetime.utcnow)


class Message(Base):
    __tablename__ = 'mess'

    id = Column(Integer, primary_key=True)
    phone_number = Column(String(50))
    user_message = Column(String(200))
    sys_message = Column(Text)
    created = Column(DateTime, default=datetime.utcnow)


class Match(Base):
    __tablename__ = 'matchess'

    id = Column(Integer, primary_key=True)
    phone_number = Column(String(50), unique=False)
    first_name = Column(String(250))
    last_name = Column(String(250))
    age = Column(Integer)
    county = Column(String(250))
    verified = Column(Boolean, default=False)
    user_number = Column(String, ForeignKey("user.phone_number"))

    user = relationship("User", back_populates="match")   

class Admin(Base):
    __tablename__ = 'adm'

    id = Column(Integer, primary_key=True)
    email = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(50))

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.hashed_password)