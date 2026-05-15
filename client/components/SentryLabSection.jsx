"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

const DEMO_USER = {
  id: "12345",
  email: "student@example.com",
  segment: "premium_user",
};

export function SentryLabSection() {
  const [labNotice, setLabNotice] = useState(null);

  function setDemoUser() {
    Sentry.addBreadcrumb({
      category: "auth",
      message: "Demo user context set (lab)",
      level: "info",
    });
    Sentry.setUser(DEMO_USER);
  }

  function clearUser() {
    Sentry.addBreadcrumb({
      category: "auth",
      message: "User context cleared (logout simulation)",
      level: "info",
    });
    Sentry.setUser(null);
  }

  async function breakTheWorld() {
    Sentry.addBreadcrumb({
      category: "ui.click",
      message: 'Clicked "Break the world" (Sentry lab)',
      level: "info",
    });
    const err = new Error("Sentry Test Error: Something went wrong!");
    Sentry.captureException(err);
    await Sentry.flush(2000);
    setLabNotice("Подію надіслано в Sentry → Issues. Сторінка не падає (оброблена подія).");
    window.setTimeout(() => setLabNotice(null), 6000);
  }

  return (
    <section id="sentry-lab" className="lab-tasks sentry-lab" data-animate="swim-top">
      <div className="lab-tasks__panel">
        <header className="lab-tasks__header">
          <span className="lab-tasks__eyebrow">Лаб. 6 · Sentry</span>
          <h2 className="title title-3 lab-tasks__title">Моніторинг помилок</h2>
          <p className="lab-tasks__lead">
            Тестові кнопки для кроків 2–3 методички: інцидент у Sentry, контекст користувача,
            breadcrumbs.
          </p>
        </header>

        <div className="sentry-lab__actions">
          <button type="button" className="lab-tasks__btn-secondary" onClick={setDemoUser}>
            Імітація входу (setUser)
          </button>
          <button type="button" className="lab-tasks__btn-secondary" onClick={clearUser}>
            Вийти (setUser null)
          </button>
          <button type="button" className="btn prp lab-tasks__btn-primary" onClick={breakTheWorld}>
            Break the world
          </button>
        </div>
        <p className="sentry-lab__hint">
          Спочатку натисніть «Імітація входу», потім «Break the world» — у Sentry у події з’являться
          email та id.
        </p>
        {labNotice ? <p className="sentry-lab__notice">{labNotice}</p> : null}
      </div>
    </section>
  );
}
