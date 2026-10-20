import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Flame,
  Target,
  Sparkles,
  ArrowRight,
  Clock,
  TrendingUp,
  Award,
  Layers,
  RefreshCw,
  Send,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { taskService } from '../services/taskService';
import ProgressCard from '../components/ProgressCard';
import ProgressChart from '../components/ProgressChart';
import TaskCard from '../components/TaskCard';
import Button from '../components/Button';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';

export default function DashboardPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const fetchDashboardData = async () => {
    try {
      setError('');
      const res = await taskService.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
        setTasks(res.data.todayTasks || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Unable to load dashboard data.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle task completion toggle
  const handleToggleTask = async (taskId, isCompleted) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, is_completed: isCompleted } : t))
    );

    try {
      const res = await taskService.toggleTask(taskId, isCompleted);
      if (res.success && res.stats) {
        setStats((prev) => ({
          ...prev,
          todayStats: res.stats,
        }));
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      // Revert on error
      fetchDashboardData();
    }
  };

  // Generate today's tasks
  const handleGenerateTasks = async (regenerate = false) => {
    setGenerating(true);
    setError('');
    setSubmitMessage('');
    try {
      const res = await taskService.generateTasks(regenerate);
      if (res.success) {
        setTasks(res.tasks || []);
        if (res.stats) {
          setStats((prev) => ({
            ...prev,
            todayStats: res.stats,
          }));
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to generate today's tasks."
      );
    } finally {
      setGenerating(false);
    }
  };

  // Submit daily progress snapshot
  const handleSubmitProgress = async () => {
    setSubmitting(true);
    setSubmitMessage('');
    try {
      const res = await taskService.submitDailyProgress();
      if (res.success) {
        setSubmitMessage('Daily progress snapshot saved to SQL Server!');
        // Refresh streak and charts
        fetchDashboardData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit daily progress snapshot.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading your personalized dashboard..." />
      </DashboardLayout>
    );
  }

  const todayStats = stats?.todayStats || { total: 0, completed: 0, percentage: 0 };
  const totalTasks = todayStats.total;
  const completedTasks = todayStats.completed;
  const percentage = todayStats.percentage;
  const streak = stats?.streak || 0;

  // Format today's date nicely
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Top Header / Greeting Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-cardBorder/60">
          <div>
            <h1 className="text-2xl font-extrabold text-mainText tracking-tight">
              {stats?.greeting || 'Welcome back!'}
            </h1>
            <p className="text-xs text-secondaryText flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>{todayFormatted}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              loading={generating}
              onClick={() => handleGenerateTasks(tasks.length > 0)}
              title="Generate or refresh daily task list"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              {tasks.length > 0 ? 'Regenerate Tasks' : "Generate Today's Tasks"}
            </Button>

            <Link to="/tasks">
              <Button size="sm" variant="secondary">
                View All Tasks
              </Button>
            </Link>

            <Link to="/profile">
              <Button size="sm" variant="ghost" className="border border-cardBorder">
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {error && <ErrorMessage title="Dashboard Alert" message={error} onRetry={fetchDashboardData} />}

        {submitMessage && (
          <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-900 text-xs flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-success" />
              {submitMessage}
            </span>
            <button
              onClick={() => setSubmitMessage('')}
              className="text-green-700 hover:text-green-900 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* 4 KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProgressCard
            title="Today's Completion"
            value={`${percentage}%`}
            subtitle={`${completedTasks} of ${totalTasks} tasks finished`}
            badgeText={percentage === 100 && totalTasks > 0 ? 'Completed' : 'In Progress'}
            badgeVariant={percentage === 100 ? 'green' : 'violet'}
            icon={TrendingUp}
          />

          <ProgressCard
            title="Tasks Status"
            value={`${completedTasks} / ${totalTasks}`}
            subtitle={totalTasks > 0 ? `${totalTasks - completedTasks} remaining today` : 'No tasks generated'}
            badgeText={totalTasks > 0 ? `${totalTasks} items` : 'Empty'}
            badgeVariant="violet"
            icon={CheckCircle2}
          />

          <ProgressCard
            title="Consistency Streak"
            value={`${streak} ${streak === 1 ? 'Day' : 'Days'}`}
            subtitle="Verified SQL completion streak"
            badgeText={streak > 0 ? 'Active 🔥' : 'Start Today'}
            badgeVariant={streak > 0 ? 'amber' : 'violet'}
            icon={Flame}
          />

          <ProgressCard
            title="Daily Target Time"
            value={`${stats?.dailyAvailableMinutes || 60}m`}
            subtitle={`${stats?.skillLevel || 'Beginner'} experience tier`}
            badgeText={stats?.skillLevel || 'Active'}
            badgeVariant="violet"
            icon={Clock}
          />
        </div>

        {/* Two-Column Middle Section: Today's Tasks Checklist & Weekly Progress Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Today's Interactive Checklist (2 cols wide) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-cardBorder p-5 sm:p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-mainText flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Today's Daily Checklist
                </h2>
                <p className="text-xs text-secondaryText mt-0.5">
                  Check off items as you complete them to automatically record your progress.
                </p>
              </div>

              {tasks.length > 0 && (
                <Button
                  size="sm"
                  variant="success"
                  loading={submitting}
                  onClick={handleSubmitProgress}
                  className="shrink-0"
                  title="Save daily completion snapshot to database"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Submit Daily Progress
                </Button>
              )}
            </div>

            {/* Checklist items */}
            {tasks.length === 0 ? (
              <div className="py-12 px-4 text-center rounded-xl border border-dashed border-cardBorder bg-page">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-mainText">No tasks generated for today yet</h3>
                <p className="text-xs text-secondaryText max-w-sm mx-auto mt-1 mb-4">
                  LifeOS creates tasks tailored to your skills, interests, and schedule.
                </p>
                <Button
                  size="sm"
                  loading={generating}
                  onClick={() => handleGenerateTasks(false)}
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  Generate Today's Tasks
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Weekly Chart & Focus Info */}
          <div className="space-y-6">
            {/* Weekly Progress Chart */}
            <div className="bg-white rounded-2xl border border-cardBorder p-5 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-mainText flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Weekly Completion %
                </h3>
                <span className="text-xs font-semibold text-primary">Last 7 Days</span>
              </div>
              <ProgressChart data={stats?.weeklyChart || []} />
            </div>

            {/* Focus & Profile Snapshot */}
            <div className="bg-white rounded-2xl border border-cardBorder p-5 shadow-soft space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondaryText block mb-1">
                  Primary Goal
                </span>
                <p className="text-xs font-medium text-mainText bg-primary-50 p-2.5 rounded-lg border border-primary-200 text-primary-900 leading-relaxed">
                  {stats?.primaryGoal || 'Define your primary objective in Profile'}
                </p>
              </div>

              {/* Skills Tags */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondaryText block mb-1.5">
                  Your Focus Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(stats?.skills || []).length > 0 ? (
                    stats.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-page text-primary-dark border border-cardBorder"
                      >
                        {typeof s === 'object' ? s.name : s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-secondaryText">No skills added yet.</span>
                  )}
                </div>
              </div>

              {/* Interests Tags */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondaryText block mb-1.5">
                  Selected Interests
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(stats?.interests || []).length > 0 ? (
                    stats.interests.map((intName, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-page text-mainText border border-cardBorder"
                      >
                        {intName}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-secondaryText">No interests selected.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-2xl border border-cardBorder p-5 sm:p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-mainText flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              Recent Completed Activity
            </h3>
            <Link to="/history" className="text-xs font-semibold text-primary hover:text-primary-dark">
              View History →
            </Link>
          </div>

          {(stats?.recentActivity || []).length === 0 ? (
            <p className="text-xs text-secondaryText py-4 text-center">
              No completed tasks yet. Check off items in your checklist above to build activity!
            </p>
          ) : (
            <div className="divide-y divide-cardBorder/60">
              {stats.recentActivity.map((act) => (
                <div key={act.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    <span className="font-medium text-mainText truncate">{act.task_title}</span>
                    <span className="px-2 py-0.5 rounded bg-page text-secondaryText text-[10px] border border-cardBorder/60">
                      {act.category}
                    </span>
                  </div>
                  <span className="text-secondaryText shrink-0">{act.task_date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
