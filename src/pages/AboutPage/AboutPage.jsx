import React from 'react';
import './AboutPage.css';

function AboutPage() {
  return (
    <main className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <h1 className="about-hero__title">Poznaj mPoparcie</h1>
        <p className="about-hero__subtitle">GŁOSUJESZ I&nbsp;DECYDUJESZ ANONIMOWO</p>
      </section>

      {/* Intro */}
      <section className="about-intro">
        <p>
          <strong>mPoparcie</strong> to nowoczesny, <strong>anonimowy</strong> i&nbsp;
          <strong>nielinkowalny</strong> system do wyrażania poparcia dla petycji, a w przyszłości
          także do głosowania elektronicznego (e-votingu). Naszym celem jest przeniesienie zaufania,
          jakie mamy do tradycyjnej, papierowej urny wyborczej, do świata cyfrowego. Chcemy zachęcić
          ludzi do następującej cyfryzacji, rozpoczętej przez <strong> EUDI Wallet</strong>. Zamiast
          podpisywać petycję, oddajesz swój głos online, bez konieczności ujawniania swojej
          tożsamości.
        </p>
        <br></br>
        <p>
          Dzięki zastosowaniu zaawansowanych technologii kryptograficznych i EUDI Wallet, system
          pozwala stwierdzić że jesteś prawdziwym człowiekiem uprawnionym do oddania głosu,
          jednocześnie nie znając o tobie żadnych danych osobowych.
        </p>
      </section>

      {/* How it works */}
      <section className="about-section">
        <h2 className="about-section__heading">
          Jak to jest możliwe? Magia &bdquo;Wiedzy Zerowej&rdquo;
        </h2>
        <p className="about-section__text">
          Głównym problemem głosowania przez internet jest zawsze ten sam dylemat:{' '}
          <em>
            Skoro system musi wiedzieć kim jestem, żeby pozwolić mi zagłosować, to jak może
            zagwarantować, że mój głos pozostanie tajny?
          </em>
        </p>
        <p className="about-section__text">
          Rozwiązaniem tego problemu jest technologia{' '}
          <strong>Nieinteraktywnych Dowodów Wiedzy Zerowej</strong> (zkSNARK). Pozwala ona na
          udowodnienie systemowi, że masz prawo głosu, bez ujawniania kim jesteś, ani jak głosujesz.
          Proces podzieliliśmy na dwa proste etapy:
        </p>

        {/* Step 1 */}
        <article className="about-step">
          <div className="about-step__indicator">1</div>
          <div className="about-step__body">
            <h3 className="about-step__title">Rejestracja </h3>
            <p className="about-step__lead">
              Aby zagłosować, musimy mieć pewność, że jesteś prawdziwą osobą, która ma do tego
              prawo.
            </p>
            <ul className="about-step__list">
              <li>
                <strong>Potwierdzenie tożsamości:</strong> Rejestrujesz się za pomocą rządowej
                aplikacji <em>EUDI Wallet</em>. Dzięki temu wiemy, że jesteś człowiekiem, a&nbsp;nie
                botem, czy innym automatem.
              </li>
              <li>
                <strong>Anonimowy wpis do bazy danych:</strong> System nie zapisuje Twojego imienia,
                nazwiska ani numeru PESEL. Zamiast tego, na Twoim własnym urządzeniu (za pomocą tzw.
                kluczy sprzętowych <em>passkeys</em> lub hasła) tworzona jest Twoja nowa,
                w&nbsp;100% anonimowa cyfrowa tożsamość opata o sekret do którego tylko Ty masz
                dostęp. Do publicznej bazy danych trafia tylko wytworzony przez Twoje urządzenie
                ciąg znaków, który nie mówi o&nbsp;Tobie absolutnie nic.
              </li>
            </ul>
          </div>
        </article>

        {/* Step 2 */}
        <article className="about-step">
          <div className="about-step__indicator">2</div>
          <div className="about-step__body">
            <h3 className="about-step__title">Głosowanie</h3>
            <p className="about-step__lead">
              Kiedy przychodzi czas decyzji, nie musisz się już nigdzie logować swoimi danymi.
            </p>
            <ul className="about-step__list">
              <li>
                Twój telefon lub komputer samodzielnie pobiera publiczną listę wszystkich
                uprawnionych i&nbsp;&bdquo;odnajduje&rdquo; na niej Twoją anonimową tożsamość.
              </li>
              <li>
                Z Twojego klucza passkeys lub hasła odtwarzana jest Twoja anonimowa tożsamość
                lokalnie na urządzeniu — dzięki temu nikt nie może się pod Ciebie podszyć i możesz
                bezpiecznie oddać głos.
              </li>
              <li>
                Podczas oddawania głosu twoje urządzenie generuje specjalny matematyczny dowód,
                który potwierdza:{' '}
                <em>&bdquo;Osoba oddająca ten głos jest na liście uprawnionych&rdquo;</em>.
              </li>
              <li>
                Gotowy głos (niezawierający żadnych Twoich danych) trafia na nasz serwer, który
                sprawdza poprawność dowodu matematycznego i&nbsp;dopisuje go do puli.
              </li>
            </ul>
          </div>
        </article>
      </section>

      {/* Trust */}
      <section className="about-section">
        <h2 className="about-section__heading">Dlaczego możesz zaufać?</h2>

        <div className="about-trust-grid">
          <article className="about-trust-card">
            <h3 className="about-trust-card__title">Prywatność absolutna</h3>
            <p>
              mPoparcie jest systemem anonimowym i nielinkowalnym. Oznacza to, że
              z&nbsp;matematycznego punktu widzenia <strong>nikt</strong> – ani my, ani
              administratorzy serwerów, ani instytucje państwowe – nie jest w&nbsp;stanie połączyć
              oddanego głosu z&nbsp;Twoimi danymi osobowymi.
            </p>
          </article>

          <article className="about-trust-card">
            <h3 className="about-trust-card__title">Nowoczesna kryptografia</h3>
            <p>
              Używamy tych samych zaawansowanych algorytmów, które zabezpieczają najnowocześniejsze
              systemy finansowe oraz sieci blockchain na świecie.
            </p>
          </article>

          <article className="about-trust-card">
            <h3 className="about-trust-card__title">Transparentność</h3>
            <p>
              Nasza baza danych jest publicznie dostępna, więc każdy może zweryfikować, że nikt nie
              manipuluje dostępem do głosowania. A po zakończonym głosowaniu, wyniki są jawne więc
              każdy może sprawdzić, że oddane głosy zostały poprawnie zliczone.
            </p>
          </article>
        </div>
      </section>

      {/* Closing */}
      <section className="about-closing">
        <p>
          <strong>mPoparcie</strong> to narzędzie, które oddaje władzę w&nbsp;Twoje ręce, szanując
          Twoją prywatność.
        </p>
        <p>Projekt można opisać trzema słowami:</p>
        <p className="about-closing__tagline">Bezpiecznie. Anonimowo. Elektronicznie.</p>
        <br></br>
        <p>Po więcej szczegółów zapraszamy na repozytoria projektu:</p>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
          <li>
            <strong>Frontend:</strong>{' '}
            <a
              href="https://github.com/Wikmano/PoparcieFE"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub (PoparcieFE)
            </a>
          </li>
          <li>
            <strong>Backend:</strong>{' '}
            <a
              href="https://github.com/Luk1104/mPoparcie-backend"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub (mPoparcie-backend)
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}

export default AboutPage;
