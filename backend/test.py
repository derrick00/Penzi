from crud import *
from main import *
from database import SessionLocal
from schemas import Request





incoming = dict


send_notification(incoming, SessionLocal())
