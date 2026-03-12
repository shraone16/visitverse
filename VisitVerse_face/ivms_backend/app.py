import os
from flask import Flask, send_from_directory, redirect
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from database.db import db


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    db.init_app(app)
    JWTManager(app)
    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})

    from routes.auth_routes import auth_bp
    from routes.visitor_routes import visitor_bp
    from routes.safety_routes import safety_bp
    from routes.assessment_routes import assessment_bp
    from routes.verification_routes import verification_bp
    from routes.gate_routes import gate_bp
    from routes.dashboard_routes import dashboard_bp

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(visitor_bp, url_prefix="/api")
    app.register_blueprint(safety_bp, url_prefix="/api")
    app.register_blueprint(assessment_bp, url_prefix="/api")
    app.register_blueprint(verification_bp, url_prefix="/api")
    app.register_blueprint(gate_bp, url_prefix="/api")
    app.register_blueprint(dashboard_bp, url_prefix="/api")

    # Serve frontend assets via Flask to avoid running a separate static server
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    pages_dir = os.path.join(project_root, "pages")
    js_dir = os.path.join(project_root, "js")
    css_dir = os.path.join(project_root, "css")

    @app.get("/")
    def frontend_index():
        return redirect("/pages/index.html")

    @app.get("/pages/<path:path>")
    def frontend_pages(path):
        return send_from_directory(pages_dir, path)

    @app.get("/js/<path:path>")
    def frontend_js(path):
        return send_from_directory(js_dir, path)

    @app.get("/css/<path:path>")
    def frontend_css(path):
        return send_from_directory(css_dir, path)

    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", 5000))
    app.run(host=host, port=port, debug=True)
