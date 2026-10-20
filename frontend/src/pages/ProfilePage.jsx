import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Heart,
  Code2,
  Target,
  Lock,
  LogOut,
  Save,
  Plus,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import { authService } from '../services/authService';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import LoadingState from '../components/LoadingState';
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

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Profile Form State
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    age: '',
    occupation: '',
    skillLevel: 'Beginner',
    primaryGoal: '',
    secondaryGoal: '',
    dailyAvailableMinutes: 60,
    learningStyle: 'Mixed',
    preferredTaskCount: 4,
    targetDate: '',
  });

  const [interests, setInterests] = useState([]);
  const [customInterest, setCustomInterest] = useState('');

  const [skills, setSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');

  // Password Update State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setError('');
        const res = await profileService.getProfile();
        if (res.success && res.profile) {
          const p = res.profile;
          setProfile({
            firstName: p.first_name || '',
            lastName: p.last_name || '',
            age: p.age || '',
            occupation: p.occupation || '',
            skillLevel: p.skill_level || 'Beginner',
            primaryGoal: p.primary_goal || '',
            secondaryGoal: p.secondary_goal || '',
            dailyAvailableMinutes: p.daily_available_minutes || 60,
            learningStyle: p.learning_style || 'Mixed',
            preferredTaskCount: p.preferred_task_count || 4,
            targetDate: p.target_date || '',
          });
          setInterests(res.interests || []);
          setSkills(res.skills || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // Save General Profile and Preferences
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setError('');
    setSuccessMsg('');

    try {
      await profileService.updateProfile({
        first_name: profile.firstName,
        last_name: profile.lastName,
        age: profile.age ? parseInt(profile.age, 10) : null,
        occupation: profile.occupation,
        skill_level: profile.skillLevel,
        primary_goal: profile.primaryGoal,
        secondary_goal: profile.secondaryGoal,
        daily_available_minutes: parseInt(profile.dailyAvailableMinutes, 10),
        learning_style: profile.learningStyle,
        target_date: profile.targetDate || null,
        preferred_task_count: parseInt(profile.preferredTaskCount, 10),
      });

      // Save updated interests & skills
      await profileService.updateInterests(interests);
      await profileService.updateSkills(skills);

      updateUser({
        firstName: profile.firstName,
        lastName: profile.lastName,
        skillLevel: profile.skillLevel,
        primaryGoal: profile.primaryGoal,
        dailyAvailableMinutes: profile.dailyAvailableMinutes,
      });

      setSuccessMsg('Profile and preferences updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Toggle Interests
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

  // Toggle Skills
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

  // Update Password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError('Please provide both current and new passwords.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await authService.updatePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });

      if (res.success) {
        setPasswordSuccess('Password changed securely.');
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      }
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || err.message || 'Failed to update password.'
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading your profile settings..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-cardBorder/60">
          <div>
            <h1 className="text-2xl font-extrabold text-mainText tracking-tight flex items-center gap-2">
              <User className="w-6 h-6 text-primary" />
              Profile & Settings
            </h1>
            <p className="text-xs text-secondaryText mt-1">
              Manage your personal info, learning goals, interests, and account security.
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleLogout}
            className="text-red-600 border-red-200 hover:bg-red-50 self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Log Out
          </Button>
        </div>

        {error && <ErrorMessage title="Profile Notice" message={error} />}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-900 text-xs flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-success" />
              {successMsg}
            </span>
            <button onClick={() => setSuccessMsg('')} className="text-green-700 font-bold ml-2">✕</button>
          </div>
        )}

        {/* Form: Personal Info & Goals */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Card 1: Personal Details */}
          <div className="p-6 rounded-2xl bg-white border border-cardBorder shadow-soft space-y-4">
            <h2 className="text-base font-bold text-mainText flex items-center gap-2 border-b border-cardBorder pb-3">
              <User className="w-4 h-4 text-primary" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                required
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              />
              <Input
                label="Last Name"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Age"
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Education / Occupation"
                  value={profile.occupation}
                  onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Goals & Schedule */}
          <div className="p-6 rounded-2xl bg-white border border-cardBorder shadow-soft space-y-4">
            <h2 className="text-base font-bold text-mainText flex items-center gap-2 border-b border-cardBorder pb-3">
              <Target className="w-4 h-4 text-primary" />
              Goals & Time Budget
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Skill Level"
                value={profile.skillLevel}
                onChange={(e) => setProfile({ ...profile, skillLevel: e.target.value })}
                options={[
                  { value: 'Beginner', label: 'Beginner' },
                  { value: 'Intermediate', label: 'Intermediate' },
                  { value: 'Advanced', label: 'Advanced' },
                ]}
              />

              <Select
                label="Daily Available Time"
                value={profile.dailyAvailableMinutes}
                onChange={(e) =>
                  setProfile({ ...profile, dailyAvailableMinutes: parseInt(e.target.value, 10) })
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
              value={profile.primaryGoal}
              onChange={(e) => setProfile({ ...profile, primaryGoal: e.target.value })}
            />

            <Input
              label="Secondary Goal (Optional)"
              value={profile.secondaryGoal}
              onChange={(e) => setProfile({ ...profile, secondaryGoal: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Learning Style"
                value={profile.learningStyle}
                onChange={(e) => setProfile({ ...profile, learningStyle: e.target.value })}
                options={[
                  { value: 'Mixed', label: 'Mixed' },
                  { value: 'Hands-on Projects', label: 'Hands-on Projects' },
                  { value: 'Video', label: 'Video' },
                  { value: 'Reading', label: 'Reading' },
                ]}
              />

              <Select
                label="Daily Task Count"
                value={profile.preferredTaskCount}
                onChange={(e) =>
                  setProfile({ ...profile, preferredTaskCount: parseInt(e.target.value, 10) })
                }
                options={[
                  { value: 2, label: '2 Tasks' },
                  { value: 3, label: '3 Tasks' },
                  { value: 4, label: '4 Tasks' },
                  { value: 5, label: '5 Tasks' },
                ]}
              />

              <Input
                label="Target Date"
                type="date"
                value={profile.targetDate}
                onChange={(e) => setProfile({ ...profile, targetDate: e.target.value })}
              />
            </div>
          </div>

          {/* Card 3: Interests */}
          <div className="p-6 rounded-2xl bg-white border border-cardBorder shadow-soft space-y-4">
            <h2 className="text-base font-bold text-mainText flex items-center gap-2 border-b border-cardBorder pb-3">
              <Heart className="w-4 h-4 text-primary" />
              Manage Interests
            </h2>

            <div className="flex flex-wrap gap-2">
              {PRESET_INTERESTS.map((item) => {
                const isSelected = interests.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInterest(item)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl font-medium border transition-all ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-soft'
                        : 'bg-page text-mainText border-cardBorder hover:border-primary-300'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add custom interest..."
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomInterest(e)}
                className="flex-1 rounded-lg text-sm bg-page border border-cardBorder px-3 py-2 text-mainText focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="sm" variant="secondary" onClick={addCustomInterest}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Card 4: Skills */}
          <div className="p-6 rounded-2xl bg-white border border-cardBorder shadow-soft space-y-4">
            <h2 className="text-base font-bold text-mainText flex items-center gap-2 border-b border-cardBorder pb-3">
              <Code2 className="w-4 h-4 text-primary" />
              Manage Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {PRESET_SKILLS.map((item) => {
                const isSelected = skills.some((s) => s.name === item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleSkill(item)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl font-medium border transition-all ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-soft'
                        : 'bg-page text-mainText border-cardBorder hover:border-primary-300'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add custom skill..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomSkill(e)}
                className="flex-1 rounded-lg text-sm bg-page border border-cardBorder px-3 py-2 text-mainText focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="sm" variant="secondary" onClick={addCustomSkill}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Save Profile Button */}
          <div className="flex justify-end">
            <Button type="submit" loading={savingProfile} size="lg">
              <Save className="w-4 h-4 mr-2" />
              Save Profile Changes
            </Button>
          </div>
        </form>

        {/* Card 5: Change Password */}
        <div className="p-6 rounded-2xl bg-white border border-cardBorder shadow-soft space-y-4">
          <h2 className="text-base font-bold text-mainText flex items-center gap-2 border-b border-cardBorder pb-3">
            <Lock className="w-4 h-4 text-primary" />
            Security & Password Update
          </h2>

          {passwordError && <ErrorMessage title="Security Alert" message={passwordError} />}
          {passwordSuccess && (
            <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              {passwordSuccess}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              required
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
            />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              required
              helperText="Minimum 6 characters"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              required
              value={passwordData.confirmNewPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
              }
            />

            <Button type="submit" variant="outline" loading={savingPassword}>
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
