import {
  formatEventDateOnly,
  formatEventDateTime,
} from '../utils/eventDates'
import { useLanguage } from '../i18n/LanguageContext'

export function EventCard({
  title,
  startAt,
  image,
  category,
  url,
  /** When false, show date only (e.g. homepage). */
  detailTime = true,
}) {
  const { intlLocale } = useLanguage()

  const meta = detailTime
    ? formatEventDateTime(startAt, intlLocale)
    : formatEventDateOnly(startAt, intlLocale)

  const body = (
    <>
      <div className="ze-card__media">
        <img src={image} alt="" width={400} height={240} loading="lazy" />
      </div>
      <div className="ze-card__body">
        {category ? (
          <span className="ze-card__tag">{category}</span>
        ) : null}
        <h3 className="ze-card__title">{title}</h3>
        <p className="ze-card__meta">{meta}</p>
      </div>
    </>
  )

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="ze-card ze-card--event ze-card--link"
      >
        {body}
      </a>
    )
  }

  return <article className="ze-card ze-card--event">{body}</article>
}
