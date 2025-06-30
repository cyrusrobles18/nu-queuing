const express = require("express");
const router = express.Router();

const QueueController = require("../controllers/queueController");

router.route("/").get(QueueController.getAllQueue).post(QueueController.createQueue);
router.route("/:department").get(QueueController.getQueueByDepartment);
router.route("/:id/status").put(QueueController.updateQueueStatus);
router.route("/:id").delete(QueueController.deleteQueue);

module.exports = router;
