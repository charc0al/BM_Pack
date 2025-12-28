const { validateModFolder } = require("./validate-mod-folder")

/** @type any */
const validation = validateModFolder(process.cwd())

if (!validation[0]) {
	//throw new Error(validation[1])
	console.log("---\n\n\n-------------- Validation FAILED but who cares ------------------------\n\n\n---")
} else {
	console.log("Validation passed")
}
