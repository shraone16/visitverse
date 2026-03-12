import os
from flask import Blueprint, request, jsonify, current_app
from database.db import db
from database.models import Visitor, Document
from services.qr_service import generate_qr
from utils.helpers import save_upload, ensure_dir
from datetime import datetime


visitor_bp = Blueprint("visitor", __name__)


@visitor_bp.post("/register")
def register():
    data = request.get_json() or {}
    v = Visitor(
        name=data.get("name"),
        phone=data.get("phone"),
        email=data.get("email"),
        company=data.get("company"),
        designation=data.get("designation"),
        vehicle_number=data.get("vehicle_number"),
        host_name=data.get("host_name"),
        visit_datetime=datetime.fromisoformat(data["visit_datetime"]) if data.get("visit_datetime") else None,
        purpose=data.get("purpose"),
        emergency_contact=data.get("emergency_contact"),
        department=data.get("department"),
        status="registered",
    )
    db.session.add(v)
    db.session.commit()
    qr_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], "qrcodes")
    qr_filename = f"visitor_{v.id}.png"
    qr_data = f"IVMS|VID:{v.id}|PHONE:{v.phone}"
    qr_path = generate_qr(qr_data, qr_dir, qr_filename)
    v.qr_code = os.path.relpath(qr_path, current_app.config["UPLOAD_FOLDER"])
    db.session.commit()
    return jsonify({"visitor_id": v.id, "qr_code": v.qr_code}), 201


@visitor_bp.post("/upload-documents")
def upload_documents():
    visitor_id = request.form.get("visitor_id")
    if not visitor_id:
        return jsonify({"message": "visitor_id required"}), 400
    v = db.session.get(Visitor, int(visitor_id))
    if not v:
        return jsonify({"message": "visitor not found"}), 404
    gov_id = request.files.get("gov_id_file")
    selfie = request.files.get("selfie_file")
    auth = request.files.get("authorization_letter")
    if not gov_id or not selfie:
        return jsonify({"message": "gov_id_file and selfie_file required"}), 400
    base_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], "documents", str(v.id))
    ensure_dir(base_dir)
    gov_path = save_upload(gov_id, base_dir, "gov_id_" + gov_id.filename)
    selfie_path = save_upload(selfie, base_dir, "selfie_" + selfie.filename)
    auth_path = save_upload(auth, base_dir, "auth_" + auth.filename) if auth else None
    doc = Document(
        visitor_id=v.id,
        gov_id_file=os.path.relpath(gov_path, current_app.config["UPLOAD_FOLDER"]),
        selfie_file=os.path.relpath(selfie_path, current_app.config["UPLOAD_FOLDER"]),
        authorization_letter=os.path.relpath(auth_path, current_app.config["UPLOAD_FOLDER"]) if auth_path else None,
    )
    db.session.add(doc)
    db.session.commit()
    return jsonify({"message": "uploaded", "document_id": doc.id}), 201

