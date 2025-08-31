const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  techStack: [{
    type: String,
    trim: true
  }],
  links: {
    demo: {
      type: String,
      default: ''
    },
    repo: {
      type: String,
      default: ''
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  ratingSum: {
    type: Number,
    default: 0
  },
  voterUserIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  voterIpHashes: [{
    type: String
  }],
  userRatings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: {
      type: Number,
      min: 1,
      max: 10
    }
  }]
}, { timestamps: true });

// Virtual for average rating
projectSchema.virtual('avgRating').get(function() {
  return this.ratingCount > 0 ? (this.ratingSum / this.ratingCount).toFixed(1) : 0;
});

// Ensure virtual fields are serialized
projectSchema.set('toJSON', { virtuals: true });

// Database indexes for performance
projectSchema.index({ createdAt: -1 }); // For sorting by date
projectSchema.index({ ratingCount: -1, ratingSum: -1 }); // For rating-based sorting
projectSchema.index({ owner: 1 }); // For user's projects
projectSchema.index({ title: 'text', description: 'text' }); // For text search

module.exports = mongoose.model('Project', projectSchema);
