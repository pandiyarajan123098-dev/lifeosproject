import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Sparkles,
  RefreshCw,
  Send,
  CheckCircle2,
  Clock,
  Tag,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { taskService } from '../services/taskService';
import TaskCard from '../components/TaskCard';
import Button from '../components/Button';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';

export default function DailyTasksPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, percentage: 0 });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'incomplete', 'completed'
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState('');

  const fetchTasks = async () => {
    try {
      setError('');
      const res = await taskService.getTodayTasks();
      if (res.success) {
        setTasks(res.tasks || []);
        setStats(res.stats || { total: 0, completed: 0, percentage: 0 });
        setIsSubmitted(Boolean(res.isSubmitted));
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggle = async (taskId, isCompleted) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, is_completed: isCompleted } : t))
    );

    try {
      const res = await taskService.toggleTask(taskId, isCompleted);
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
      fetchTasks();
    }
  };

  const handleGenerate = async (regenerate = false) => {
    setGenerating(true);
    setError('');
    setNotification('');
    try {
      const res = await taskService.generateTasks(regenerate);
      if (res.success) {
        setTasks(res.tasks || []);
        if (res.stats) setStats(res.stats);
        setNotification(regenerate ? 'Tasks regenerated successfully!' : "Today's tasks generated!");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate tasks.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmitDaily = async () => {
    setSubmitting(true);
    setError('');
    setNotification('');
    try {
      const res = await taskService.submitDailyProgress();
      if (res.success) {
        setIsSubmitted(true);
        setNotification('Daily progress snapshot recorded in SQL Server!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit daily progress.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message="Fetching today's personalized tasks..." />
      </DashboardLayout>
    );
  }

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'completed') return t.is_completed;
    if (filterStatus === 'incomplete') return !t.is_completed;
    return true;
  });

  const totalEstimatedMinutes = tasks.reduce((acc, t) => acc + (t.estimated_minutes || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-4xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cardBorder">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-mainText tracking-tight flex items-center gap-2.5">
              <CheckSquare className="w-6 h-6 text-primary" />
              Daily Action Plan
            </h1>
            <p className="text-xs sm:text-sm text-secondaryText mt-1">
              Curated daily tasks matching your goals, interests, and available time budget.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              loading={generating}
              onClick={() => handleGenerate(tasks.length > 0)}
              className="text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              {tasks.length > 0 ? 'Regenerate Tasks' : 'Generate Tasks'}
            </Button>

            {tasks.length > 0 && (
              <Button
                size="sm"
                variant="success"
                loading={submitting}
                onClick={handleSubmitDaily}
                className="text-xs"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Submit Progress
              </Button>
            )}
          </div>
        </div>

        {error && <ErrorMessage title="Task Notice" message={error} onRetry={fetchTasks} />}

        {notification && (
          <div className="p-3.5 sm:p-4 rounded-control bg-green-50 border border-green-200 text-green-900 text-xs sm:text-sm flex items-center justify-between animate-fade-in shadow-soft">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              {notification}
            </span>
            <button
              onClick={() => setNotification('')}
              className="text-green-700 hover:text-green-900 font-bold ml-2 p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Progress Bar & Summary Card */}
        <div className="p-5 sm:p-6 rounded-card bg-white border border-cardBorder shadow-soft space-y-3.5">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-semibold text-secondaryText uppercase tracking-wider text-[11px] sm:text-xs">
              Today's Completion
            </span>
            <span className="font-bold text-primary text-base sm:text-lg">{stats.percentage}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-primary-light overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${stats.percentage}%` }}
            ></div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-secondaryText pt-1 font-medium">
            <span>
              {stats.completed} of {stats.total} tasks completed
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
              Total Estimated Time: {totalEstimatedMinutes} mins
            </span>
            {isSubmitted && (
              <span className="font-semibold text-success flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Daily Snapshot Saved
              </span>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        {tasks.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-cardBorder pb-2.5">
            {[
              { id: 'all', label: `All Tasks (${tasks.length})` },
              { id: 'incomplete', label: `Pending (${tasks.filter((t) => !t.is_completed).length})` },
              { id: 'completed', label: `Completed (${tasks.filter((t) => t.is_completed).length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id)}
                className={`text-xs sm:text-sm px-3.5 py-1.5 rounded-control font-medium transition-colors ${
                  filterStatus === tab.id
                    ? 'bg-primary text-white font-semibold shadow-soft'
                    : 'text-secondaryText hover:text-mainText hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-card border border-dashed border-cardBorder bg-white shadow-soft">
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-mainText">Ready to start today's tasks?</h3>
            <p className="text-xs sm:text-sm text-secondaryText max-w-md mx-auto mt-1 mb-5 leading-relaxed">
              Generate a personalized task list matching your skills, goals, and available minutes.
            </p>
            <Button
              loading={generating}
              onClick={() => handleGenerate(false)}
            >
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Generate Today's Tasks
            </Button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-xs sm:text-sm text-secondaryText bg-white rounded-card border border-cardBorder">
            No tasks match the selected filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
