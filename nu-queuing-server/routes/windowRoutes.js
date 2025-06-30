const express = require("express");
const router = express.Router();

const WindowController = require("../controllers/windowController");

router.get("/", WindowController.getWindows);
router.post("/", WindowController.createWindow);
router.put("/:id", WindowController.updateWindow);
router.delete("/:id", WindowController.deleteWindow);
router.get("/:department", WindowController.getWindowByDepartment);

module.exports = router;
