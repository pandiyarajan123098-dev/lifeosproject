import React, { useState, useEffect } from 'react';
import {
  History,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { taskService } from '../services/taskService';
import TaskCard from '../components/TaskCard';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';

export default function TaskHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState([]);
  const [dailyProgress, setDailyProgress] = useState([]);

  // Filters
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('all');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (status !== 'all') params.status = status;

      const res = await taskService.getTaskHistory(params);
      if (res.success) {
        setTasks(res.tasks || []);
        setDailyProgress(res.dailyProgress || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load task history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleResetFilters = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    setStatus('all');
    taskService.getTaskHistory({}).then((res) => {
      if (res.success) {
        setTasks(res.tasks || []);
        setDailyProgress(res.dailyProgress || []);
      }
    });
  };

  // Group tasks by date
  const groupedTasks = tasks.reduce((groups, task) => {
    const date = task.task_date || 'Unspecified';
    if (!groups[date]) groups[date] = [];
    groups[date].push(task);
    return groups;
  }, {});

  const dates = Object.keys(groupedTasks).sort((a, b) => b.localeCompare(a));

  const progressMap = dailyProgress.reduce((map, p) => {
    map[p.progress_date] = p;
    return map;
  }, {});

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto">
        {/* Header */}
        <div className="pb-4 border-b border-cardBorder">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-mainText tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-primary" />
            Task Progress History
          </h1>
          <p className="text-xs sm:text-sm text-secondaryText mt-1">
            Review your historical activity logs, past tasks, and verified completion rates.
          </p>
        </div>

        {/* Filter Controls Card */}
        <form
          onSubmit={handleApplyFilters}
          className="p-5 sm:p-6 rounded-card bg-white border border-cardBorder shadow-soft space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <Input
              placeholder="Search title or category..."
              leftIcon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <Input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <Select
              placeholder=""
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'completed', label: 'Completed Only' },
                { value: 'incomplete', label: 'Incomplete Only' },
              ]}
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
            <Button size="sm" variant="ghost" onClick={handleResetFilters} className="text-xs">
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Filters
            </Button>
            <Button size="sm" type="submit" className="text-xs">
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              Apply Filters
            </Button>
          </div>
        </form>

        {error && <ErrorMessage title="History Notice" message={error} onRetry={fetchHistory} />}

        {loading ? (
          <LoadingState message="Loading your task history..." />
        ) : dates.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-card border border-dashed border-cardBorder bg-white shadow-soft">
            <History className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-mainText">No history found</h3>
            <p className="text-xs sm:text-sm text-secondaryText max-w-md mx-auto mt-1 leading-relaxed">
              {search || startDate || endDate || status !== 'all'
                ? 'No past tasks match your search criteria. Try adjusting or resetting filters.'
                : 'Complete and submit daily tasks to build your activity history.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {dates.map((dateStr) => {
              const dayTasks = groupedTasks[dateStr];
              const total = dayTasks.length;
              const completed = dayTasks.filter((t) => t.is_completed).length;
              const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
              const snapshot = progressMap[dateStr];

              return (
                <div
                  key={dateStr}
                  className="bg-white rounded-card border border-cardBorder shadow-soft overflow-hidden"
                >
                  {/* Date Header Strip */}
                  <div className="p-4 sm:p-4.5 bg-page border-b border-cardBorder flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-control bg-primary-light text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary-200">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-mainText">{dateStr}</h3>
                        <p className="text-xs text-secondaryText font-medium">
                          {completed} of {total} tasks completed
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {snapshot && (
                        <span className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                          Submitted Snapshot
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="w-20 sm:w-28 h-2 rounded-full bg-primary-light overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-primary">{percentage}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Tasks in this Date */}
                  <div className="p-4 sm:p-5 space-y-3">
                    {dayTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        disabled={true}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
