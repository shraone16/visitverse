from datetime import datetime
from database.db import db
from database.models import OtpCode
from utils.helpers import random_otp


def send_otp(phone, ttl_seconds=300):
    code = random_otp(6)
    db.session.query(OtpCode).filter(OtpCode.phone == phone).delete()
    otp = OtpCode.new(phone, code, ttl_seconds=ttl_seconds)
    db.session.add(otp)
    db.session.commit()
    return code


def verify_otp(phone, code):
    rec = db.session.query(OtpCode).filter(OtpCode.phone == phone).order_by(OtpCode.created_at.desc()).first()
    if not rec:
        return False
    if rec.expires_at < datetime.utcnow():
        return False
    if rec.code != code:
        return False
    db.session.delete(rec)
    db.session.commit()
    return True

