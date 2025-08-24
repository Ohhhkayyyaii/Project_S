const Project = require('../models/Project');
const hashIp = require('../utils/hashIp');

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { title, description, imageUrl, techStack, links } = req.body;
    
    const project = await Project.create({
      title,
      description,
      imageUrl,
      techStack,
      links,
      owner: req.user._id
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all projects with pagination, search, and sorting
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const { limit = 10, page = 1, q = '', sort = 'createdAt', order = 'desc' } = req.query;
    
    // Build query
    let query = {};
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // Build sort object
    let sortObj = {};
    if (sort === 'avg') {
      sortObj = { $expr: { $divide: ['$ratingSum', { $max: ['$ratingCount', 1] }] } };
    } else {
      sortObj[sort] = order === 'desc' ? -1 : 1;
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    let projectsQuery = Project.find(query)
      .populate('owner', 'name email')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    // If sorting by average rating, we need to handle it differently
    if (sort === 'avg') {
      projectsQuery = Project.aggregate([
        { $match: query },
        {
          $addFields: {
            avgRating: {
              $cond: {
                if: { $gt: ['$ratingCount', 0] },
                then: { $divide: ['$ratingSum', '$ratingCount'] },
                else: 0
              }
            }
          }
        },
        { $sort: { avgRating: order === 'desc' ? -1 : 1 } },
        { $skip: skip },
        { $limit: parseInt(limit) },
        {
          $lookup: {
            from: 'users',
            localField: 'owner',
            foreignField: '_id',
            as: 'owner'
          }
        },
        { $unwind: '$owner' },
        {
          $project: {
            name: '$owner.name',
            email: '$owner.email'
          }
        }
      ]);
    }

    const projects = await projectsQuery;

    // Get total count for pagination
    const total = await Project.countDocuments(query);

    res.json({
      projects,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + projects.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (owner only)
const updateProject = async (req, res) => {
  try {
    const { title, description, imageUrl, techStack, links } = req.body;
    
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, imageUrl, techStack, links },
      { new: true, runValidators: true }
    ).populate('owner', 'name email');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (owner only)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Rate a project
// @route   POST /api/projects/:id/rate
// @access  Public
const rateProject = async (req, res) => {
  try {
    const { score } = req.body;
    
    // Validate score
    if (!score || score < 1 || score > 10) {
      return res.status(400).json({ message: 'Score must be between 1 and 10' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    let myScore = null;
    let isNewRating = false;

    if (req.user) {
      // Authenticated user rating
      const existingRatingIndex = project.userRatings.findIndex(
        rating => rating.userId.toString() === req.user._id.toString()
      );

      if (existingRatingIndex !== -1) {
        // Update existing rating
        const oldScore = project.userRatings[existingRatingIndex].score;
        project.ratingSum = project.ratingSum - oldScore + score;
        project.userRatings[existingRatingIndex].score = score;
        myScore = score;
      } else {
        // New rating
        project.userRatings.push({ userId: req.user._id, score });
        project.ratingCount += 1;
        project.ratingSum += score;
        project.voterUserIds.push(req.user._id);
        myScore = score;
        isNewRating = true;
      }
    } else {
      // Guest user rating
      const ipHash = hashIp(req.ip);
      
      if (project.voterIpHashes.includes(ipHash)) {
        return res.status(400).json({ message: 'Guest users can only rate once per project' });
      }

      project.voterIpHashes.push(ipHash);
      project.ratingCount += 1;
      project.ratingSum += score;
      myScore = score;
      isNewRating = true;
    }

    await project.save();

    const average = project.ratingCount > 0 ? (project.ratingSum / project.ratingCount).toFixed(1) : 0;

    res.json({
      average: parseFloat(average),
      count: project.ratingCount,
      myScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  rateProject
};
