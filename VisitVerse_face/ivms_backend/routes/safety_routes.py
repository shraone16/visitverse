from flask import Blueprint, jsonify


safety_bp = Blueprint("safety", __name__)


RULES = {
    "welding": {
        "rules": [
            "Wear welding helmet",
            "Ensure ventilation",
            "No flammables nearby",
        ],
        "ppe": ["Helmet", "Gloves", "Apron", "Boots"],
    },
    "assembly": {
        "rules": [
            "Tie hair and loose clothing",
            "Follow lockout-tagout",
            "Keep area clean",
        ],
        "ppe": ["Safety glasses", "Gloves", "Shoes"],
    },
    "lab": {
        "rules": [
            "No food or drink",
            "Use fume hood for chemicals",
            "Know emergency shower location",
        ],
        "ppe": ["Coat", "Glasses", "Gloves"],
    },
}


@safety_bp.get("/safety-rules/<department>")
def safety_rules(department):
    d = department.lower()
    payload = RULES.get(d) or {"rules": ["Follow site supervisor instructions"], "ppe": ["Glasses", "Shoes"]}
    return jsonify({"department": d, **payload})

