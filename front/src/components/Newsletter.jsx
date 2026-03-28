import { useLanguage } from '../i18n/LanguageContext'

export function Newsletter() {
  const { t } = useLanguage()

  return (
    <section className="ze-newsletter" aria-labelledby="newsletter-heading">
      <h2 id="newsletter-heading" className="ze-newsletter__title">
        {t('newsletter.title')}
      </h2>
      <p className="ze-newsletter__subtitle">{t('newsletter.subtitle')}</p>
      <form
        className="ze-newsletter__form"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="newsletter-email" className="ze-sr-only">
          {t('newsletter.emailLabel')}
        </label>
        <input
          id="newsletter-email"
          type="email"
          className="ze-newsletter__input"
          placeholder={t('newsletter.placeholder')}
          autoComplete="email"
        />
        <button type="submit" className="ze-newsletter__btn">
          {t('newsletter.submit')} <span aria-hidden="true">&gt;</span>
        </button>
      </form>
    </section>
  )
}
