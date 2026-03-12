from datetime import datetime, timedelta
from database.db import db


class Visitor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False, index=True)
    email = db.Column(db.String(120), nullable=True)
    company = db.Column(db.String(120), nullable=True)
    designation = db.Column(db.String(120), nullable=True)
    vehicle_number = db.Column(db.String(50), nullable=True)
    host_name = db.Column(db.String(120), nullable=True)
    visit_datetime = db.Column(db.DateTime, nullable=True)
    purpose = db.Column(db.String(255), nullable=True)
    emergency_contact = db.Column(db.String(50), nullable=True)
    department = db.Column(db.String(120), nullable=True)
    status = db.Column(db.String(50), nullable=False, default="pending")
    qr_code = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    documents = db.relationship("Document", backref="visitor", lazy=True, cascade="all, delete-orphan")
    assessments = db.relationship("Assessment", backref="visitor", lazy=True, cascade="all, delete-orphan")
    verifications = db.relationship("Verification", backref="visitor", lazy=True, cascade="all, delete-orphan")
    gate_logs = db.relationship("GateLog", backref="visitor", lazy=True, cascade="all, delete-orphan")


class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    visitor_id = db.Column(db.Integer, db.ForeignKey("visitor.id"), nullable=False)
    gov_id_file = db.Column(db.String(255), nullable=False)
    selfie_file = db.Column(db.String(255), nullable=False)
    authorization_letter = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


class Assessment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    visitor_id = db.Column(db.Integer, db.ForeignKey("visitor.id"), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    passed = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


class Verification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    visitor_id = db.Column(db.Integer, db.ForeignKey("visitor.id"), nullable=False)
    otp_verified = db.Column(db.Boolean, default=False, nullable=False)
    face_verified = db.Column(db.Boolean, default=False, nullable=False)
    aadhaar_verified = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


class GateLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    visitor_id = db.Column(db.Integer, db.ForeignKey("visitor.id"), nullable=False)
    entry_time = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)
    exit_time = db.Column(db.DateTime, nullable=True)
    gate_status = db.Column(db.String(50), nullable=False, default="entered")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


class OtpCode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(20), index=True, nullable=False)
    code = db.Column(db.String(6), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    @staticmethod
    def new(phone, code, ttl_seconds=300):
        exp = datetime.utcnow() + timedelta(seconds=ttl_seconds)
        return OtpCode(phone=phone, code=code, expires_at=exp)

