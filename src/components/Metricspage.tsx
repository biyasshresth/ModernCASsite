import React from 'react'

export default function MetricsPage() {
  const stats = [
    {
      count: 12,
      unit: 'B+',
      label: 'Events / day'
    },
    {
      count: 48,
      unit: 'ms',
      label: 'P99 query time'
    },
    {
      count: 99,
      unit: '.99%',
      label: 'Uptime'
    },
    {
      count: 140,
      unit: '+',
      label: 'Data sources'
    }
  ]

  return (
    <section id="metrics" aria-label="Metrics">
      <p className="kicker reveal">03 — Metrics</p>
      <h2 className="reveal">Measured, not promised.</h2>
      <div className="stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat reveal">
            <p className="value">
              <span data-count={stat.count}>0</span>
              {stat.unit}
            </p>
            <p className="label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}