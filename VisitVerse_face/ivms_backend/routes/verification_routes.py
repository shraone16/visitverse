from flask import Blueprint, jsonify, request, current_app
from database.db import db
from database.models import Verification, Visitor
from services.otp_service import send_otp, verify_otp
from services.face_service import real_face_match


verification_bp = Blueprint("verification", __name__)


def get_or_create_verification(visitor_id):
    ver = db.session.query(Verification).filter_by(visitor_id=visitor_id).order_by(Verification.created_at.desc()).first()
    if ver:
        return ver
    ver = Verification(visitor_id=visitor_id)
    db.session.add(ver)
    db.session.commit()
    return ver


@verification_bp.post("/send-otp")
def send_otp_route():
    data = request.get_json() or {}
    phone = data.get("phone")
    if not phone:
        return jsonify({"message": "phone required"}), 400
    code = send_otp(phone)
    return jsonify({"message": "otp sent", "debug_code": code})


@verification_bp.post("/verify-otp")
def verify_otp_route():
    data = request.get_json() or {}
    phone = data.get("phone")
    code = data.get("code")
    if not phone or not code:
        return jsonify({"message": "phone and code required"}), 400
    ok = verify_otp(phone, code)
    if not ok:
        return jsonify({"verified": False}), 400
    v = db.session.query(Visitor).filter_by(phone=phone).order_by(Visitor.created_at.desc()).first()
    if v:
        ver = get_or_create_verification(v.id)
        ver.otp_verified = True
        db.session.commit()
    return jsonify({"verified": True, "visitor_id": v.id if v else None})


@verification_bp.post("/face-match")
def face_match():
    data = request.get_json() or {}
    visitor_id = data.get("visitor_id")
    live_image = data.get("live_image")   # base64-encoded webcam snapshot

    if not visitor_id:
        return jsonify({"message": "visitor_id required"}), 400
    if not live_image:
        return jsonify({"message": "live_image (base64) required"}), 400

    upload_folder = current_app.config.get("UPLOAD_FOLDER", "uploads")
    result = real_face_match(visitor_id, live_image, upload_folder)

    if result.get("error"):
        # Still save face_verified=False so the record exists
        ver = get_or_create_verification(visitor_id)
        ver.face_verified = False
        db.session.commit()
        return jsonify({"similarity": 0.0, "matched": False, "error": result["error"]}), 422

    ver = get_or_create_verification(visitor_id)
    ver.face_verified = result["matched"]
    db.session.commit()

    return jsonify({"similarity": result["similarity"], "matched": result["matched"]})

