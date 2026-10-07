import { useState } from 'react'
import { weeklyActivity } from '../data/crm-data'

export default function TransactionsPage() {
  const [hoveredActivityIndex, setHoveredActivityIndex] = useState<number | null>(null)
  const activityTotals = weeklyActivity.map((metric) => ({
    day: metric.day,
    value: metric.calls + metric.emails + metric.meetings,
  }))
  const highestPoint = Math.max(...activityTotals.map((metric) => metric.value), 1)

  return (
    <section className="content-grid" aria-label="Transacciones">
      <article className="panel chart-panel">
        <header>
          <p className="panel-kicker">Activity chart</p>
          <h2>Weekly transactions</h2>
        </header>

        <div className="bar-chart" role="list" aria-label="Grafico de transacciones">
          {activityTotals.map((metric, index) => (
            <button
              key={metric.day}
              type="button"
              className={`bar-column${hoveredActivityIndex === index ? ' is-active' : ''}`}
              role="listitem"
              onMouseEnter={() => setHoveredActivityIndex(index)}
              onMouseLeave={() => setHoveredActivityIndex(null)}
            >
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ height: `${(metric.value / highestPoint) * 100}%` }}
                />
              </div>
              <span>{metric.day}</span>

              {hoveredActivityIndex === index ? (
                <div className="chart-popout" role="status" aria-live="polite">
                  <span>{metric.day}</span>
                  <strong>{metric.value}</strong>
                  <small>transacciones</small>
                </div>
              ) : null}
            </button>
          ))}
        </div>
      </article>

      <article className="panel">
        <header>
          <p className="panel-kicker">Insights</p>
          <h2>Performance notes</h2>
        </header>

        <p className="muted-copy">
          Ajustamos el espaciado de barras para una lectura mas clara en escritorio y
          en pantallas pequenas.
        </p>
      </article>
    </section>
  )
}
