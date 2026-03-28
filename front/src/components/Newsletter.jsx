export function Newsletter() {
  return (
    <section className="ze-newsletter" aria-labelledby="newsletter-heading">
      <h2 id="newsletter-heading" className="ze-newsletter__title">
        Prijavi Se Na Newsletter!
      </h2>
      <p className="ze-newsletter__subtitle">
        Primaj obavijesti o najboljim događajima i lokacijama u Zagrebu.
      </p>
      <form
        className="ze-newsletter__form"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="newsletter-email" className="ze-sr-only">
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          className="ze-newsletter__input"
          placeholder="Unesi svoj email..."
          autoComplete="email"
        />
        <button type="submit" className="ze-newsletter__btn">
          Prijavi Se <span aria-hidden="true">&gt;</span>
        </button>
      </form>
    </section>
  )
}
