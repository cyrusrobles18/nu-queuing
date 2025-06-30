const Queue = require("../models/Queue");

const QueueController = {
  getAllQueue: async (req, res) => {
    try {
      const queues = await Queue.find({});
      res.json({ queues });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getQueueByDepartment: async (req, res) => {
    try {
      const { department } = req.params;
      const queues = await Queue.find({ department });
      res.json(queues);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching queue by department", error });
    }
  },
  createQueue: async (req, res) => {
    try {
      const queue = new Queue(req.body);
      await queue.save();
      // Emit queue update event
      req.app.get('io').emit('queue:update', { department: queue.department });
      res.status(201).json(queue);
    } catch (error) {
      res.status(500).json({ message: "Error creating queue", error });
    }
  },
  updateQueueStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const queue = await Queue.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      if (!queue) {
        return res.status(404).json({ message: "Queue not found" });
      }
      // Emit queue update event
      req.app.get('io').emit('queue:update', { department: queue.department });
      res.json(queue);
    } catch (error) {
      res.status(500).json({ message: "Error updating queue status", error });
    }
  },
  deleteQueue: async (req, res) => {
    try {
      const { id } = req.params;
      const queue = await Queue.findByIdAndDelete(id);
      if (!queue) {
        return res.status(404).json({ message: "Queue not found" });
      }
      // Emit queue update event
      req.app.get('io').emit('queue:update', { department: queue.department });
      res.json({ message: "Queue deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting queue", error });
    }
  },
};

module.exports = QueueController;
