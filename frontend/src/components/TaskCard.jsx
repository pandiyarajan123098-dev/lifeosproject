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
      className={`p-4 sm:p-4.5 rounded-card border transition-all duration-200 bg-white ${
        isCompleted
          ? 'border-gray-200 bg-gray-50/70 opacity-80'
          : 'border-cardBorder shadow-soft hover:shadow-card hover:border-primary-300'
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Toggle Button with Accessible Tap Target */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onToggle && onToggle(task.id, !isCompleted)}
          className="mt-0.5 shrink-0 min-w-[36px] min-h-[36px] -m-1.5 p-1.5 flex items-center justify-center rounded-full text-secondaryText hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-95 transition-all"
          title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
          aria-label={isCompleted ? `Mark ${task.task_title} incomplete` : `Mark ${task.task_title} complete`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-success fill-success/15 stroke-[2.2]" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 hover:text-primary transition-colors stroke-[2]" />
          )}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                priorityStyles[task.priority] || priorityStyles.Medium
              }`}
            >
              {task.priority || 'Medium'}
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-secondaryText bg-page px-2 py-0.5 rounded-md border border-cardBorder/60">
              <Tag className="w-3 h-3 text-primary shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-[200px]">{task.category}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-secondaryText bg-page px-2 py-0.5 rounded-md border border-cardBorder/60">
              <Clock className="w-3 h-3 text-secondaryText shrink-0" />
              {task.estimated_minutes} min
            </span>

            {showDate && task.task_date && (
              <span className="text-[11px] text-secondaryText ml-auto shrink-0 font-medium">
                {task.task_date}
              </span>
            )}
          </div>

          <h3
            className={`text-sm sm:text-base font-semibold leading-snug break-words transition-all ${
              isCompleted ? 'line-through text-gray-400' : 'text-mainText'
            }`}
          >
            {task.task_title}
          </h3>

          {task.task_description && (
            <p
              className={`text-xs sm:text-[13px] mt-1.5 leading-relaxed break-words ${
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
