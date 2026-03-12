import os
import random
import string
from datetime import datetime
from werkzeug.utils import secure_filename


def ensure_dir(path):
    os.makedirs(path, exist_ok=True)
    return path


def save_upload(file_storage, dest_dir, filename=None):
    ensure_dir(dest_dir)
    name = filename or secure_filename(file_storage.filename)
    path = os.path.join(dest_dir, name)
    file_storage.save(path)
    return path


def random_otp(length=6):
    return "".join(random.choices(string.digits, k=length))


def utcnow():
    return datetime.utcnow()

