import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Heart,
  Code2,
  Target,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import { taskService } from '../services/taskService';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import ErrorMessage from '../components/ErrorMessage';

const PRESET_INTERESTS = [
  'Web development',
  'Frontend development',
  'Backend development',
  'Full-stack development',
  'Artificial intelligence',
  'Machine learning',
  'Data science',
  'Cybersecurity',
  'UI/UX design',
  'Cloud computing',
  'Business and entrepreneurship',
  'Communication and English',
  'Fitness and healthy habits',
];

const PRESET_SKILLS = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'SQL',
  'Git and GitHub',
  'UI/UX',
  'Communication',
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [personal, setPersonal] = useState({
    firstName: user?.firstName || user?.fullName?.split(' ')[0] || '',
    lastName: user?.lastName || user?.fullName?.split(' ').slice(1).join(' ') || '',
    age: '',
    occupation: '',
    currentRole: '',
  });

  const [interests, setInterests] = useState(['Frontend development', 'Web development']);
  const [customInterest, setCustomInterest] = useState('');

  const [skills, setSkills] = useState([
    { name: 'HTML', level: 'Beginner' },
    { name: 'CSS', level: 'Beginner' },
    { name: 'JavaScript', level: 'Beginner' },
  ]);
  const [customSkill, setCustomSkill] = useState('');

  const [preferences, setPreferences] = useState({
    skillLevel: 'Beginner',
    primaryGoal: 'Become a job-ready developer and build daily consistency',
    secondaryGoal: 'Master full-stack web applications and modern frameworks',
    dailyAvailableMinutes: 60,
    learningStyle: 'Mixed',
    preferredTaskCount: 4,
    targetDate: '',
  });

  const validateStep1 = () => {
    if (!personal.firstName.trim()) {
      setError('Please provide your first name.');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (interests.length === 0) {
      setError('Please select at least one interest area.');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep3 = () => {
    if (skills.length === 0) {
      setError('Please select at least one skill.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preferences.primaryGoal.trim()) {
      setError('Please specify your primary career goal.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        first_name: personal.firstName,
        last_name: personal.lastName,
        age: personal.age ? parseInt(personal.age, 10) : null,
        occupation: personal.occupation || personal.currentRole,
        skill_level: preferences.skillLevel,
        primary_goal: preferences.primaryGoal,
        secondary_goal: preferences.secondaryGoal,
        daily_available_minutes: parseInt(preferences.dailyAvailableMinutes, 10),
        learning_style: preferences.learningStyle,
        target_date: preferences.targetDate || null,
        preferred_task_count: parseInt(preferences.preferredTaskCount, 10),
        interests,
        skills,
      };

      await profileService.saveOnboarding(payload);

      // Auto-generate today's initial tasks
      try {
        await taskService.generateTasks(false);
      } catch (genErr) {
        console.warn('Initial task generation notice:', genErr.message);
      }

      updateUser({
        firstName: personal.firstName,
        lastName: personal.lastName,
        skillLevel: preferences.skillLevel,
        primaryGoal: preferences.primaryGoal,
        dailyAvailableMinutes: preferences.dailyAvailableMinutes,
        onboardingCompleted: true,
      });

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to save onboarding details.'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (name) => {
    setInterests((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const addCustomInterest = (e) => {
    e.preventDefault();
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests([...interests, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const toggleSkill = (name) => {
    setSkills((prev) => {
      const exists = prev.some((s) => s.name === name);
      if (exists) {
        return prev.filter((s) => s.name !== name);
      } else {
        return [...prev, { name, level: 'Beginner' }];
      }
    });
  };

  const addCustomSkill = (e) => {
    e.preventDefault();
    if (customSkill.trim() && !skills.some((s) => s.name.toLowerCase() === customSkill.trim().toLowerCase())) {
      setSkills([...skills, { name: customSkill.trim(), level: 'Beginner' }]);
      setCustomSkill('');
    }
  };

  const stepsList = [
    { num: 1, label: 'Profile', icon: User },
    { num: 2, label: 'Interests', icon: Heart },
    { num: 3, label: 'Skills', icon: Code2 },
    { num: 4, label: 'Schedule', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-page flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans animate-fade-in overflow-x-hidden">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light text-primary-dark text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Personalized Setup Wizard</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-mainText tracking-tight">
            Welcome to LifeOS!
          </h1>
          <p className="mt-1 text-xs text-secondaryText">
            Step {step} of 4 &mdash; Customize your learning roadmap.
          </p>

          {/* Stepper Progress Bar */}
          <div className="mt-6 flex items-center justify-between relative max-w-sm sm:max-w-md mx-auto px-2">
            <div className="absolute top-1/2 left-4 right-4 h-1 bg-cardBorder -translate-y-1/2 -z-0">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>
            </div>

            {stepsList.map((s) => {
              const Icon = s.icon;
              const isDone = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div key={s.num} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isDone
                        ? 'bg-primary text-white shadow-soft'
                        : isCurrent
                        ? 'bg-white border-2 border-primary text-primary shadow-soft'
                        : 'bg-white border border-cardBorder text-gray-400'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-semibold mt-1.5 ${
                      isCurrent ? 'text-primary' : 'text-secondaryText'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-white p-5 sm:p-8 rounded-card border border-cardBorder shadow-card">
          {error && <ErrorMessage title="Setup Notice" message={error} className="mb-5" />}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-mainText">Personal Profile</h2>
                <p className="text-xs text-secondaryText">Tell us who you are so we can address you properly.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  required
                  placeholder="e.g. Alex"
                  value={personal.firstName}
                  onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })}
                />
                <Input
                  label="Last Name"
                  placeholder="e.g. Smith"
                  value={personal.lastName}
                  onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Age"
                  type="number"
                  min="10"
                  max="120"
                  placeholder="24"
                  value={personal.age}
                  onChange={(e) => setPersonal({ ...personal, age: e.target.value })}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Occupation / Major"
                    placeholder="e.g. Computer Science Student"
                    value={personal.occupation}
                    onChange={(e) => setPersonal({ ...personal, occupation: e.target.value })}
                  />
                </div>
              </div>

              <Input
                label="Current Role"
                placeholder="e.g. Aspiring Full Stack Developer"
                value={personal.currentRole}
                onChange={(e) => setPersonal({ ...personal, currentRole: e.target.value })}
              />

              <div className="pt-4 flex justify-end">
                <Button
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="w-full sm:w-auto"
                >
                  Continue to Interests
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-mainText">Your Growth Interests</h2>
                <p className="text-xs text-secondaryText">
                  Select subjects you want LifeOS to incorporate into your daily tasks.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {PRESET_INTERESTS.map((item) => {
                  const isSelected = interests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleInterest(item)}
                      className={`text-xs px-3 py-2 rounded-control font-medium border transition-all flex items-center gap-1.5 min-h-[38px] ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-soft'
                          : 'bg-page text-mainText border-cardBorder hover:border-primary-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {item}
                    </button>
                  );
                })}
              </div>

              {/* Custom interest tag adder */}
              <div className="pt-2 border-t border-cardBorder/60">
                <label className="block text-xs font-semibold text-mainText uppercase tracking-wider mb-2">
                  Add Custom Interest
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Cloud Security, Rust"
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomInterest(e)}
                    className="flex-1 rounded-control text-sm bg-white border border-cardBorder px-3 py-2 text-mainText focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <Button size="sm" variant="secondary" onClick={addCustomInterest}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <Button variant="ghost" onClick={() => setStep(1)} className="w-full sm:w-auto">
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back
                </Button>
                <Button
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                  className="w-full sm:w-auto"
                >
                  Continue to Skills
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Skills */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-mainText">Current Skills</h2>
                <p className="text-xs text-secondaryText">
                  Select technologies and tools you currently know or are actively learning.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {PRESET_SKILLS.map((item) => {
                  const isSelected = skills.some((s) => s.name === item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleSkill(item)}
                      className={`text-xs px-3 py-2 rounded-control font-medium border transition-all flex items-center gap-1.5 min-h-[38px] ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-soft'
                          : 'bg-page text-mainText border-cardBorder hover:border-primary-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {item}
                    </button>
                  );
                })}
              </div>

              {/* Custom skill adder */}
              <div className="pt-2 border-t border-cardBorder/60">
                <label className="block text-xs font-semibold text-mainText uppercase tracking-wider mb-2">
                  Add Custom Skill
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Next.js, Docker, Kotlin"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomSkill(e)}
                    className="flex-1 rounded-control text-sm bg-white border border-cardBorder px-3 py-2 text-mainText focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <Button size="sm" variant="secondary" onClick={addCustomSkill}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <Button variant="ghost" onClick={() => setStep(2)} className="w-full sm:w-auto">
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back
                </Button>
                <Button
                  onClick={() => {
                    if (validateStep3()) setStep(4);
                  }}
                  className="w-full sm:w-auto"
                >
                  Continue to Goals
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Goals & Time */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-mainText">Goals & Schedule</h2>
                <p className="text-xs text-secondaryText">
                  Specify your primary goal and daily time budget so we calibrate your tasks correctly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Experience Level"
                  required
                  value={preferences.skillLevel}
                  onChange={(e) => setPreferences({ ...preferences, skillLevel: e.target.value })}
                  options={[
                    { value: 'Beginner', label: 'Beginner (Starting from basics)' },
                    { value: 'Intermediate', label: 'Intermediate (Building projects)' },
                    { value: 'Advanced', label: 'Advanced (Refining architecture)' },
                  ]}
                />

                <Select
                  label="Daily Available Time"
                  required
                  value={preferences.dailyAvailableMinutes}
                  onChange={(e) =>
                    setPreferences({ ...preferences, dailyAvailableMinutes: parseInt(e.target.value, 10) })
                  }
                  options={[
                    { value: 15, label: '15 Minutes / Day' },
                    { value: 30, label: '30 Minutes / Day' },
                    { value: 60, label: '60 Minutes / Day (Recommended)' },
                    { value: 90, label: '90 Minutes / Day' },
                    { value: 120, label: '120 Minutes / Day' },
                  ]}
                />
              </div>

              <Input
                label="Primary Goal"
                required
                placeholder="e.g. Become a Full-Stack Web Developer and land an internship"
                value={preferences.primaryGoal}
                onChange={(e) => setPreferences({ ...preferences, primaryGoal: e.target.value })}
              />

              <Input
                label="Secondary Goal (Optional)"
                placeholder="e.g. Build an open-source portfolio and master SQL database design"
                value={preferences.secondaryGoal}
                onChange={(e) => setPreferences({ ...preferences, secondaryGoal: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Learning Style"
                  value={preferences.learningStyle}
                  onChange={(e) => setPreferences({ ...preferences, learningStyle: e.target.value })}
                  options={[
                    { value: 'Mixed', label: 'Mixed (Recommended)' },
                    { value: 'Hands-on Projects', label: 'Hands-on Projects' },
                    { value: 'Video', label: 'Video Tutorials' },
                    { value: 'Reading', label: 'Reading & Articles' },
                  ]}
                />

                <Select
                  label="Daily Task Count"
                  value={preferences.preferredTaskCount}
                  onChange={(e) =>
                    setPreferences({ ...preferences, preferredTaskCount: parseInt(e.target.value, 10) })
                  }
                  options={[
                    { value: 2, label: '2 Tasks' },
                    { value: 3, label: '3 Tasks' },
                    { value: 4, label: '4 Tasks (Standard)' },
                    { value: 5, label: '5 Tasks' },
                  ]}
                />

                <Input
                  label="Target Date (Optional)"
                  type="date"
                  value={preferences.targetDate}
                  onChange={(e) => setPreferences({ ...preferences, targetDate: e.target.value })}
                />
              </div>

              <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <Button variant="ghost" onClick={() => setStep(3)} className="w-full sm:w-auto">
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back
                </Button>
                <Button type="submit" loading={loading} className="w-full sm:w-auto">
                  Complete Setup & Launch Dashboard
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
