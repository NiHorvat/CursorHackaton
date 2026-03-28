export function EventCard({ title, date, image, category }) {
  return (
    <article className="ze-card ze-card--event">
      <div className="ze-card__media">
        <img src={image} alt="" width={400} height={240} loading="lazy" />
      </div>
      <div className="ze-card__body">
        {category ? (
          <span className="ze-card__tag">{category}</span>
        ) : null}
        <h3 className="ze-card__title">{title}</h3>
        <p className="ze-card__meta">{date}</p>
      </div>
    </article>
  )
}
