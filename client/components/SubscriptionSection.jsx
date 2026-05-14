'use client';

import { useState } from 'react';

export function SubscriptionSection({ subscription = {} }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/backend/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || subscription?.errorFallback || 'Помилка запиту');
        return;
      }
      setDone(true);
    } catch {
      setError(subscription?.errorNetwork || 'Немає звʼязку з сервером');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <section id="join" className="subscription" data-animate="swim-top">
        <div id="thankYouMessage" className="thank-you">
          <h3 className="title-1">
            {subscription.thankYouTitleLine1} <br />
            {subscription.thankYouTitleLine2}
          </h3>
          <p>{subscription.thankYouText}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="join" className="subscription" data-animate="swim-top">
      <h2 className="title title-2" id="subscriptionTitle">
        {subscription.title}
      </h2>
      <p className="description" id="subscriptionDescription">
        {subscription.descriptionLine1}
        <br />
        {subscription.descriptionLine2}
      </p>
      <form id="subscriptionForm" onSubmit={onSubmit}>
        <input
          type="text"
          name="name"
          placeholder={subscription.namePlaceholder}
          required
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          name="email"
          placeholder={subscription.emailPlaceholder}
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button type="submit" className="btn prp" disabled={loading}>
          {loading ? subscription.submitLoading : subscription.submit}
        </button>
        {error ? (
          <p className="description" style={{ marginTop: '0.75rem', color: '#c62828' }}>
            {error}
          </p>
        ) : null}
      </form>
    </section>
  );
}
