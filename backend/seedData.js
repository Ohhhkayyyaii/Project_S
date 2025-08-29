const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
require('dotenv').config();

const sampleProjects = [
  {
    title: "E-Commerce Platform",
    description: "A modern e-commerce platform built with React and Node.js. Features include user authentication, product catalog, shopping cart, and payment integration.",
    imageUrl: "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=E-Commerce",
    techStack: ["React", "Node.js", "MongoDB", "Stripe"],
    links: {
      github: "https://github.com/example/ecommerce",
      live: "https://ecommerce-demo.com"
    },
    ratingCount: 15,
    ratingSum: 135,
    likes_count: 42,
    views_count: 156
  },
  {
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, team collaboration, and progress tracking.",
    imageUrl: "https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Task+Manager",
    techStack: ["Vue.js", "Express", "Socket.io", "PostgreSQL"],
    links: {
      github: "https://github.com/example/taskmanager",
      live: "https://taskmanager-demo.com"
    },
    ratingCount: 23,
    ratingSum: 207,
    likes_count: 67,
    views_count: 234
  },
  {
    title: "Weather Dashboard",
    description: "A beautiful weather dashboard that displays current weather and forecasts for multiple cities with interactive charts.",
    imageUrl: "https://via.placeholder.com/400x300/FF9800/FFFFFF?text=Weather+App",
    techStack: ["JavaScript", "Chart.js", "OpenWeather API", "CSS3"],
    links: {
      github: "https://github.com/example/weather",
      live: "https://weather-demo.com"
    },
    ratingCount: 8,
    ratingSum: 72,
    likes_count: 28,
    views_count: 89
  },
  {
    title: "Portfolio Website",
    description: "A responsive portfolio website showcasing projects, skills, and contact information with smooth animations.",
    imageUrl: "https://via.placeholder.com/400x300/9C27B0/FFFFFF?text=Portfolio",
    techStack: ["HTML5", "CSS3", "JavaScript", "GSAP"],
    links: {
      github: "https://github.com/example/portfolio",
      live: "https://portfolio-demo.com"
    },
    ratingCount: 12,
    ratingSum: 108,
    likes_count: 35,
    views_count: 123
  },
  {
    title: "Chat Application",
    description: "Real-time chat application with user authentication, message history, and file sharing capabilities.",
    imageUrl: "https://via.placeholder.com/400x300/607D8B/FFFFFF?text=Chat+App",
    techStack: ["React", "Socket.io", "MongoDB", "AWS S3"],
    links: {
      github: "https://github.com/example/chatapp",
      live: "https://chat-demo.com"
    },
    ratingCount: 19,
    ratingSum: 171,
    likes_count: 53,
    views_count: 187
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/project_showcase');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Project.deleteMany({});
    console.log('Cleared existing projects');

    // Create sample user
    const user = await User.findOne({ email: 'demo@example.com' });
    let demoUser;
    
    if (!user) {
      demoUser = await User.create({
        name: 'Demo User',
        email: 'demo@example.com',
        password: 'password123'
      });
      console.log('Created demo user');
    } else {
      demoUser = user;
    }

    // Add owner to each project
    const projectsWithOwner = sampleProjects.map(project => ({
      ...project,
      owner: demoUser._id
    }));

    // Insert sample projects
    await Project.insertMany(projectsWithOwner);
    console.log('Inserted sample projects');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
