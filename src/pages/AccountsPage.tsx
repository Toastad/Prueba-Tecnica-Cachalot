import { useMemo, useState } from 'react'
import { pipelineStages } from '../data/crm-data'

type PipelineTooltip = {
  x: number
  y: number
}

const SEGMENT_COLORS = ['#7057dd', '#54b4d9', '#6dcf9d', '#f59f5a']
const ARC_OVERLAP_RAD = 0.012
const POP_OUT_DISTANCE = 7
const SVG_SIZE = 280
const SVG_CENTER = 140
const RING_RADIUS = 74

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  return {
    x: cx + Math.cos(angle) * r,
    y: cy + Math.sin(angle) * r,
  }
}

function describeArcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, startAngle)
  const end = polarToCartesian(cx, cy, r, endAngle)
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0

  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
}

export default function AccountsPage() {
  const [activePipelineIndex, setActivePipelineIndex] = useState(0)
  const [tooltipPosition, setTooltipPosition] = useState<PipelineTooltip | null>(null)

  const dashSegments = useMemo(() => {
    const segments: Array<
      (typeof pipelineStages)[number] & {
        color: string
        accounts: number
        startAngle: number
        endAngle: number
        midAngle: number
        path: string
      }
    > = []

    pipelineStages.reduce((consumed, stage, index) => {
      const startAngle = -Math.PI / 2 + (consumed / 100) * (Math.PI * 2)
      const rawEndAngle = startAngle + (stage.value / 100) * (Math.PI * 2)
      const endAngle = rawEndAngle + ARC_OVERLAP_RAD
      const midAngle = (startAngle + rawEndAngle) / 2

      segments.push({
        ...stage,
        color: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
        accounts: Math.round((stage.value / 100) * 100),
        startAngle,
        endAngle,
        midAngle,
        path: describeArcPath(SVG_CENTER, SVG_CENTER, RING_RADIUS, startAngle, endAngle),
      })

      return consumed + stage.value
    }, 0)

    return segments
  }, [])

  const activeStage = dashSegments[activePipelineIndex] ?? dashSegments[0]

  const hideTooltip = () => setTooltipPosition(null)

  const handleDonutHover = (event: React.MouseEvent<SVGPathElement>, index: number) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const localX = event.clientX - bounds.left
    const localY = event.clientY - bounds.top

    setActivePipelineIndex(index)
    setTooltipPosition({
      x: localX + 18,
      y: localY - 16,
    })
  }

  const handleDonutPointerDown = (
    event: React.PointerEvent<SVGPathElement>,
    index: number,
  ) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const localX = event.clientX - bounds.left
    const localY = event.clientY - bounds.top

    setActivePipelineIndex(index)
    setTooltipPosition({
      x: localX + 18,
      y: localY - 16,
    })
  }

  const handleKeyStageSelect = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setActivePipelineIndex(index)
    }
  }

  return (
    <section className="content-grid" aria-label="Cuentas y pipeline">
      <article className="panel pipeline-panel">
        <header>
          <p className="panel-kicker">Pipeline</p>
          <h2>Accounts by stage</h2>
        </header>

        <div
          className="donut-wrapper"
          onMouseLeave={hideTooltip}
          onBlur={hideTooltip}
          tabIndex={-1}
        >
          <svg
            width={SVG_SIZE}
            height={SVG_SIZE}
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            role="img"
            aria-labelledby="pipeline-title"
          >
            <title id="pipeline-title">Distribucion de cuentas por etapa</title>
            <g>
              <circle className="donut-track" cx={SVG_CENTER} cy={SVG_CENTER} r={RING_RADIUS} />
              {dashSegments.map((segment, index) => (
                <g
                  key={segment.stage}
                  className={`donut-segment-wrap${
                    activePipelineIndex === index ? ' is-active' : ''
                  }`}
                  transform={
                    activePipelineIndex === index
                      ? `translate(${Math.cos(segment.midAngle) * POP_OUT_DISTANCE} ${
                          Math.sin(segment.midAngle) * POP_OUT_DISTANCE
                        })`
                      : undefined
                  }
                >
                  <path
                    className={`donut-segment${
                      activePipelineIndex === index ? ' is-active' : ''
                    }`}
                    d={segment.path}
                    stroke={segment.color}
                    onMouseMove={(event) => handleDonutHover(event, index)}
                    onMouseEnter={(event) => handleDonutHover(event, index)}
                    onPointerDown={(event) => handleDonutPointerDown(event, index)}
                    onFocus={() => setActivePipelineIndex(index)}
                  />
                </g>
              ))}
            </g>
          </svg>

          <div className="donut-center" aria-live="polite">
            <strong>{activeStage.value}%</strong>
            <span>{activeStage.stage}</span>
          </div>

          {tooltipPosition ? (
            <div
              className="pipeline-popout"
              style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
              role="status"
              aria-live="polite"
            >
              <span>{activeStage.stage}</span>
              <strong>{activeStage.value}%</strong>
              <small>{Math.round((activeStage.value / 100) * 100)} cuentas</small>
            </div>
          ) : null}
        </div>
      </article>

      <article className="panel">
        <header>
          <p className="panel-kicker">Legend</p>
          <h2>Stages</h2>
        </header>

        <ul className="pipeline-list" role="list">
          {pipelineStages.map((stage, index) => (
            <li key={stage.stage}>
              <button
                type="button"
                className={`pipeline-item${
                  activePipelineIndex === index ? ' is-active' : ''
                }`}
                onMouseEnter={() => setActivePipelineIndex(index)}
                onFocus={() => setActivePipelineIndex(index)}
                onKeyDown={(event) => handleKeyStageSelect(event, index)}
              >
                <span
                  className="stage-dot"
                  style={{
                    backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
                  }}
                />
                <span className="stage-text">
                  <strong>{stage.stage}</strong>
                  <small>{Math.round((stage.value / 100) * 100)} opportunities</small>
                </span>
                <strong>{stage.value}%</strong>
              </button>
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}
