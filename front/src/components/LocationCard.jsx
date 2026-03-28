export function LocationCard({ title, image }) {
  return (
    <article className="ze-card ze-card--location">
      <div className="ze-card__media">
        <img src={image} alt="" width={400} height={240} loading="lazy" />
      </div>
      <div className="ze-card__body">
        <h3 className="ze-card__title">{title}</h3>
      </div>
    </article>
  )
}
