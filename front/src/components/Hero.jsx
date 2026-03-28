import { Link } from 'react-router-dom'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=85'

export function Hero() {
  return (
    <section className="ze-hero" aria-labelledby="hero-heading">
      <div className="ze-hero__inner">
        <div className="ze-hero__visual">
          <img
            src={HERO_IMAGE}
            alt="Koncert na otvorenom s panoramom grada"
            className="ze-hero__img"
            width={640}
            height={400}
            loading="eager"
          />
        </div>
        <div className="ze-hero__content">
          <h1 id="hero-heading" className="ze-hero__title">
            Otkrij Najbolja Događanja u Zagrebu!
          </h1>
          <div className="ze-hero__actions">
            <Link to="/eventovi" className="ze-btn ze-btn--primary">
              Popularni Događaji <span aria-hidden="true">&gt;</span>
            </Link>
            <Link to="/eventovi" className="ze-btn ze-btn--secondary">
              Nadolazeći Događaji
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
