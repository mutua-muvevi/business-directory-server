const multer = require("multer");
const path = require("path");
const { extensionMappings } = require("../config/extension-mapping");

// Step 1: Define the memory storage
const storage = multer.memoryStorage();

// Step 2: Set up the file filtering mechanism
const fileFilter = (req, file, cb) => {
	// Convert extension to lowercase
	const ext = path.extname(file.originalname).toLowerCase();
	console.log("File", req.file)

	const allowedExtensions = Object.keys(extensionMappings);
	
	if (!allowedExtensions.includes(ext)) {
		cb(new Error(`Only ${allowedExtensions.join(", ")} files are allowed`), false);
		return;
	}
	cb(null, true);
};

// Step 3: Create a multer instance with the specified storage and filter
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 100 * 1024 * 1024 }  // limit files to 100MB
});

exports.upload = upload;
