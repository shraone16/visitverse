from datetime import datetime
from flask import Blueprint, jsonify, request
from database.db import db
from database.models import Visitor, GateLog


gate_bp = Blueprint("gate", __name__)


def parse_visitor_id_from_qr(qr_text):
    if not qr_text:
        return None
    try:
        parts = qr_text.split("|")
        for p in parts:
            if p.startswith("VID:"):
                return int(p.split("VID:")[1])
    except Exception:
        return None
    return None


@gate_bp.post("/gate/entry")
def gate_entry():
    data = request.get_json() or {}
    visitor_id = data.get("visitor_id")
    qr_code = data.get("qr_code")
    if not visitor_id and qr_code:
        visitor_id = parse_visitor_id_from_qr(qr_code)
    if not visitor_id:
        return jsonify({"message": "visitor_id or qr_code required"}), 400
    v = db.session.get(Visitor, int(visitor_id))
    if not v:
        return jsonify({"message": "visitor not found"}), 404
    log = GateLog(visitor_id=v.id, entry_time=datetime.utcnow(), gate_status="entered")
    v.status = "in"
    db.session.add(log)
    db.session.commit()
    return jsonify({"message": "entry logged", "gate_log_id": log.id})


@gate_bp.post("/gate/exit")
def gate_exit():
    data = request.get_json() or {}
    visitor_id = data.get("visitor_id")
    if not visitor_id:
        return jsonify({"message": "visitor_id required"}), 400
    v = db.session.get(Visitor, int(visitor_id))
    if not v:
        return jsonify({"message": "visitor not found"}), 404
    log = (
        db.session.query(GateLog)
        .filter(GateLog.visitor_id == v.id, GateLog.exit_time.is_(None))
        .order_by(GateLog.entry_time.desc())
        .first()
    )
    if not log:
        return jsonify({"message": "active entry not found"}), 404
    log.exit_time = datetime.utcnow()
    log.gate_status = "exited"
    v.status = "out"
    db.session.commit()
    return jsonify({"message": "exit logged", "gate_log_id": log.id})

