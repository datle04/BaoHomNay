const User = require('../models/User');

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'editor', 'client'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Role updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
