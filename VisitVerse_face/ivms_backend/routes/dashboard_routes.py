from datetime import datetime, timedelta
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from database.db import db
from database.models import Visitor, Assessment, Verification, GateLog


dashboard_bp = Blueprint("dashboard", __name__)


def day_bounds(dt):
    start = datetime(dt.year, dt.month, dt.day)
    end = start + timedelta(days=1)
    return start, end


@dashboard_bp.get("/dashboard/stats")
@jwt_required()
def dashboard_stats():
    now = datetime.utcnow()
    start, end = day_bounds(now)

    total_visitors_today = (
        db.session.query(Visitor).filter(Visitor.created_at >= start, Visitor.created_at < end).count()
    )

    total_assessments = (
        db.session.query(Assessment).filter(Assessment.created_at >= start, Assessment.created_at < end).count()
    )
    passed_assessments = (
        db.session.query(Assessment)
        .filter(Assessment.created_at >= start, Assessment.created_at < end, Assessment.passed.is_(True))
        .count()
    )
    pass_rate = (passed_assessments / total_assessments) * 100 if total_assessments else 0.0

    failed_verifications = (
        db.session.query(Verification)
        .filter(Verification.created_at >= start, Verification.created_at < end)
        .filter((Verification.otp_verified.is_(False)) | (Verification.face_verified.is_(False)))
        .count()
    )

    durations = []
    logs = (
        db.session.query(GateLog)
        .filter(GateLog.entry_time >= start, GateLog.entry_time < end, GateLog.exit_time.is_not(None))
        .all()
    )
    for g in logs:
        durations.append((g.exit_time - g.entry_time).total_seconds())
    avg_gate_time = sum(durations) / len(durations) if durations else 0.0

    return jsonify(
        {
            "total_visitors_today": total_visitors_today,
            "pass_rate": round(pass_rate, 2),
            "failed_verifications": failed_verifications,
            "average_gate_time_seconds": round(avg_gate_time, 2),
        }
    )


@dashboard_bp.get("/dashboard/traffic")
@jwt_required()
def dashboard_traffic():
    now = datetime.utcnow()
    start, end = day_bounds(now)
    buckets = {h: 0 for h in range(24)}
    entries = db.session.query(GateLog).filter(GateLog.entry_time >= start, GateLog.entry_time < end).all()
    for e in entries:
        buckets[e.entry_time.hour] += 1
    data = [{"hour": h, "count": buckets[h]} for h in range(24)]
    return jsonify({"traffic": data})

