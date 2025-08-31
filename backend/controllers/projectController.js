const Project = require('../models/Project');
const hashIp = require('../utils/hashIp');
const { sendMail } = require('../utils/mailer');
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

    // Send email to project owner
    if (req.user.email) {
      await sendMail({
        to: req.user.email,
        subject: 'Project Created Successfully',
        text: `Hi ${req.user.name}, your project "${project.title}" has been created.`,
        html: `<p>Hi ${req.user.name}, your project "<b>${project.title}</b>" has been created.</p>`
      });
    }

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
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

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Use aggregation for consistent structure and proper average sorting
    const aggregationPipeline = [
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
          id: '$_id',
          title: 1,
          description: 1,
          imageUrl: 1,
          techStack: 1,
          links: 1,
          ratingCount: 1,
          ratingSum: 1,
          avgRating: 1,
          voterUserIds: 1,
          voterIpHashes: 1,
          userRatings: 1,
          createdAt: 1,
          updatedAt: 1,
          author_name: '$owner.name',
          likes_count: { $ifNull: ['$likes_count', 0] },
          views_count: { $ifNull: ['$views_count', 0] }
        }
      }
    ];

    // Add sorting
    if (sort === 'avgRating') {
      aggregationPipeline.push({ $sort: { avgRating: order === 'desc' ? -1 : 1 } });
    } else {
      aggregationPipeline.push({ $sort: { [sort]: order === 'desc' ? -1 : 1 } });
    }

    // Add pagination
    aggregationPipeline.push(
      { $skip: skip },
      { $limit: parseInt(limit) }
    );

    // Execute aggregation
    const projects = await Project.aggregate(aggregationPipeline);

    // Get total count for pagination
    const total = await Project.countDocuments(query);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNext = skip + projects.length < total;
    const hasPrev = parseInt(page) > 1;

    // Return data with pagination metadata while keeping frontend compatibility
    res.json({
      data: projects,
      meta: {
        page,
        limit,
        total
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner', '_id name');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Add computed average rating
    const avgRating = project.ratingCount > 0 ? (project.ratingSum / project.ratingCount).toFixed(1) : 0;
    
    // Return consistent structure
    res.status(200).json({
      ...project.toObject(),
      owner: {
        _id: project.owner._id,
        name: project.owner.name
      }
    });
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
      return res.status(400).json({ error: 'Score must be between 1 and 10' });
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
        return res.status(400).json({ error: 'Guest users can only rate once per project' });
      }

      project.voterIpHashes.push(ipHash);
      project.ratingCount += 1;
      project.ratingSum += score;
      myScore = score;
      isNewRating = true;
    }

    await project.save();

    const avgRating = project.ratingCount > 0 ? (project.ratingSum / project.ratingCount).toFixed(1) : 0;

    res.json({
      avgRating: parseFloat(avgRating),
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
