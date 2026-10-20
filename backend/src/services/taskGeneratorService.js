/**
 * LifeOS Task Recommendation Engine
 * Deterministic rule-based task generator tailored to user interests, skills,
 * experience level, daily available time, and learning style.
 * Designed to be extensible with AI/LLM providers in future phases.
 */

// Comprehensive catalog of curated tasks across domains, skill levels, and learning styles
const TASK_CATALOG = [
  // --- FRONTEND & WEB DEVELOPMENT ---
  {
    title: 'Master CSS Flexbox Alignment',
    description: 'Practice flex direction, justify-content, and align-items by building a responsive card row.',
    category: 'Frontend Development',
    skills: ['CSS', 'HTML', 'Frontend development', 'Web development'],
    levels: ['Beginner', 'Intermediate'],
    learningStyles: ['Hands-on Projects', 'Mixed'],
    duration: 15,
    priority: 'High',
  },
  {
    title: 'Build a Responsive Navigation Bar',
    description: 'Code a mobile-friendly hamburger menu that expands smoothly using CSS transitions and semantic HTML5.',
    category: 'Frontend Development',
    skills: ['HTML', 'CSS', 'JavaScript', 'Frontend development'],
    levels: ['Beginner', 'Intermediate'],
    learningStyles: ['Hands-on Projects', 'Mixed'],
    duration: 20,
    priority: 'High',
  },
  {
    title: 'Practice JavaScript DOM Manipulation',
    description: 'Create an interactive counter or to-do item adder using querySelector and addEventListener.',
    category: 'Frontend Development',
    skills: ['JavaScript', 'HTML', 'Web development'],
    levels: ['Beginner', 'Intermediate'],
    learningStyles: ['Hands-on Projects', 'Mixed'],
    duration: 15,
    priority: 'Medium',
  },
  {
    title: 'Explore Modern React Hooks (useState & useEffect)',
    description: 'Implement a timer component or data-fetching effect to understand state lifecycle and cleanup.',
    category: 'Frontend Development',
    skills: ['React', 'JavaScript', 'Frontend development'],
    levels: ['Intermediate', 'Advanced'],
    learningStyles: ['Hands-on Projects', 'Mixed', 'Reading'],
    duration: 20,
    priority: 'High',
  },
  {
    title: 'Component Design & Tailwind CSS Layout',
    description: 'Build a reusable modal dialog using utility classes and accessible ARIA attributes.',
    category: 'UI/UX Design',
    skills: ['CSS', 'UI/UX', 'React', 'Frontend development'],
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    learningStyles: ['Hands-on Projects', 'Mixed'],
    duration: 20,
    priority: 'Medium',
  },

  // --- BACKEND & DATABASE ---
  {
    title: 'Construct Parameterized SQL Queries',
    description: 'Write safe SELECT, INSERT, and UPDATE queries with placeholders to prevent SQL injection vulnerabilities.',
    category: 'Backend Development',
    skills: ['SQL', 'Backend development', 'Node.js'],
    levels: ['Beginner', 'Intermediate'],
    learningStyles: ['Hands-on Projects', 'Reading'],
    duration: 20,
    priority: 'High',
  },
  {
    title: 'Build a RESTful API Route with Express',
    description: 'Create a clean route handler with input validation, proper HTTP status codes, and error formatting.',
    category: 'Backend Development',
    skills: ['Node.js', 'JavaScript', 'Backend development'],
    levels: ['Beginner', 'Intermediate'],
    learningStyles: ['Hands-on Projects', 'Mixed'],
    duration: 20,
    priority: 'High',
  },
  {
    title: 'Implement JWT Authentication Flow',
    description: 'Review token creation, bearer header extraction, and middleware verification to secure API endpoints.',
    category: 'Backend Development',
    skills: ['Node.js', 'JavaScript', 'Cybersecurity', 'Backend development'],
    levels: ['Intermediate', 'Advanced'],
    learningStyles: ['Hands-on Projects', 'Video'],
    duration: 25,
    priority: 'High',
  },
  {
    title: 'Database Indexing & Query Optimization',
    description: 'Analyze execution plans in SSMS and create nonclustered indexes for foreign keys and lookup columns.',
    category: 'Backend Development',
    skills: ['SQL', 'Backend development'],
    levels: ['Intermediate', 'Advanced'],
    learningStyles: ['Reading', 'Mixed'],
    duration: 20,
    priority: 'Medium',
  },

  // --- FULL-STACK & GIT ---
  {
    title: 'Git Branching & Pull Request Workflow',
    description: 'Create a feature branch, commit changes with conventional messages, and simulate a pull request merge.',
    category: 'Full-stack Development',
    skills: ['Git and GitHub', 'Full-stack development'],
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    learningStyles: ['Hands-on Projects', 'Mixed'],
    duration: 15,
    priority: 'Medium',
  },
  {
    title: 'Connect Frontend Axios Service to Backend API',
    description: 'Set up an Axios client with base URL configuration and handle loading and error states gracefully.',
    category: 'Full-stack Development',
    skills: ['React', 'Node.js', 'JavaScript', 'Full-stack development'],
    levels: ['Intermediate', 'Advanced'],
    learningStyles: ['Hands-on Projects', 'Mixed'],
    duration: 25,
    priority: 'High',
  },

  // --- AI & DATA SCIENCE ---
  {
    title: 'Python Data Structures & List Comprehensions',
    description: 'Practice transforming lists, dictionaries, and filtering sets using idiomatic Python syntax.',
    category: 'Artificial Intelligence',
    skills: ['Python', 'Data science', 'Artificial intelligence'],
    levels: ['Beginner', 'Intermediate'],
    learningStyles: ['Hands-on Projects', 'Mixed'],
    duration: 20,
    priority: 'Medium',
  },
  {
    title: 'Explore Supervised Learning Algorithms',
    description: 'Read about the mathematical intuition behind Linear Regression and Decision Trees.',
    category: 'Machine Learning',
    skills: ['Machine learning', 'Artificial intelligence', 'Python'],
    levels: ['Beginner', 'Intermediate'],
    learningStyles: ['Reading', 'Video'],
    duration: 25,
    priority: 'Medium',
  },

  // --- CYBERSECURITY & CLOUD ---
  {
    title: 'OWASP Top 10 Security Audit',
    description: 'Inspect application inputs for Cross-Site Scripting (XSS), SQLi, and insecure direct object references.',
    category: 'Cybersecurity',
    skills: ['Cybersecurity', 'Backend development'],
    levels: ['Intermediate', 'Advanced'],
    learningStyles: ['Reading', 'Mixed'],
    duration: 20,
    priority: 'High',
  },
  {
    title: 'Cloud Deployment Environment Setup',
    description: 'Configure environment variables, CORS origins, and health check endpoints for production hosting.',
    category: 'Cloud Computing',
    skills: ['Cloud computing', 'Full-stack development'],
    levels: ['Intermediate', 'Advanced'],
    learningStyles: ['Hands-on Projects', 'Mixed'],
    duration: 20,
    priority: 'Medium',
  },

  // --- COMMUNICATION & PRODUCTIVITY ---
  {
    title: 'Technical Summary & Reflection Journal',
    description: 'Summarize today’s technical concepts in 3 bullet points to solidify retention and clarify doubts.',
    category: 'Communication and English',
    skills: ['Communication', 'Communication and English'],
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    learningStyles: ['Reading', 'Mixed'],
    duration: 10,
    priority: 'Low',
  },
  {
    title: 'Code Review & Clean Code Refactoring',
    description: 'Review variable naming, eliminate duplicate code, and verify error boundary coverage in your workspace.',
    category: 'Full-stack Development',
    skills: ['Git and GitHub', 'JavaScript', 'Full-stack development'],
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    learningStyles: ['Hands-on Projects', 'Reading'],
    duration: 15,
    priority: 'Medium',
  },

  // --- FITNESS & HABITS ---
  {
    title: 'Ergonomic Stretch & Eye Rest Break',
    description: 'Perform a 10-minute posture stretch and 20-20-20 rule eye rest to prevent physical fatigue during coding.',
    category: 'Fitness and healthy habits',
    skills: ['Fitness and healthy habits'],
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    learningStyles: ['Mixed', 'Hands-on Projects', 'Video', 'Reading'],
    duration: 10,
    priority: 'Low',
  },
];

/**
 * Generate daily tasks tailored to user profile
 */
function generateDailyTasks({
  profile = {},
  interests = [],
  skills = [],
  taskDate,
  recentTitles = [],
}) {
  const targetMinutes = profile.daily_available_minutes || 60;
  const userLevel = profile.skill_level || 'Beginner';
  const preferredCount = profile.preferred_task_count || 4;
  const userLearningStyle = profile.learning_style || 'Mixed';
  const interestNames = interests.map((i) => (typeof i === 'string' ? i.toLowerCase() : i.interest_name?.toLowerCase()));
  const skillNames = skills.map((s) => (typeof s === 'string' ? s.toLowerCase() : s.skill_name?.toLowerCase()));

  // Score tasks based on relevance
  const scoredTasks = TASK_CATALOG.map((task) => {
    let score = 0;

    // Match skills
    for (const skill of task.skills) {
      if (skillNames.includes(skill.toLowerCase())) {
        score += 4;
      }
    }

    // Match interests
    for (const interest of task.skills) {
      if (interestNames.includes(interest.toLowerCase())) {
        score += 3;
      }
    }

    // Match level
    if (task.levels.includes(userLevel)) {
      score += 2;
    }

    // Match learning style
    if (task.learningStyles.includes(userLearningStyle) || userLearningStyle === 'Mixed') {
      score += 1;
    }

    // Match goal keywords if provided
    if (profile.primary_goal) {
      const goalLower = profile.primary_goal.toLowerCase();
      if (task.skills.some((s) => goalLower.includes(s.toLowerCase()))) {
        score += 3;
      }
    }

    // Penalize recently assigned tasks to ensure freshness
    if (recentTitles.includes(task.title)) {
      score -= 5;
    }

    return { ...task, score };
  });

  // Sort by score descending
  scoredTasks.sort((a, b) => b.score - a.score);

  // Time budgeting: pick tasks matching user's targetMinutes
  const selectedTasks = [];
  let accumulatedMinutes = 0;

  for (const task of scoredTasks) {
    if (selectedTasks.length >= preferredCount && accumulatedMinutes >= targetMinutes) {
      break;
    }

    // Check if adding this task keeps us near the target minutes
    if (accumulatedMinutes + task.duration <= targetMinutes + 15 || selectedTasks.length === 0) {
      selectedTasks.push({
        task_title: task.title,
        task_description: task.description,
        category: task.category,
        estimated_minutes: task.duration,
        priority: task.priority,
        task_date: taskDate,
        is_completed: false,
      });
      accumulatedMinutes += task.duration;
    }

    if (selectedTasks.length >= Math.max(preferredCount, 6)) {
      break;
    }
  }

  // If time remains, add a reflection / review task
  if (accumulatedMinutes < targetMinutes) {
    const diff = targetMinutes - accumulatedMinutes;
    selectedTasks.push({
      task_title: 'Document Key Takeaways & Review Code',
      task_description: 'Spend time writing down what you learned today, documenting challenging bugs, and noting topics to revise tomorrow.',
      category: 'Productivity & Review',
      estimated_minutes: diff,
      priority: 'Low',
      task_date: taskDate,
      is_completed: false,
    });
  }

  return selectedTasks;
}

module.exports = {
  generateDailyTasks,
  TASK_CATALOG,
};
