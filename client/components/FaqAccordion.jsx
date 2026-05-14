'use client';

import { useState } from 'react';

export function FaqAccordion({ items = [] }) {
  const [openId, setOpenId] = useState(null);

  const list = Array.isArray(items) ? items.filter(item => item && item.question != null) : [];

  return (
    <>
      {list.map((item, index) => {
        const id = item._id != null ? String(item._id) : `faq-${index}`;
        const isOpen = openId === id;
        return (
          <div
            key={id}
            className={`--accordion faq-accordion ${isOpen ? '-open' : ''}`}
            data-animate="swim-top"
          >
            <div
              role="button"
              tabIndex={0}
              className="--accordion__open --cursor-pointer"
              onClick={() => setOpenId(isOpen ? null : id)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpenId(isOpen ? null : id);
                }
              }}
            >
              <h3 className="question title-5">{item.question}</h3>
              <div className="--accordion__arrow" />
            </div>
            <div
              className="--accordion__content-container"
              style={{
                height: isOpen ? 'auto' : 0,
                overflow: 'hidden',
              }}
            >
              <div className="--accordion__content">
                <div className="accordion-text body-1">{item.answer ?? ''}</div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
