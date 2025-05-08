import sys
from PIL import Image
from math import sqrt, ceil


def parse_header(data):
	return int.from_bytes(data[:4])


def decode_image(img):
	package = img.tobytes()
	return package[4:(4 + parse_header(package))]


if __name__ == "__main__":
	with open(sys.argv[2], mode="wb") as f:
		f.write(decode_image(Image.open(sys.argv[1])))
