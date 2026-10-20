import React from 'react';
import { Clock, Tag, CheckCircle2, Circle } from 'lucide-react';

export default function TaskCard({
  task,
  onToggle,
  disabled = false,
  showDate = false,
}) {
  const isCompleted = Boolean(task.is_completed);

  const priorityStyles = {
    High: 'bg-rose-50 text-rose-700 border-rose-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-primary-50 text-primary-700 border-primary-200',
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-200 bg-white ${
        isCompleted
          ? 'border-gray-200 bg-gray-50/60 opacity-80'
          : 'border-cardBorder shadow-soft hover:shadow-card hover:border-primary-300'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Toggle Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onToggle && onToggle(task.id, !isCompleted)}
          className="mt-0.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-full transition-transform active:scale-90"
          title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-success fill-success/10 stroke-[2.2]" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 hover:text-primary transition-colors stroke-[2]" />
          )}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                priorityStyles[task.priority] || priorityStyles.Medium
              }`}
            >
              {task.priority || 'Medium'}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-medium text-secondaryText bg-page px-2 py-0.5 rounded-md border border-cardBorder/60">
              <Tag className="w-3 h-3 text-primary" />
              {task.category}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-medium text-secondaryText bg-page px-2 py-0.5 rounded-md border border-cardBorder/60">
              <Clock className="w-3 h-3 text-secondaryText" />
              {task.estimated_minutes} min
            </span>

            {showDate && task.task_date && (
              <span className="text-xs text-secondaryText ml-auto">
                {task.task_date}
              </span>
            )}
          </div>

          <h3
            className={`text-sm font-semibold transition-all ${
              isCompleted ? 'line-through text-gray-400' : 'text-mainText'
            }`}
          >
            {task.task_title}
          </h3>

          {task.task_description && (
            <p
              className={`text-xs mt-1 leading-relaxed ${
                isCompleted ? 'text-gray-400 line-through' : 'text-secondaryText'
              }`}
            >
              {task.task_description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
