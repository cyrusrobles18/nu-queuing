const Window = require('../models/Window');
const WindowController = {
  getWindows: async (req, res) => {
    try {
      const windows = await Window.find({});
      res.json({ windows });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createWindow: async (req, res) => {
    try {
      const window = await Window.create(req.body);
      // Emit window update event
      req.app.get('io').emit('window:update', { department: window.department });
      res.status(201).json(window);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateWindow: async (req, res) => {
    try {
      const window = await Window.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!window) {
        return res.status(404).json({ message: 'Window not found' });
      }
      // Emit window update event
      req.app.get('io').emit('window:update', { department: window.department });
      res.json(window);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteWindow: async (req, res) => {
    try {
      const window = await Window.findByIdAndDelete(req.params.id);
      if (!window) {
        return res.status(404).json({ message: 'Window not found' });
      }
      // Emit window update event
      req.app.get('io').emit('window:update', { department: window.department });
      res.json({ message: 'Window deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getWindowByDepartment: async (req, res) => {
    try {
      const { department } = req.params;
      const windows = await Window.find({ department });
      res.json({ windows });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = WindowController;
