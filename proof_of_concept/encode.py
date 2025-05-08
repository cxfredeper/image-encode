import sys
from math import sqrt, ceil
from PIL import Image


def prepare_header(data):
	l = len(data)
	a = 0xff & l
	b = 0xff & (l >> 8)
	c = 0xff & (l >> 16)
	return bytes([c, b, a])


def pad_suffix(data, length, val=b'\x00'):
	pad_len = length - len(data)
	if pad_len <= 0:
		return b''
	return val * length


def encode_image(data):
	if len(data) > 2**24:
		raise RuntimeError

	width = ceil(sqrt(1 + len(data) / 3))

	header = prepare_header(data)
	padding = pad_suffix(data, width * width * 3)
	package = b''.join([header, data, padding])
	img = Image.frombuffer(mode="RGB", size=(width, width), data=package)
	return img


if __name__ == "__main__":
	with open(sys.argv[1], mode="rb") as f:
		data = f.read()
	encode_image(data).save(sys.argv[2])
