import { dashboardStats, pipelineStages, weeklyActivity } from '../data/crm-data'

export default function ReportsPage() {
  const totalTouches = weeklyActivity.reduce(
    (sum, day) => sum + day.calls + day.emails + day.meetings,
    0,
  )
  const strongestStage = [...pipelineStages].sort((left, right) => right.value - left.value)[0]

  return (
    <section className="content-grid" aria-label="Reports overview">
      <article className="panel">
        <header>
          <p className="panel-kicker">Performance</p>
          <h2>Executive snapshot</h2>
        </header>

        <div className="mini-stats-grid">
          {dashboardStats.map((stat) => (
            <div key={stat.label} className="mini-stat-card">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.detail}</small>
            </div>
          ))}
        </div>
      </article>

      <article className="panel">
        <header>
          <p className="panel-kicker">Insights</p>
          <h2>Commercial report</h2>
        </header>

        <div className="report-list">
          <div className="report-row">
            <span>Total weekly touches</span>
            <strong>{totalTouches}</strong>
          </div>
          <div className="report-row">
            <span>Strongest pipeline stage</span>
            <strong>{strongestStage.stage}</strong>
          </div>
          <div className="report-row">
            <span>Stage share</span>
            <strong>{strongestStage.value}%</strong>
          </div>
        </div>
      </article>

      <article className="panel report-panel-wide">
        <header>
          <p className="panel-kicker">Pipeline report</p>
          <h2>Stage distribution</h2>
        </header>

        <div className="report-table" role="table" aria-label="Pipeline report table">
          {pipelineStages.map((stage) => (
            <div key={stage.stage} className="report-table-row" role="row">
              <span role="cell">{stage.stage}</span>
              <strong role="cell">{stage.value}%</strong>
              <small role="cell">{Math.round(stage.value)} active opportunities</small>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
