import os
from utils.helpers import ensure_dir


def generate_qr(data, out_dir, filename):
    ensure_dir(out_dir)
    import qrcode
    img = qrcode.make(data)
    path = os.path.join(out_dir, filename)
    img.save(path)
    return path
