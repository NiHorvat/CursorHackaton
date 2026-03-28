/** @type {Record<'hr' | 'en', Record<string, unknown>>} */
export const translations = {
  hr: {
    nav: {
      aria: 'Glavna navigacija',
      home: 'Početna',
      locations: 'Lokacije',
      events: 'Eventovi',
      langButton: 'English',
      langTitle: 'Prebaci na engleski',
    },
    hero: {
      imgAlt: 'Koncert na otvorenom s panoramom grada',
      title: 'Otkrij Najbolja Događanja u Zagrebu!',
      tonightLabel: 'Što raditi večeras?',
      tonightAria: 'Pretraga za večeras',
      tonightPlaceholder: 'Npr. želim ići negdje na žurku večeras…',
      search: 'Pretraži',
      popular: 'Popularni Događaji',
      upcoming: 'Nadolazeći Događaji',
    },
    home: {
      upcoming: 'Nadolazeći Eventi',
      topLocations: 'Top Lokacije',
    },
    tabs: {
      aria: 'Lokacije i eventovi',
    },
    events: {
      title: 'Svi Eventovi',
      intro:
        'Pomiči kalendar ili odaberi dan — prikazuju se svi događaji u tom mjesecu, poredani po datumu i vremenu. Dani s događajima označeni su na kalendaru.',
      searchLabel: 'Pretraga eventova',
      searchPlaceholder: 'Pretraži po nazivu ili kategoriji…',
      emptyMonth: 'Nema događaja u ovom mjesecu za trenutni upit.',
    },
    map: {
      title: 'Karta Događanja',
      intro:
        'Lokacije događaja iz baze podataka (OpenStreetMap). Označena su mjesta s poznatim koordinatama.',
      cat1Title: 'Koncerti i Klubovi',
      cat1Desc:
        'Otkrij live nastupe, festivale i noćni život širom grada — od intimnih klubova do velikih pozornica.',
      cat2Title: 'Kazališta i Muzeji',
      cat2Desc:
        'Premijere, izložbe i kulturna bastina: najbolja kazališta i muzeji na jednom mjestu.',
      nearMe: 'Blizu mene',
      nearHint: '(događaji unutar {km} km)',
      geoLoading: 'Dohvaćanje lokacije…',
      geoUnsupported: 'Geolokacija nije podržana u ovom pregledniku.',
      geoDenied:
        'Pristup lokaciji je odbijen. Dozvoli lokaciju u pregledniku.',
      geoFailed: 'Nije moguće dohvatiti tvoju lokaciju.',
      nearCount: 'Prikazano: {n} lokacija u radijusu',
      nearEmpty:
        'Nema lokacija događaja unutar {km} km. Isključi "Blizu mene" za sve lokacije — karta ipak prikazuje tvoj radijus.',
      mapAria: 'Interaktivna karta Zagreba s označenim lokacijama',
      leafletNoCoords: 'Nema događaja s poznatim koordinatama u podacima.',
      popupEvents1: 'događaj',
      popupEventsN: 'događaja',
      popupMore: '… i {n} još',
      openGoogleMaps: 'Otvori u Google Kartama',
    },
    newsletter: {
      title: 'Prijavi Se Na Newsletter!',
      subtitle:
        'Primaj obavijesti o najboljim događajima i lokacijama u Zagrebu.',
      emailLabel: 'Email',
      placeholder: 'Unesi svoj email…',
      submit: 'Prijavi Se',
    },
    tonight: {
      title: 'Što raditi večeras?',
      intro:
        'Preporuke na temelju tvog upita. Rezultati dolaze s poslužitelja preporuka.',
      queryLabel: 'Upit:',
      noQuery: 'Nema upita. Unesi pretragu na početnoj stranici.',
      homeLink: 'Na početnu',
      loading: 'Učitavanje preporuka…',
      requestFailed: 'Neuspjeli zahtjev.',
      hint: 'Provjeri radi li backend na',
      hintProxy: 'i je li u Vite-u uključen proxy za',
      hintEnv: 'ili postavljen',
      retryHome: 'Pokušaj ponovno s početne',
      summary: 'Sažetak',
      droppedPins: 'Neki prijedlozi su izostavljeni jer nisu bili valjani.',
      noResults: 'Nema rezultata.',
      badgeEvent: 'Događaj',
      badgePlace: 'Mjesto',
      dateTime: 'Datum i vrijeme',
      category: 'Kategorija',
      area: 'Područje',
      address: 'Adresa',
      type: 'Tip',
      openMap: 'Otvori na karti',
    },
  },
  en: {
    nav: {
      aria: 'Main navigation',
      home: 'Home',
      locations: 'Locations',
      events: 'Events',
      langButton: 'Hrvatski',
      langTitle: 'Switch to Croatian',
    },
    hero: {
      imgAlt: 'Outdoor concert with city skyline',
      title: 'Discover the Best Events in Zagreb!',
      tonightLabel: 'What to do tonight?',
      tonightAria: 'Search for tonight',
      tonightPlaceholder: 'e.g. I want to go out tonight…',
      search: 'Search',
      popular: 'Popular events',
      upcoming: 'Upcoming events',
    },
    home: {
      upcoming: 'Upcoming events',
      topLocations: 'Top locations',
    },
    tabs: {
      aria: 'Locations and events',
    },
    events: {
      title: 'All events',
      intro:
        'Use the calendar or pick a day — events for that month are shown, sorted by date and time. Days with events are highlighted.',
      searchLabel: 'Search events',
      searchPlaceholder: 'Search by name or category…',
      emptyMonth: 'No events this month for the current search.',
    },
    map: {
      title: 'Event map',
      intro:
        'Event locations from the database (OpenStreetMap). Places with known coordinates are marked.',
      cat1Title: 'Concerts & clubs',
      cat1Desc:
        'Discover live shows, festivals, and nightlife across the city — from intimate clubs to big stages.',
      cat2Title: 'Theatres & museums',
      cat2Desc:
        'Premieres, exhibitions, and culture: theatres and museums in one place.',
      nearMe: 'Near me',
      nearHint: '(events within {km} km)',
      geoLoading: 'Getting your location…',
      geoUnsupported: 'Geolocation is not supported in this browser.',
      geoDenied: 'Location access was denied. Allow location in your browser.',
      geoFailed: 'Could not get your location.',
      nearCount: 'Showing: {n} locations in radius',
      nearEmpty:
        'No event locations within {km} km. Turn off "Near me" for all locations — the map still shows your radius.',
      mapAria: 'Interactive map of Zagreb with marked locations',
      leafletNoCoords: 'No events with known coordinates in the data.',
      popupEvents1: 'event',
      popupEventsN: 'events',
      popupMore: '… and {n} more',
      openGoogleMaps: 'Open in Google Maps',
    },
    newsletter: {
      title: 'Subscribe to the newsletter!',
      subtitle:
        'Get updates on the best events and places in Zagreb.',
      emailLabel: 'Email',
      placeholder: 'Enter your email…',
      submit: 'Subscribe',
    },
    tonight: {
      title: 'What to do tonight?',
      intro:
        'Recommendations based on your query. Results come from the recommendation server.',
      queryLabel: 'Query:',
      noQuery: 'No query. Enter a search on the home page.',
      homeLink: 'Back to home',
      loading: 'Loading recommendations…',
      requestFailed: 'Request failed.',
      hint: 'Check that the backend is running at',
      hintProxy: 'and that the Vite proxy for',
      hintEnv: 'is enabled or set',
      retryHome: 'Try again from home',
      summary: 'Summary',
      droppedPins: 'Some suggestions were dropped because they were invalid.',
      noResults: 'No results.',
      badgeEvent: 'Event',
      badgePlace: 'Place',
      dateTime: 'Date & time',
      category: 'Category',
      area: 'Area',
      address: 'Address',
      type: 'Type',
      openMap: 'Open on map',
    },
  },
}

/**
 * @param {'hr' | 'en'} locale
 * @param {string} path dot-separated, e.g. `nav.home`
 * @param {Record<string, string | number>} [vars] replace `{key}` in string
 */
export function translate(locale, path, vars) {
  const parts = path.split('.')
  let cur = translations[locale]
  for (const p of parts) {
    cur = cur?.[p]
  }
  let s = typeof cur === 'string' ? cur : path
  if (vars && typeof s === 'string') {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, String(v))
    }
  }
  return s
}
