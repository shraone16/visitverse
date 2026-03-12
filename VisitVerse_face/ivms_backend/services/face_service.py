import os
import base64
import tempfile
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


def _decode_base64_image(b64_string: str, suffix: str = ".jpg") -> str:
    """Decode a base64 image string to a temporary file. Returns the temp file path."""
    # Strip data URI prefix if present (e.g. "data:image/jpeg;base64,...")
    if "," in b64_string:
        b64_string = b64_string.split(",", 1)[1]

    image_bytes = base64.b64decode(b64_string)
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    tmp.write(image_bytes)
    tmp.close()
    return tmp.name


def _find_stored_selfie(visitor_id: int, upload_folder: str) -> str | None:
    """Locate the registered selfie for the given visitor_id."""
    selfie_dir = Path(upload_folder) / "documents" / str(visitor_id)
    if not selfie_dir.exists():
        return None

    for f in selfie_dir.iterdir():
        if f.stem.startswith("selfie") and f.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
            return str(f)

    return None


def real_face_match(visitor_id: int, live_image_b64: str, upload_folder: str) -> dict:
    """
    Compare a live-capture selfie against the registered selfie on file.

    Parameters
    ----------
    visitor_id     : int   — DB ID of the visitor
    live_image_b64 : str   — base64-encoded image from webcam (with or without data-URI prefix)
    upload_folder  : str   — value of app.config["UPLOAD_FOLDER"]

    Returns
    -------
    dict with keys:
        similarity : float  (0.0 – 1.0, higher = more similar)
        matched    : bool   (True if similarity >= 0.75)
        error      : str | None
    """

    # ── 1. Locate stored selfie ──────────────────────────────────────────────
    stored_path = _find_stored_selfie(visitor_id, upload_folder)
    if not stored_path:
        logger.warning("No stored selfie found for visitor_id=%s", visitor_id)
        return {"similarity": 0.0, "matched": False, "error": "No registered selfie on file"}

    # ── 2. Decode live image to temp file ────────────────────────────────────
    live_path = None
    try:
        live_path = _decode_base64_image(live_image_b64)

        # ── 3. Run DeepFace verification ─────────────────────────────────────
        from deepface import DeepFace  # imported here so startup is unaffected if not installed

        result = DeepFace.verify(
            img1_path=stored_path,
            img2_path=live_path,
            model_name="Facenet",       # fast & accurate; alternatives: "VGG-Face", "ArcFace"
            detector_backend="opencv",  # lightweight; alternatives: "retinaface", "mtcnn"
            enforce_detection=False,    # don't crash if face isn't perfectly framed
            silent=True,
        )

        # DeepFace returns a distance (lower = more similar).
        # Convert to a 0-1 similarity score using the threshold it provides.
        distance = result.get("distance", 1.0)
        threshold = result.get("threshold", 0.40)

        # Normalise: distance=0 → similarity=1, distance>=threshold*1.5 → similarity=0
        if threshold > 0:
            similarity = max(0.0, min(1.0, 1.0 - (distance / (threshold * 1.5))))
        else:
            similarity = 0.0

        similarity = round(similarity, 4)
        matched = result.get("verified", False)

        logger.info(
            "Face match visitor_id=%s | distance=%.4f threshold=%.4f similarity=%.4f matched=%s",
            visitor_id, distance, threshold, similarity, matched,
        )
        return {"similarity": similarity, "matched": matched, "error": None}

    except ImportError:
        logger.error("deepface is not installed. Run: pip install deepface opencv-python-headless")
        return {
            "similarity": 0.0,
            "matched": False,
            "error": "Face recognition library not installed on server",
        }
    except Exception as exc:
        logger.exception("Face match failed for visitor_id=%s: %s", visitor_id, exc)
        return {"similarity": 0.0, "matched": False, "error": str(exc)}
    finally:
        # Always clean up temp file
        if live_path and os.path.exists(live_path):
            os.unlink(live_path)

