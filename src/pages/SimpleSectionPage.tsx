type SimpleSectionPageProps = {
  section: string
  description: string
}

export default function SimpleSectionPage({
  section,
  description,
}: SimpleSectionPageProps) {
  return (
    <section className="content-grid" aria-label={section}>
      <article className="panel">
        <header>
          <p className="panel-kicker">{section}</p>
          <h2>{section} workspace</h2>
        </header>
        <p className="muted-copy">{description}</p>
      </article>
    </section>
  )
}
