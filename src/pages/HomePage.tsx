import { dashboardStats, weeklyActivity } from '../data/crm-data'

export default function HomePage() {
  const activityTotals = weeklyActivity.map((item) => ({
    day: item.day,
    value: item.calls + item.emails + item.meetings,
  }))
  const highestPoint = Math.max(...activityTotals.map((item) => item.value), 1)

  return (
    <>
      <section className="stats-grid" aria-label="Metricas principales">
        {dashboardStats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <p className="panel-kicker">{stat.label}</p>
            <strong>{stat.value}</strong>
            <span>{stat.detail}</span>
          </article>
        ))}
      </section>

      <section className="content-grid" aria-label="Actividad semanal">
        <article className="panel chart-panel">
          <header>
            <p className="panel-kicker">Overview</p>
            <h2>Total growth</h2>
          </header>

          <div className="bar-chart" role="list" aria-label="Crecimiento semanal">
            {activityTotals.map((metric) => (
              <div key={metric.day} className="bar-column" role="listitem">
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ height: `${(metric.value / highestPoint) * 100}%` }}
                  />
                </div>
                <span>{metric.day}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <header>
            <p className="panel-kicker">Main dashboard</p>
            <h2>Welcome back</h2>
          </header>
          <p className="muted-copy">
            Usa el menu lateral para navegar entre secciones. Ahora cada modulo esta
            separado: contactos, transacciones, cuentas, reportes y configuracion.
          </p>
        </article>
      </section>
    </>
  )
}
