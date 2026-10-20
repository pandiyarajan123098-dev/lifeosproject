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
  RefreshCw,
  Send,
  Plus,
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
      fetchDashboardData();
    }
  };

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

  const handleSubmitProgress = async () => {
    setSubmitting(true);
    setSubmitMessage('');
    try {
      const res = await taskService.submitDailyProgress();
      if (res.success) {
        setSubmitMessage('Daily progress snapshot saved to SQL Server!');
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

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 animate-fade-in">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cardBorder">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-mainText tracking-tight">
                {stats?.greeting || 'Welcome back!'}
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary-dark border border-primary-200">
                Active Plan
              </span>
            </div>
            <p className="text-xs sm:text-sm text-secondaryText flex items-center gap-1.5 mt-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{todayFormatted}</span>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <Button
              size="sm"
              variant="outline"
              loading={generating}
              onClick={() => handleGenerateTasks(tasks.length > 0)}
              className="text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              {tasks.length > 0 ? 'Regenerate Tasks' : "Generate Today's Tasks"}
            </Button>

            <Link to="/tasks">
              <Button size="sm" variant="secondary" className="text-xs">
                View All Tasks
              </Button>
            </Link>

            <Link to="/profile">
              <Button size="sm" variant="ghost" className="border border-cardBorder text-xs">
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {error && <ErrorMessage title="Dashboard Alert" message={error} onRetry={fetchDashboardData} />}

        {submitMessage && (
          <div className="p-3.5 sm:p-4 rounded-control bg-green-50 border border-green-200 text-green-900 text-xs sm:text-sm flex items-center justify-between animate-fade-in shadow-soft">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              {submitMessage}
            </span>
            <button
              onClick={() => setSubmitMessage('')}
              className="text-green-700 hover:text-green-900 font-bold ml-2 p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* 4 Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProgressCard
            title="Today's Completion"
            value={`${percentage}%`}
            subtitle={`${completedTasks} of ${totalTasks} tasks completed`}
            badgeText={percentage === 100 && totalTasks > 0 ? '100% Done' : 'In Progress'}
            badgeVariant={percentage === 100 ? 'green' : 'violet'}
            icon={TrendingUp}
          />

          <ProgressCard
            title="Task Summary"
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
            title="Target Commitment"
            value={`${stats?.dailyAvailableMinutes || 60}m`}
            subtitle={`${stats?.skillLevel || 'Beginner'} experience level`}
            badgeText={stats?.skillLevel || 'Active'}
            badgeVariant="violet"
            icon={Clock}
          />
        </div>

        {/* Two-Column Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Today's Tasks Checklist (2 cols on large screen) */}
          <div className="lg:col-span-2 bg-white rounded-card border border-cardBorder p-5 sm:p-6 shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cardBorder/60">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-mainText flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Today's Daily Checklist
                </h2>
                <p className="text-xs text-secondaryText mt-0.5">
                  Check off items as you complete them to automatically track progress.
                </p>
              </div>

              {tasks.length > 0 && (
                <Button
                  size="sm"
                  variant="success"
                  loading={submitting}
                  onClick={handleSubmitProgress}
                  className="shrink-0 self-start sm:self-auto"
                  title="Save daily completion snapshot to database"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Submit Daily Progress
                </Button>
              )}
            </div>

            {/* Checklist items */}
            {tasks.length === 0 ? (
              <div className="py-12 px-4 text-center rounded-card border border-dashed border-cardBorder bg-page">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-mainText">No tasks generated for today yet</h3>
                <p className="text-xs text-secondaryText max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
                  Generate your personalized daily routine based on your skills and goals.
                </p>
                <Button
                  size="sm"
                  loading={generating}
                  onClick={() => handleGenerateTasks(false)}
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
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

          {/* Right: Weekly Productivity Chart & Goals */}
          <div className="space-y-6">
            {/* Weekly Productivity Chart */}
            <div className="bg-white rounded-card border border-cardBorder p-5 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-mainText flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Weekly Progress
                </h3>
                <span className="text-[11px] font-semibold text-primary bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                  Last 7 Days
                </span>
              </div>
              <ProgressChart data={stats?.weeklyChart || []} />
            </div>

            {/* Primary Goal & Focus Badges */}
            <div className="bg-white rounded-card border border-cardBorder p-5 shadow-soft space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondaryText block mb-1.5">
                  Primary Goal
                </span>
                <p className="text-xs sm:text-sm font-medium text-mainText bg-primary-50/70 p-3 rounded-control border border-primary-200 text-primary-900 leading-relaxed">
                  {stats?.primaryGoal || 'Define your primary goal in Profile settings.'}
                </p>
              </div>

              {/* Skills Tags */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondaryText block mb-1.5">
                  Focus Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(stats?.skills || []).length > 0 ? (
                    stats.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-page text-primary-dark border border-cardBorder"
                      >
                        {typeof s === 'object' ? s.name : s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-secondaryText">No skills recorded yet.</span>
                  )}
                </div>
              </div>

              {/* Interests Tags */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondaryText block mb-1.5">
                  Growth Areas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(stats?.interests || []).length > 0 ? (
                    stats.interests.map((intName, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-page text-mainText border border-cardBorder"
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
        <div className="bg-white rounded-card border border-cardBorder p-5 sm:p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-cardBorder/60">
            <h3 className="text-sm sm:text-base font-bold text-mainText flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              Recently Completed Activity
            </h3>
            <Link to="/history" className="text-xs font-semibold text-primary hover:text-primary-dark">
              View All History →
            </Link>
          </div>

          {(stats?.recentActivity || []).length === 0 ? (
            <p className="text-xs text-secondaryText py-6 text-center">
              No completed tasks yet. Check off items in your checklist above to build activity!
            </p>
          ) : (
            <div className="divide-y divide-cardBorder/60">
              {stats.recentActivity.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    <span className="font-semibold text-mainText truncate">{act.task_title}</span>
                    <span className="px-2 py-0.5 rounded bg-page text-secondaryText text-[10px] border border-cardBorder/60 shrink-0">
                      {act.category}
                    </span>
                  </div>
                  <span className="text-secondaryText shrink-0 font-medium">{act.task_date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
