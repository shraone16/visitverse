from flask import Blueprint, jsonify, request
from database.db import db
from database.models import Assessment, Visitor


assessment_bp = Blueprint("assessment", __name__)


QUESTIONS = [
    {
        "id": 1,
        "q": "What does PPE stand for?",
        "options": ["Personal Protective Equipment", "Public Place Entry", "Power Performance Equipment", "Personal Privacy Essentials"],
        "answer": 0,
    },
    {"id": 2, "q": "When to report a hazard?", "options": ["After shift", "Immediately", "Next day", "Never"], "answer": 1},
    {"id": 3, "q": "Which is a fire class for liquids?", "options": ["A", "B", "C", "D"], "answer": 1},
    {"id": 4, "q": "Best way to lift heavy object?", "options": ["Back bend", "Straight legs", "Use legs", "Twist fast"], "answer": 2},
    {"id": 5, "q": "Hearing protection needed when?", "options": ["Quiet office", "Loud machinery", "Cafeteria", "Parking"], "answer": 1},
    {"id": 6, "q": "Emergency exit should be?", "options": ["Blocked", "Locked", "Clear", "Hidden"], "answer": 2},
    {"id": 7, "q": "Spill response first step?", "options": ["Ignore", "Inform supervisor", "Post online", "Cover with paper"], "answer": 1},
    {"id": 8, "q": "Safety shoes protect?", "options": ["Head", "Feet", "Hands", "Eyes"], "answer": 1},
    {"id": 9, "q": "Before operating equipment?", "options": ["No training", "Read manual and train", "Ask friend", "Guess controls"], "answer": 1},
    {"id": 10, "q": "PPE is required in?", "options": ["Designated areas", "Cafeteria", "Restrooms", "Parking only"], "answer": 0},
]


@assessment_bp.get("/assessment/questions")
def get_questions():
    payload = [{"id": q["id"], "question": q["q"], "options": q["options"]} for q in QUESTIONS]
    return jsonify({"questions": payload})


@assessment_bp.post("/assessment/submit")
def submit_assessment():
    data = request.get_json() or {}
    visitor_id = data.get("visitor_id")
    answers = data.get("answers", {})
    if not visitor_id:
        return jsonify({"message": "visitor_id required"}), 400
    v = db.session.get(Visitor, int(visitor_id))
    if not v:
        return jsonify({"message": "visitor not found"}), 404
    correct = 0
    for q in QUESTIONS:
        sel = answers.get(str(q["id"])) if isinstance(answers, dict) else None
        if sel is None:
            sel = next((a["answer"] for a in []), None)
        try:
            sel = int(sel)
        except Exception:
            sel = -1
        if sel == q["answer"]:
            correct += 1
    score = int(correct * 10)
    passed = score >= 70
    a = Assessment(visitor_id=v.id, score=score, passed=passed)
    db.session.add(a)
    db.session.commit()
    return jsonify({"score": score, "passed": passed})

