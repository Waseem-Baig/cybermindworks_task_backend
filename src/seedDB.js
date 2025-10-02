const mongoose = require("mongoose");
require("dotenv").config();
const Job = require("./models/Job");

// Comprehensive job data for seeding database
const sampleJobs = [
  // Amazon Jobs
  {
    title: "Full Stack Developer",
    company: "Amazon",
    description:
      "Join Amazon's world-class engineering team to build scalable web applications. Work with React, Node.js, and AWS services to create solutions that serve millions of customers worldwide. You'll be responsible for both frontend and backend development, collaborating with cross-functional teams to deliver high-quality software.",
    location: "Bangalore",
    salaryMin: "1000000",
    salaryMax: "1500000",
    jobType: "full-time",
    status: "published",
    requirements: [
      "React.js",
      "Node.js",
      "AWS",
      "JavaScript",
      "TypeScript",
      "MongoDB",
    ],
    benefits: [
      "Health Insurance",
      "Stock Options",
      "Flexible Working Hours",
      "Learning Budget",
    ],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  },
  {
    title: "Senior Frontend Developer",
    company: "Amazon",
    description:
      "Lead frontend development initiatives using modern JavaScript frameworks. Design and implement responsive, accessible, and performant user interfaces for Amazon's consumer-facing applications. Mentor junior developers and establish best practices for frontend development.",
    location: "Hyderabad",
    salaryMin: "1500000",
    salaryMax: "2200000",
    jobType: "full-time",
    status: "published",
    requirements: [
      "React.js",
      "Vue.js",
      "JavaScript",
      "TypeScript",
      "CSS3",
      "Webpack",
    ],
    benefits: [
      "Health Insurance",
      "Stock Options",
      "Relocation Assistance",
      "Gym Membership",
    ],
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Data Scientist",
    company: "Amazon",
    description:
      "Analyze large datasets to derive business insights and build machine learning models. Work with Amazon's recommendation systems, fraud detection, and customer behavior analysis. Use Python, SQL, and AWS ML services to solve complex business problems.",
    location: "Mumbai",
    salaryMin: "1800000",
    salaryMax: "2800000",
    jobType: "full-time",
    status: "published",
    requirements: [
      "Python",
      "SQL",
      "Machine Learning",
      "AWS",
      "TensorFlow",
      "Statistics",
    ],
    benefits: [
      "Health Insurance",
      "Stock Options",
      "Research Budget",
      "Conference Attendance",
    ],
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
  },

  // Tesla Jobs
  {
    title: "Node.js Developer",
    company: "Tesla",
    description:
      "Build high-performance backend services for Tesla's vehicle software and energy products. Work with cutting-edge technology in electric vehicle software development, charging infrastructure, and energy management systems. Focus on scalability, reliability, and real-time data processing.",
    location: "Chennai",
    salaryMin: "1200000",
    salaryMax: "1800000",
    jobType: "full-time",
    status: "published",
    requirements: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "Redis",
      "Docker",
      "Microservices",
    ],
    benefits: [
      "Health Insurance",
      "Stock Options",
      "Electric Vehicle Allowance",
      "Flexible Hours",
    ],
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Mobile App Developer",
    company: "Tesla",
    description:
      "Develop the Tesla mobile app used by millions of customers to control their vehicles, manage charging, and access energy products. Work with React Native, Swift, and Kotlin to create exceptional mobile experiences across iOS and Android platforms.",
    location: "Pune",
    salaryMin: "1400000",
    salaryMax: "2000000",
    jobType: "full-time",
    status: "published",
    requirements: [
      "React Native",
      "Swift",
      "Kotlin",
      "iOS",
      "Android",
      "Firebase",
    ],
    benefits: [
      "Health Insurance",
      "Stock Options",
      "Device Allowance",
      "Learning Budget",
    ],
    applicationDeadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Backend Developer Intern",
    company: "Tesla",
    description:
      "Learn server-side development with modern technologies while working on Tesla's innovative products. Gain hands-on experience with microservices architecture, real-time data processing, and cloud infrastructure. Perfect opportunity for students and new graduates.",
    location: "Delhi",
    salaryMin: "400000",
    salaryMax: "600000",
    jobType: "part-time",
    status: "published",
    requirements: [
      "Node.js",
      "Python",
      "Git",
      "REST APIs",
      "Basic Cloud Knowledge",
    ],
    benefits: [
      "Mentorship Program",
      "Learning Resources",
      "Flexible Schedule",
      "Future Employment Opportunities",
    ],
    applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  },

  // Microsoft Jobs
  {
    title: "Cloud Solutions Architect",
    company: "Microsoft",
    description:
      "Design and implement cloud solutions using Microsoft Azure. Help enterprise customers migrate to the cloud, optimize their infrastructure, and build scalable applications. Work with AI, machine learning, and modern development practices.",
    location: "Bangalore",
    salaryMin: "2500000",
    salaryMax: "3500000",
    jobType: "full-time",
    status: "published",
    requirements: [
      "Azure",
      "Cloud Architecture",
      "DevOps",
      "Kubernetes",
      "Terraform",
      "PowerShell",
    ],
    benefits: [
      "Health Insurance",
      "Stock Purchase Plan",
      "Sabbatical Leave",
      "Global Opportunities",
    ],
    applicationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Software Engineer",
    company: "Microsoft",
    description:
      "Join Microsoft's engineering team to build world-class software products. Work on Microsoft 365, Azure, or Windows platforms using modern development tools and practices. Collaborate with teams across the globe to deliver features used by billions.",
    location: "Hyderabad",
    salaryMin: "1600000",
    salaryMax: "2400000",
    jobType: "full-time",
    status: "published",
    requirements: ["C#", ".NET", "JavaScript", "Azure", "SQL Server", "Git"],
    benefits: [
      "Health Insurance",
      "Stock Purchase Plan",
      "Flexible Working",
      "Professional Development",
    ],
    applicationDeadline: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
  },

  // Google Jobs
  {
    title: "DevOps Engineer",
    company: "Google",
    description:
      "Manage cloud infrastructure and deployment pipelines for Google's products. Ensure system reliability, performance optimization, and security in modern cloud environments. Work with Google Cloud Platform, Kubernetes, and cutting-edge DevOps tools.",
    location: "Remote",
    salaryMin: "2000000",
    salaryMax: "3000000",
    jobType: "remote",
    status: "published",
    requirements: [
      "Google Cloud Platform",
      "Kubernetes",
      "Docker",
      "Terraform",
      "Python",
      "Linux",
    ],
    benefits: [
      "Health Insurance",
      "Stock Options",
      "Remote Work Setup",
      "Professional Development",
    ],
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },
  {
    title: "UX/UI Designer",
    company: "Google",
    description:
      "Create beautiful and intuitive user interfaces for Google's products. Design user experiences that delight customers and drive business growth. Work with design systems, conduct user research, and collaborate with product managers and engineers.",
    location: "Mumbai",
    salaryMin: "1300000",
    salaryMax: "2000000",
    jobType: "full-time",
    status: "published",
    requirements: [
      "Figma",
      "Adobe Creative Suite",
      "User Research",
      "Prototyping",
      "Design Systems",
    ],
    benefits: [
      "Health Insurance",
      "Stock Options",
      "Design Tool Subscriptions",
      "Creative Budget",
    ],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },

  // Startup Jobs
  {
    title: "Full Stack Developer",
    company: "TechStartup Inc",
    description:
      "Join a fast-growing startup to build innovative web applications from scratch. Work directly with founders, have significant impact on product decisions, and grow with the company. Flexible work environment with opportunities for rapid career growth.",
    location: "Gurgaon",
    salaryMin: "800000",
    salaryMax: "1400000",
    jobType: "full-time",
    status: "published",
    requirements: [
      "React.js",
      "Node.js",
      "MongoDB",
      "AWS",
      "Git",
      "Agile Methodology",
    ],
    benefits: [
      "Equity Options",
      "Flexible Hours",
      "Work From Home",
      "Learning Budget",
    ],
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
  },
  {
    title: "React Developer",
    company: "InnovateTech",
    description:
      "Build responsive and interactive user interfaces for our SaaS platform. Work with modern React ecosystem including Redux, React Router, and testing libraries. Collaborate with designers and backend developers to create seamless user experiences.",
    location: "Noida",
    salaryMin: "900000",
    salaryMax: "1500000",
    jobType: "full-time",
    status: "published",
    requirements: ["React.js", "Redux", "JavaScript", "HTML5", "CSS3", "Jest"],
    benefits: [
      "Health Insurance",
      "Flexible Hours",
      "Skill Development",
      "Team Outings",
    ],
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
  },

  // Contract/Freelance Jobs
  {
    title: "Freelance Python Developer",
    company: "ConsultingCorp",
    description:
      "Work on diverse Python projects for multiple clients. Build web applications, data analysis tools, and automation scripts. Perfect for experienced developers looking for flexibility and variety in their work.",
    location: "Remote",
    salaryMin: "1200000",
    salaryMax: "2000000",
    jobType: "contract",
    status: "published",
    requirements: [
      "Python",
      "Django",
      "Flask",
      "PostgreSQL",
      "Docker",
      "API Development",
    ],
    benefits: [
      "Flexible Schedule",
      "Multiple Projects",
      "Competitive Rates",
      "Skill Diversity",
    ],
    applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    // Clear existing jobs
    await Job.deleteMany({});
    console.log("Cleared existing jobs");

    // Insert sample jobs
    const createdJobs = await Job.insertMany(sampleJobs);
    console.log(`✅ Inserted ${createdJobs.length} sample jobs`);

    // Display created jobs
    console.log("\n📋 Created Jobs:");
    createdJobs.forEach((job, index) => {
      console.log(
        `${index + 1}. ${job.title} at ${job.company} (${job.location})`
      );
    });

    console.log("\n🎉 Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
