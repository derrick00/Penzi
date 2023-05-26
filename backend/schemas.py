from pydantic import BaseModel
from datetime import date, datetime, time, timedelta

class Match(BaseModel):
    first_name : str 
    last_name : str  
    phone_number : str
    age : int 
    gender : str 
    county : str  
    verified : bool | None = None
    user_number : str

class User(BaseModel):
    first_name : str | None = None
    last_name : str  | None = None
    phone_number : str  | None = None
    age : int  | None = None
    gender : str  | None = None
    county : str  | None = None
    town : str  | None = None
    level_of_education : str  | None = None
    profession : str  | None = None
    marital_status : str  | None = None
    religion : str  | None = None
    ethnicity : str  | None = None
    description : str  | None = None
    matches : list[Match] = []
    created : datetime  | None = None

class Request(BaseModel):
    phone_number: str
    message: str
    received : datetime  | None = None

class UserMessages(BaseModel):
    phone_number: str
    received : datetime  | None = None

class Message(BaseModel):
    phone_number: str
    user_message: str  | None = None
    sys_message : str 
    created : datetime  | None = None

class _AdminBase(BaseModel):
    email: str


class AdminCreate(_AdminBase):
    hashed_password: str

    class Config:
        orm_mode = True

class Admin (_AdminBase):
    id: int

    class Config:
        orm_mode = True