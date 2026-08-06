
import React from 'react'

export default function ModulesPage() {
  const modules = [
    {
      num: 'M-01',
      title: 'Ingest',
      description: 'High-throughput pipelines that normalize events from any source — streams, batches, or webhooks — in milliseconds.'
    },
    {
      num: 'M-02',
      title: 'Compute',
      description: 'A distributed query engine tuned for time-series workloads, aggregating billions of rows without breaking stride.'
    },
    {
      num: 'M-03',
      title: 'Visualize',
      description: 'GPU-accelerated dashboards where every chart is live, every filter is instant, and every view is shareable.'
    },
    {
      num: 'M-04',
      title: 'Predict',
      description: 'Anomaly detection and forecasting models that surface what matters before anyone thinks to ask.'
    }
  ]

  return (
    <section id="work" aria-label="Modules">
      <p className="kicker reveal">02 — Modules</p>
      <h2 className="reveal">Four modules. One  nervous system.</h2>
      <div className="grid">
        {modules.map((module) => (
          <article key={module.num} className="card reveal">
            <p className="num">{module.num}</p>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}