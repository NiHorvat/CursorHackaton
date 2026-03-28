import {
  formatEventDateOnly,
  formatEventDateTime,
} from '../utils/eventDates'
import { FavoriteEventButton } from './FavoriteEventButton'
import { useLanguage } from '../i18n/LanguageContext'

export function EventCard({
  id,
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

  const inner =
    url != null && String(url).trim() !== '' ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="ze-card__link"
      >
        {body}
      </a>
    ) : (
      <div className="ze-card__link ze-card__link--static">{body}</div>
    )

  return (
    <article className="ze-card ze-card--event ze-card--with-fav">
      {id != null && String(id).trim() !== '' ? (
        <div className="ze-card__fav-wrap">
          <FavoriteEventButton eventId={String(id)} />
        </div>
      ) : null}
      {inner}
    </article>
  )
}
