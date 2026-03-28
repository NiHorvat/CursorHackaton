import { useFavorites } from '../favorites/FavoritesContext'
import { useLanguage } from '../i18n/LanguageContext'

export function FavoriteEventButton({ eventId }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const { t } = useLanguage()
  const on = isFavorite(eventId)

  return (
    <button
      type="button"
      className={`ze-fav-btn${on ? ' ze-fav-btn--on' : ''}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(eventId)
      }}
      aria-pressed={on}
      aria-label={on ? t('favorites.remove') : t('favorites.add')}
      title={on ? t('favorites.remove') : t('favorites.add')}
    >
      <span className="ze-fav-btn__icon" aria-hidden="true">
        ♥
      </span>
    </button>
  )
}
