'use client';

import { useCallback, useMemo, useState } from 'react';
import { usePostHog, useFeatureFlagEnabled } from 'posthog-js/react';

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function priorityClass(p) {
  if (p === 'high') return 'lab-tasks__badge -high';
  if (p === 'medium') return 'lab-tasks__badge -medium';
  return 'lab-tasks__badge -low';
}

export function LabTasksSection() {
  const posthog = usePostHog();
  const urgentFilterEnabled = useFeatureFlagEnabled('show-urgent-filter');

  const [tasks, setTasks] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('high');
  const [category, setCategory] = useState('work');
  const [urgentOnly, setUrgentOnly] = useState(false);

  const visibleTasks = useMemo(() => {
    if (!urgentOnly) return tasks;
    return tasks.filter(t => t.priority === 'high');
  }, [tasks, urgentOnly]);

  const openForm = useCallback(() => {
    setFormOpen(true);
  }, []);

  const submitTask = useCallback(
    e => {
      e.preventDefault();
      const trimmed = title.trim();
      if (!trimmed) return;

      const task = {
        id: newId(),
        title: trimmed,
        priority,
        category,
        createdAt: Date.now(),
        completed: false,
      };
      setTasks(prev => [task, ...prev]);
      setTitle('');
      setFormOpen(false);

      posthog?.capture('task_created', {
        priority,
        category,
        is_authenticated: false,
      });
    },
    [title, priority, category, posthog]
  );

  const completeTask = useCallback(
    id => {
      setTasks(prev =>
        prev.map(t => {
          if (t.id !== id || t.completed) return t;
          const seconds = Math.max(0, Math.round((Date.now() - t.createdAt) / 1000));
          posthog?.capture('task_completed', {
            time_to_complete_seconds: seconds,
          });
          return { ...t, completed: true, completedAt: Date.now() };
        })
      );
    },
    [posthog]
  );

  const deleteTask = useCallback(
    (id, reason) => {
      setTasks(prev => prev.filter(t => t.id !== id));
      posthog?.capture('task_deleted', { reason });
    },
    [posthog]
  );

  return (
    <section id="lab-tasks" className="lab-tasks" data-animate="swim-top">
      <div className="lab-tasks__panel">
        <header className="lab-tasks__header">
          <span className="lab-tasks__eyebrow">Лаб. 5 · PostHog</span>
          <h2 className="title title-3 lab-tasks__title">Практика: завдання</h2>
          <p className="lab-tasks__lead">
            Додавайте й виконуйте пункти — події відправляються в PostHog для воронок і записів сесій.
          </p>
        </header>

        <div className="lab-tasks__toolbar">
          <button type="button" className="btn prp lab-tasks__btn-primary" onClick={openForm}>
            Додати завдання
          </button>
          {urgentFilterEnabled ? (
            <button
              type="button"
              className={`lab-tasks__btn-secondary${urgentOnly ? ' -active' : ''}`}
              onClick={() => setUrgentOnly(v => !v)}
            >
              Лише термінові
            </button>
          ) : null}
        </div>

        {formOpen ? (
          <form className="lab-tasks__form" onSubmit={submitTask}>
            <div className="lab-tasks__form-grid">
              <label className="lab-tasks__field">
                <span className="lab-tasks__field-label">Назва</span>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Наприклад: повторити лексику з уроку 3"
                  autoComplete="off"
                />
              </label>
              <label className="lab-tasks__field">
                <span className="lab-tasks__field-label">Пріоритет</span>
                <select value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="high">high</option>
                  <option value="medium">medium</option>
                  <option value="low">low</option>
                </select>
              </label>
              <label className="lab-tasks__field lab-tasks__field--full">
                <span className="lab-tasks__field-label">Категорія</span>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  placeholder="наприклад, work"
                  autoComplete="off"
                />
              </label>
            </div>
            <div className="lab-tasks__form-actions">
              <button type="submit" className="btn prp lab-tasks__btn-primary">
                Зберегти
              </button>
              <button type="button" className="lab-tasks__btn-secondary" onClick={() => setFormOpen(false)}>
                Скасувати
              </button>
            </div>
          </form>
        ) : null}

        <ul className="lab-tasks__list">
          {visibleTasks.length === 0 ? (
            <li className="lab-tasks__empty">Поки що немає завдань у цьому списку.</li>
          ) : (
            visibleTasks.map(t => (
              <li key={t.id} className={`lab-tasks__item${t.completed ? ' -done' : ''}`}>
                <div className="lab-tasks__item-main">
                  <span className={priorityClass(t.priority)}>{t.priority}</span>
                  <div className="lab-tasks__item-text">
                    <span className="lab-tasks__item-title">{t.title}</span>
                    <span className="lab-tasks__meta">
                      {t.category}
                      {t.completed ? <span className="lab-tasks__done-label"> · Виконано</span> : null}
                    </span>
                  </div>
                </div>
                <div className="lab-tasks__row-actions">
                  {!t.completed ? (
                    <button type="button" className="btn prp lab-tasks__btn-compact" onClick={() => completeTask(t.id)}>
                      Виконати
                    </button>
                  ) : null}
                  <DeleteTaskButton onDelete={reason => deleteTask(t.id, reason)} />
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}

function DeleteTaskButton({ onDelete }) {
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState('mistake');

  if (!showReason) {
    return (
      <button type="button" className="lab-tasks__btn-secondary lab-tasks__btn-compact" onClick={() => setShowReason(true)}>
        Видалити
      </button>
    );
  }

  return (
    <div className="lab-tasks__delete">
      <select className="lab-tasks__delete-select" value={reason} onChange={e => setReason(e.target.value)}>
        <option value="mistake">помилка</option>
        <option value="duplicate">дублікат</option>
        <option value="other">інше</option>
      </select>
      <button type="button" className="btn prp lab-tasks__btn-compact" onClick={() => onDelete(reason)}>
        Підтвердити
      </button>
      <button type="button" className="lab-tasks__btn-secondary lab-tasks__btn-compact" onClick={() => setShowReason(false)}>
        Назад
      </button>
    </div>
  );
}
