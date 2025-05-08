"use strict";


async function generateImage() {
	let file = document.getElementById("in").files[0];

	if (file.size > 2**32 - 1) {
		alert(`File too large! (${file.size} bytes)`);
		return;
	}

	let payload = new Uint8Array(await file.arrayBuffer());
	let imgData = encodeImage(payload);
	setImage(imgData);
}


function setImage(data) {
	document.getElementById("out-header").style.display = "inherit";

	let out = document.getElementById("out");
	out.src = URL.createObjectURL(new Blob([data]));
}


function writeHeader(buffer, payload) {
	let l = payload.length;
	buffer[0] = 0xff & (l >> 24);
	buffer[1] = 0xff & (l >> 16);
	buffer[2] = 0xff & (l >> 8);
	buffer[3] = 0xff & l;
}


function writeBlackPixels(buffer, fromIdx) {
	for (let i = fromIdx; i < buffer.length; ++i)
		buffer[i] = 0;
}


function encodeImage(payload) {
	// ARGB four channels, so each 4 byte sequence is made a pixel,
	// plus one pixel for the header.
	let width = Math.ceil(Math.sqrt(1 + payload.length / 4));

	const headerLength = 4;
	let paddingLength = (width * width) * 4 - headerLength - payload.length;

	let data = new Uint8ClampedArray(headerLength + payload.length + paddingLength);

	writeHeader(data, payload);
	data.set(payload, headerLength)
	writeBlackPixels(data, headerLength + payload.length);

	return UPNG.encode([data.buffer], width, width, 0)
}
