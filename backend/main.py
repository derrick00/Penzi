from typing import List
from fastapi import Depends, FastAPI, HTTPException, BackgroundTasks, Request, Form
from sqlalchemy.orm import Session
import crud, models, schemas
from fastapi.responses import JSONResponse
from database import SessionLocal, engine
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import fastapi.security as _security
import pytz
import time
import random
import requests
import asyncio
import json
import jwt as _jwt

models.Base.metadata.create_all(bind=engine)

oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/token/")
JWT_SECRET = "myjwtsecret"

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


origins = ["*"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)





def engine(request, db):
    number = request.phone_number
    if number.startswith("254"):
        pass
    else:
        print("Request with incorrect phone number format")
        return "Phone number error. Please check the phone number and enter the correct format"
    messo = request.message
    message = messo.lower()
    user = db.query(models.User).filter(models.User.phone_number == number).first()
    if user is None:
        response = 'Not registered.Send the word "PENZI" to 22141 to start registration'
    if message.lower() == "penzi":
        response = crud.welcome(request, db)
    elif message.startswith("start") or message.startswith("START") or message.startswith("Start"):
        response = crud.registration(request, db)
    elif message.startswith("details") or message.startswith("DETAILS") or message.startswith("Details"):
        response = crud.details(request, db)
    elif message.startswith("MYSELF") or message.startswith("myself") or message.startswith("Myself"):
        response = crud.user_description(request, db)
    elif message.startswith("match") or message.startswith("Match"):
        response = crud.match(request, db)
    elif message.lower() == "next":
        response = crud.nextMatch(request, db)
    elif message.startswith("254"):
        response = crud.numberMatch(request, db)
    elif message.startswith("DESCRIBE") or message.startswith("describe") or message.startswith("Describe"):
        response = crud.describeMatch(request, db)
    elif message.lower() == "yes":
        response = crud.seeUser(request, db)
    elif message.lower() == "myconversation":
        response = crud.conversation(request, db)
    elif message.lower() == "activate":
        response = crud.activate(request, db)
    else:
        response = 'Message error.Please confirm the message and resend again'

    response_str = str(response)
    msg = models.Message(phone_number=number, user_message=message, sys_message=response_str, created=datetime.utcnow())
    db.add(msg)
    db.commit()

    if user:
        user.last_active = datetime.utcnow()
        db.commit()
    else:
        pass

    return response

@app.post("/request/")
async def sendRequest(request:schemas.Request, db:Session = Depends(get_db)):
    request = crud.sendRequest(db=db, request=request)
    response = engine(request=request, db=db)
    print("response sent")
    return response


@app.post("/usermessage/")
async def userMessages(mess:schemas.UserMessages, db:Session = Depends(get_db)):
    response = crud.userMessages(db=db, mess=mess)
    return response

@app.post("/whatsapp/")
async def whatsapp(incoming:dict, background_tasks: BackgroundTasks, db:Session = Depends(get_db)):
    response = crud.reply(incoming=incoming, background_tasks=BackgroundTasks, db=db)
    #background_tasks.add_task(send_notification, incoming, db)
    return response


@app.get("/request/")
def getRequest(db: Session = Depends(get_db)):
    return crud.getRequest(db=db)


@app.get("/")
def getUsers(db: Session = Depends(get_db)):
    return crud.getUsers(db=db)


@app.get("/message/")
def getMessage(db: Session = Depends(get_db)):
    return db.query(models.Message).order_by(models.Message.id.desc()).all()

@app.get("/match/")
def getMatches  (db: Session = Depends(get_db)):
    return db.query(models.Match).order_by(models.Match.id.desc()).all()



@app.get("/alladmin/")
def getAdmin  (db: Session = Depends(get_db)):
    return db.query(models.Admin).order_by(models.Admin.id.desc()).all()


@app.post('/admin/')
async def create_admin(admin:schemas.AdminCreate, db:Session = Depends(get_db)):
    db_admin = await crud.get_admin_by_email(admin.email, db)
    if db_admin:
        raise HTTPException(status_code=400, detail="Email already in use.")
        print("Email already in use")
    admin = await crud.create_admin(admin, db)

    return await crud.create_token(admin)


@app.post('/token/')
async def generate_token(form_data: _security.OAuth2PasswordRequestForm = Depends(), db:Session = Depends(get_db)):
    admin = await crud.authenticate_admin(form_data.username, form_data.password, db)
    if not admin:
        HTTPException(status_code=401, detail="Invalid credentials")
        print("invalid Credentials")

    return await crud.create_token(admin)


async def get_current_admin(db: Session = Depends(get_db), token: str = Depends(oauth2schema),):
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        admin = db.query(models.Admin).get(payload["id"])
    except:
        print("Invalid email or password")
        raise HTTPException(status_code=401, detail="Invalid email or password")
    print("got current admin")
    return schemas.Admin.from_orm(admin)



@app.get('/admin/me/', response_model=schemas.Admin)
async def get_user(admin: schemas.Admin = Depends(get_current_admin)):
    print(" admin returned")
    return admin

