import { createReadStream, createWriteStream } from "node:fs";
export function getOutStream(pOutputTo) {
	if ("-" === pOutputTo) {
		return process.stdout;
	}
	return createWriteStream(pOutputTo);
}
export function getInStream(pInputFrom) {
	if ("-" === pInputFrom) {
		return process.stdin;
	}
	return createReadStream(pInputFrom);
}
