const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    city:{
        type:String,
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  message: {
    type: String,
    default: "SOS Alert!",
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Acknowledged', 'Resolved'],
    default: 'Pending',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SOSAlert = mongoose.model('SOSAlert', sosAlertSchema);

module.exports = SOSAlert;
