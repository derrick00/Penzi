from sqlalchemy.orm import Session
from fastapi import Depends, FastAPI, HTTPException, BackgroundTasks
import models, schemas, main
import requests
import json
import main
import fastapi.security as _security
import jwt as _jwt
import passlib.hash as _hash
from database import SessionLocal, engine


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/token/")

JWT_SECRET = "myjwtsecret"

def getUsers(db: Session):
    return db.query(models.User).all()

def deleteUser(id:int, db:Session):
    user = db.query(models.User).get(id)
    db.delete(user)
    db.commit()
    db.close()
    return 'Item was deleted'


def addUser(user:schemas.User, db:Session):
    user = models.User(first_name = user.first_name, 
                        last_name = user.last_name,
                        phone_number = user.phone_number,
                        age = user.age,
                        gender = user.gender,
                        county = user.county,
                        town = user.town,
                        level_of_education = user.level_of_education,
                        profession = user.profession,
                        marital_status = user.marital_status,
                        religion = user.religion,
                        ethnicity = user.ethnicity,
                        description = user.description,
                        created = user.created)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_number(db: Session, number: str):
    return db.query(models.User).filter(models.User.phone_number == number).first()

def activate(request, db):
    number = request.phone_number
    message = request.message
    user = db.query(models.User).filter(models.User.phone_number == number).first()

    response = f"""You have been reactivated for dating.
To search for a MPENZI, SMS match#age#town to 22141 and meet the
person of your dreams.
E.g., match#23-25#Kisumu"""

    return response



def seeUser(request, db):
    number = request.phone_number
    message = request.message
    user = db.query(models.User).filter(models.User.phone_number == number).first()
    messo = db.query(models.Message).filter(models.Message.user_message==None).order_by(models.Message.id.desc()).first()
    if messo:
        number = messo.phone_number
        message = messo.sys_message
    msg = message.split(" ")
    area = msg[20].replace( ".", " " )
    name = msg[5]
    location = area.strip( )
    miaka = int(msg[17])
    user = db.query(models.User).filter(models.User.first_name == name, models.User.age == miaka, models.User.county == location).first()
    response = f"""{user.first_name} {user.last_name} aged {user.age}, {user.county} County, {user.town} town, {user.level_of_education},
{user.profession}, {user.marital_status}, {user.religion}, {user.ethnicity}.
Send DESCRIBE {user.phone_number} to get more details about {user.first_name}. """

    return response


def describeMatch(request, db):
    number = request.phone_number
    message = request.message
    user = db.query(models.User).filter(models.User.phone_number == number).first()
    text = message.split(" ")
    data = text[1]
    match_requested = db.query(models.User).filter(models.User.phone_number == data).first()
    response = match_requested.description
    print(f""" Match description sent to {user.first_name}""")
    if user is None:
        response = 'send the word "PENZI" to 22141 to start registration'
    return response

def numberMatch(request, db):
    number = request.phone_number
    message = request.message
    user = db.query(models.User).filter(models.User.phone_number == number).first()
    if user is None:
        response = 'send the word "PENZI" to 22141 to start registration'
        return response
    try:
        match_requested = db.query(models.User).filter(models.User.phone_number == message).first()
        data = match_requested
        response4 = f"""{data.first_name} {data.last_name} aged {data.age}, {data.county} County, {data.town} town, {data.level_of_education}, {data.profession},
{data.marital_status}, {data.religion}, {data.ethnicity}. Send DESCRIBE {data.phone_number} to get more details about {data.first_name}."""
        if user.gender.lower() == "male":
            one = "man"
            two = "He"
            three = "him"
        else:
            one = "lady"
            two = "She"
            three = "her"
        if data:
            response2 = f"""Hi {data.first_name}, a {one} called {user.first_name} is interested in you and requested your details. 
{two} is aged {user.age} based in {user.county}. Do you want to know more about {three}? Send YES to 22141 """
            req_num = data.phone_number

            print(f""" Notification sent to {data.first_name}""")
            response_str = str(response2)
            messo = models.Message(phone_number=data.phone_number, sys_message=response_str)
            db.add(messo)
            db.commit()
        
    except:
        response4 = 'incorrect number. Please confirm the number again'
    return response4

def nextMatch(request, db):
    number = request.phone_number
    message = request.message
    user = db.query(models.User).filter(models.User.phone_number == number).first()
    response = "can't find next match"
    if user is None:
        response = 'send the word "PENZI" to 22141 to start registration'
        return response
    matches = db.query(models.Match).filter(models.Match.user_number==number, models.Match.verified == False).all()
    response1 = ""
    response2 = ""
    response3 = ""
    response4 = ""

    if (len(matches)-3 >= 3):
        response1 = f""" {matches[0].first_name} {matches[0].last_name} aged {matches[0].age}, {matches[0].phone_number} 
{matches[1].first_name} {matches[1].last_name} aged {matches[1].age}, {matches[1].phone_number} 
{matches[2].first_name} {matches[2].last_name} aged {matches[2].age}, {matches[2].phone_number}
Send NEXT to 22141 to receive details of the remaining {len(matches)-3} matches"""
        matches[0].verified = True
        matches[1].verified = True
        matches[2].verified = True
        db.commit()
        return response1
    elif (len(matches)-3 == 0):
        response1 = f""" {matches[0].first_name} {matches[0].last_name} aged {matches[0].age}, {matches[0].phone_number} 
{matches[1].first_name} {matches[1].last_name} aged {matches[1].age}, {matches[1].phone_number} 
{matches[2].first_name} {matches[2].last_name} aged {matches[2].age}, {matches[2].phone_number} 
You have recieved all your current available matches. Please check later or change match requirements"""
        matches[0].verified = True
        matches[1].verified = True
        matches[2].verified = True
        db.commit()
        return response1
    elif (len(matches)-3 == 1):
        response1 = f""" {matches[0].first_name} {matches[0].last_name} aged {matches[0].age}, {matches[0].phone_number} 
{matches[1].first_name} {matches[1].last_name} aged {matches[1].age}, {matches[1].phone_number} 
{matches[2].first_name} {matches[2].last_name} aged {matches[2].age}, {matches[2].phone_number} 
Send NEXT to 22141 to receive details of the remaining 1 match"""
        matches[0].verified = True
        matches[1].verified = True
        matches[2].verified = True
        db.commit()
        return response1
    elif (len(matches)-3 == 2):
        response1 = f""" {matches[0].first_name} {matches[0].last_name} aged {matches[0].age}, {matches[0].phone_number} 
{matches[1].first_name} {matches[1].last_name} aged {matches[1].age}, {matches[1].phone_number}
{matches[2].first_name} {matches[2].last_name} aged {matches[2].age}, {matches[2].phone_number}
Send NEXT to 22141 to receive details of the remaining 2 matches"""
        matches[0].verified = True
        matches[1].verified = True
        matches[2].verified = True
        db.commit()
        return response1
    elif len(matches)-3 == -1:
        response1 = f""" {matches[0].first_name} {matches[0].last_name} aged {matches[0].age}, {matches[0].phone_number} 
{matches[1].first_name} {matches[1].last_name} aged {matches[1].age}, {matches[1].phone_number} 
You have recieved all your current available matches. Please check later or change match requirements"""
        matches[0].verified = True
        matches[1].verified = True
        db.commit()
        return response1
    elif len(matches)-3 == -2:
        response1 = f""" {matches[0].first_name} {matches[0].last_name} aged {matches[0].age}, {matches[0].phone_number}
You have recieved all your current available matches. Please check later or change match requirements"""
        matches[0].verified = True
        db.commit()
        return response1
    else:
        response = "You have recieved all your current available matches. Please check later or change match requirements"
        return response
    return response

def match(request, db):
    number = request.phone_number
    message = request.message
    response = "Error while getting matches"
    user = db.query(models.User).filter(models.User.phone_number == number).first()
    if user is None:
        response = 'send the word "PENZI" to 22141 to start registration'
        return response
    text = message.replace( "#", " " )
    msg = text.split(" ")
    age_range = msg[1]
    miaka_range = age_range.split("-")
    area = msg[2]

    sent_matches = db.query(models.Match).filter(models.Match.user_number==number, models.Match.county==area, models.Match.age>=miaka_range[0], models.Match.age<=miaka_range[1]).all()
    if  sent_matches:
        if (len(sent_matches)-3 >= 1):
            response = f"""We have {len(sent_matches)} matches who meet your choice! We will send you details of 3 of them shortly.
To get more details about a lady, SMS her number e.g., 0722010203 to 22141\n
1. {sent_matches[0].first_name} {sent_matches[0].last_name} aged {sent_matches[0].age}, {sent_matches[0].phone_number},
2. {sent_matches[1].first_name} {sent_matches[1].last_name} aged {sent_matches[1].age}, {sent_matches[1].phone_number},
3. {sent_matches[2].first_name} {sent_matches[2].last_name} aged {sent_matches[2].age}, {sent_matches[2].phone_number}.  
Send NEXT to 22141 to receive details of the remaining {len(sent_matches)-3} matches"""
            return response
        elif (len(matches)-3 == 0):
            response = f"""We have {len(matches)} matches who meet your choice! We will send you details of 3 of them shortly.
To get more details about a lady, SMS her number e.g., 0722010203 to 22141
1. {matches[0].first_name} {matches[0].last_name} aged {matches[0].age}, {matches[0].phone_number} 
2. {matches[1].first_name} {matches[1].last_name} aged {matches[1].age}, {matches[1].phone_number} 
3. {matches[2].first_name} {matches[2].last_name} aged {matches[2].age}, {matches[2].phone_number} 
You have recieved all your current available matches. Please check later or change match requirements"""
            return response
        elif len(sent_matches)-3 == -1:
            response = f"""We have {len(sent_matches)} matches who meet your choice! We will send you details of 2 of them shortly.
To get more details about a lady, SMS her number e.g., 0722010203 to 22141
1. {sent_matches[0].first_name} {sent_matches[0].last_name} aged {sent_matches[0].age}, {sent_matches[0].phone_number} 
2. {sent_matches[1].first_name} {sent_matches[1].last_name} aged {sent_matches[1].age}, {sent_matches[1].phone_number} 
You have recieved all your current available matches. Please check later or change match requirements"""
            return response
        elif len(sent_matches)-3 == -2:
            response = f"""We have 1 match who meet your choice! We will send you details of the match shortly.
To get more details about a lady, SMS her number e.g., 0722010203 to 22141
1. {sent_matches[0].first_name} {sent_matches[0].last_name} aged {sent_matches[0].age}, {sent_matches[0].phone_number}
You have recieved all your current available matches. Please check later or change match requirements"""
            return response
        else:
            response = "There is currently no available matches. Please check later or change match requirements"
            return response
    if user.gender.lower() == "male":
        matches = db.query(models.User).filter(models.User.gender=="Female", models.User.county==area, models.User.age>=miaka_range[0], models.User.age<=miaka_range[1]).all()
    else:
        matches = db.query(models.User).filter(models.User.gender=="Male", models.User.county==area, models.User.age>=miaka_range[0], models.User.age<=miaka_range[1]).all()

    new_instances = [models.Match(
                        user_number = number,
                        first_name = row.first_name,
                        last_name = row.last_name,
                        age = row.age,
                        phone_number = row.phone_number,
                        county = row.county
        )
        for row in matches
    ]
    db.add_all(new_instances)
    db.commit()
    matches = db.query(models.Match).filter(models.Match.user_number==number, models.Match.county==area, models.Match.age>=miaka_range[0], models.Match.age<=miaka_range[1]).all()
    if (len(matches)-3 >= 2):
        response = f"""We have {len(matches)} matches who meet your choice! We will send you details of 3 of them shortly.
To get more details about a lady, SMS her number e.g., 0722010203 to 22141
1. {matches[0].first_name} {matches[0].last_name} aged {matches[0].age}, {matches[0].phone_number} 
2. {matches[1].first_name} {matches[1].last_name} aged {matches[1].age}, {matches[1].phone_number} 
3. {matches[2].first_name} {matches[2].last_name} aged {matches[2].age}, {matches[2].phone_number} 
Send NEXT to 22141 to receive details of the remaining {len(matches)-3} matches"""
        matches[0].verified = True
        matches[1].verified = True
        matches[2].verified = True
        db.commit()
        return response
    elif (len(matches)-3 == 0):
        response = f"""We have {len(matches)} matches who meet your choice! We will send you details of 3 of them shortly.
To get more details about a lady, SMS her number e.g., 0722010203 to 22141
1. {matches[0].first_name} {matches[0].last_name} aged {matches[0].age}, {matches[0].phone_number} 
2. {matches[1].first_name} {matches[1].last_name} aged {matches[1].age}, {matches[1].phone_number} 
3. {matches[2].first_name} {matches[2].last_name} aged {matches[2].age}, {matches[2].phone_number} 
You have recieved all your current available matches. Please check later or change match requirements"""
        matches[0].verified = True
        matches[1].verified = True
        matches[2].verified = True
        db.commit()
        return response
    elif (len(matches)-3 == 1):
        response = f"""We have {len(matches)} matches who meet your choice! We will send you details of 3 of them shortly.
To get more details about a lady, SMS her number e.g., 0722010203 to 22141
1. {matches[0].first_name} {matches[0].last_name} aged {matches[0].age}, {matches[0].phone_number} 
2. {matches[1].first_name} {matches[1].last_name} aged {matches[1].age}, {matches[1].phone_number} 
3. {matches[2].first_name} {matches[2].last_name} aged {matches[2].age}, {matches[2].phone_number} 
Send NEXT to 22141 to receive details of the remaining 1 match"""
        matches[0].verified = True
        matches[1].verified = True
        matches[2].verified = True
        db.commit()
        return response
    elif len(matches)-3 == -1:
        response = f"""We have 2 matches who meet your choice! We will send you details of all of them shortly.
To get more details about a lady, SMS her number e.g., 0722010203 to 22141
1. {matches[0].first_name} {matches[0].last_name} aged {matches[0].age}, {matches[0].phone_number}
2. {matches[1].first_name} {matches[1].last_name} aged {matches[1].age}, {matches[1].phone_number}
You have recieved all your current available matches. Please check later or change match requirements"""
        matches[0].verified = True
        matches[1].verified = True
        db.commit()
        return response
    elif len(matches)-3 == -2:
        response = f"""We have 1 match who meet your choice! We will send you details of the match shortly.
To get more details about a lady, SMS her number e.g., 0722010203 to 22141
1. {matches[0].first_name} {matches[0].last_name} aged {matches[0].age}, {matches[0].phone_number} 
You have recieved all your current available matches. Please check later or change match requirements"""
        matches[0].verified = True
        db.commit()
        return response
    else:
        response = "There is currently no available matches. Please check later or change match requirements"
        return response
    return response

def user_description(request, db):
    number = request.phone_number
    message = request.message
    user = db.query(models.User).filter(models.User.phone_number == number).first()
    data = message.strip("MYSELF")
    user.description = data
    db.add(user)
    db.commit()
    db.refresh(user)
    print(f""" Description for {user.first_name} added.""")
    response = """You are now registered for dating.
To search for a MPENZI, SMS match#age#town to 22141 and meet the person of your dreams.
E.g., match#23-25#Kisumu"""
    if user is None:
        response = 'send the word "PENZI" to 22141 to start registration'
    return response

def details(request, db):
    number = request.phone_number
    message = request.message
    response = "user details"
    user = db.query(models.User).filter(models.User.phone_number == number).first()  
    text = message.replace( "#", " " )
    data =text.split(" ")
    try:
        len(data) == 6
        user.level_of_education = data[1]
        user.profession = data[2]
        user.marital_status = data[3]
        user.religion = data[4]
        user.ethnicity = data[5]
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f""" Details for {user.first_name} added.""")
        response = """This is the last stage of registration.
SMS a brief description of yourself to 22141 starting with the word MYSELF.
E.g., MYSELF chocolate, lovely, sexy etc."""
    except:
        response = "Message error. Please check the details again"
    if user is None:
        response = 'send the word "PENZI" to 22141 to start registration'
    return response

def registration(request, db):
    number = request.phone_number
    message = request.message
    response ="User reg"
    user = db.query(models.User).filter(models.User.phone_number == number).first()
    text = message.replace( "#", " " )
    data =text.split(" ")
    try:
        len(data) == 7
        user.first_name = data[1]
        user.last_name = data[2]
        user.age = data[3]
        user.gender = data[4]
        user.county = data[5]
        user.town = data[6]
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f""" Registration for {user.phone_number} completed.""")

        response = f"""Your profile has been created successfully {user.first_name}.
SMS details#level of education#profession#marital status#religion#ethnicity to 22141.
E.g. details#diploma#driver#single#christian#mijikenda"""
        return response
    except:
        response = "Message error. Please check the details again"
    if user is None:
        response = 'send the word "PENZI" to 22141 to start registration'
    return response

def welcome(request, db):
    number = request.phone_number


    message = request.message
    response =""
    user = db.query(models.User).filter(models.User.phone_number == number).first()

    response = """You are registered for dating.
To search for a MPENZI, SMS match#age#town to 22141 and meet the person of your dreams.
E.g., match#23-25#Kisumu"""
    if user is None:

        user = models.User(phone_number = number)
        db.add(user)
        db.commit()
        db.refresh(user)


        response = """Welcome to our dating service with 6000 potential dating partners!.
To register SMS start#name#age#gender#county#town to 22141.
E.g., start#John Doe#26#Male#Nakuru#Naivasha"""

    return response

def conversations(request, db):
    return"All conversations"


def sendRequest(request:schemas.Request, db:Session):
    request = models.Request(phone_number = request.phone_number, 
                            message = request.message) 
                            #received = request.received)
    db.add(request)
    db.commit()
    print(f"""Request with phone number: {request.phone_number} and message: {request.message} recieved""")
    db.refresh(request)
    return request


def saveMessage(msg, db:Session):
    msg = models.Message(phone_number = msg.phone_number, 
                            user_message = msg.user_message,
                            sys_message = msg.sys_message,
                            created = msg.created)
    db.add(msg)
    db.commit()
    print("message saved to logs")
    db.refresh(msg)
    return msg

def getRequest(db: Session):
    requests = db.query(models.Request).order_by(models.Request.id.desc()).all()
    return requests


def userMessages(mess:schemas.UserMessages, db:Session):
    mess = models.Request(phone_number = mess.phone_number)
    db.add(mess)
    db.commit()
    print(f"""Previous conversation of phone number: {mess.phone_number} have been retrieved""")
    db.refresh(mess)
    number = mess.phone_number
    response = db.query(models.Message).filter(models.Message.phone_number==number).all()
    return response


async def get_admin_by_email(email: str, db:Session):
    return db.query(models.Admin).filter(models.Admin.email == email).first()

async def create_admin(admin:schemas.AdminCreate, db: Session):
    admin_obj = models.Admin(email=admin.email, hashed_password = _hash.bcrypt.hash(admin.hashed_password))
    db.add(admin_obj)
    db.commit()
    print(f"""Administrator with Email: {admin.email}  has been created""")
    db.refresh(admin_obj)
    return admin_obj

async def authenticate_admin(email: str, password: str, db: Session):
    admin = await get_admin_by_email(db=db, email=email)

    if not admin:
        print("Not an admin")
        return False
    
    if not admin.verify_password(password):
        print("Not an administrator")
        return False

    return admin

async def create_token(admin: models.Admin):
    admin_obj = schemas.Admin.from_orm(admin)

    token = _jwt.encode(admin_obj.dict(), JWT_SECRET)
    return dict(access_token=token, token_type="bearer")













