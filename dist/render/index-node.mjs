export default async function getRenderFunction(pOutputType) {
	const lOutputType2RenderModuleMap = new Map([
		["smcat", "./smcat.mjs"],
		["dot", "./dot/index.mjs"],
		["svg", "./vector/vector-native-dot-with-fallback.mjs"],
		["eps", "./vector/vector-native-dot-with-fallback.mjs"],
		["ps", "./vector/vector-native-dot-with-fallback.mjs"],
		["ps2", "./vector/vector-native-dot-with-fallback.mjs"],
		["oldsvg", "./vector/vector-with-wasm.mjs"],
		["oldps2", "./vector/vector-with-wasm.mjs"],
		["oldeps", "./vector/vector-with-wasm.mjs"],
		["pdf", "./vector/vector-native-dot-with-fallback.mjs"],
		["png", "./vector/vector-native-dot-with-fallback.mjs"],
		["scjson", "./scjson/index.mjs"],
		["scxml", "./scxml/index.mjs"],
	]);
	const lModule = lOutputType2RenderModuleMap.get(pOutputType);
	if (lModule) {
		const lImportedModule = await import(lModule);
		return lImportedModule.default;
	}
	return (pX) => pX;
}
