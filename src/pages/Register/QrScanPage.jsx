import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './QrScanPage.css';

const TOTAL_SECONDS = 300;

function QrScanPage() {
  const [state, setState] = useState('scanning');
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [qrData] = useState(() => sessionStorage.getItem('eudi-qr-data') || '');
  const intervalRef = useRef(null);
  const channelRef = useRef(null);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const showSuccess = useCallback(() => {
    setState('success');
    stopTimer();
  }, [stopTimer]);

  const showExpired = useCallback(() => {
    setState('expired');
    stopTimer();
  }, [stopTimer]);

  const showError = useCallback(() => {
    setState('error');
    stopTimer();
  }, [stopTimer]);

  useEffect(() => {
    if (state !== 'scanning') return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          showExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => stopTimer();
  }, [state, showExpired, stopTimer]);

  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel('eudi-registration');
      channelRef.current.addEventListener('message', (e) => {
        if (e.data?.type === 'VERIFICATION_SUCCESS') showSuccess();
        if (e.data?.type === 'VERIFICATION_TIMEOUT') showExpired();
        if (e.data?.type === 'VERIFICATION_ERROR') showError();
      });
    } catch {
      /* not supported */
    }
    return () => channelRef.current?.close();
  }, [showSuccess, showExpired, showError]);

  const pad = (n) => (n < 10 ? '0' + n : '' + n);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = (remaining / TOTAL_SECONDS) * 100;
  const timerClass = remaining <= 30 ? 'danger' : remaining <= 60 ? 'warning' : '';

  if (!qrData) {
    return (
      <div className="qrscan-page">
        <div className="qrscan-card">
          <div className="qrscan-icon qrscan-icon--error">!</div>
          <p className="qrscan-heading qrscan-heading--error">Brak danych</p>
          <p className="qrscan-text">
            Nie znaleziono danych kodu QR.
            <br />
            Wróć do poprzedniej karty i rozpocznij rejestrację ponownie.
          </p>
          <button className="qrscan-btn qrscan-btn--secondary" onClick={() => window.close()}>
            Zamknij kartę
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="qrscan-page">
      {state === 'scanning' && (
        <div className="qrscan-card">
          <h1 className="qrscan-heading">Zeskanuj kod EUDI Walletem</h1>
          <p className="qrscan-text">
            Otwórz aplikację <strong>EUDI Wallet</strong> na swoim telefonie
            <br />i zeskanuj poniższy kod, aby potwierdzić swoją tożsamość.
          </p>
          <div className="qrscan-qr-wrapper">
            <QRCodeSVG value={qrData} size={240} level="M" />
          </div>
          <div className="qrscan-timer-row">
            <svg className="qrscan-timer-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className={`qrscan-timer ${timerClass}`}>
              {pad(minutes)}:{pad(seconds)}
            </span>
          </div>
          <div className="qrscan-progress">
            <div className="qrscan-progress__fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {state === 'success' && (
        <div className="qrscan-card">
          <div className="qrscan-icon qrscan-icon--success">&#10003;</div>
          <p className="qrscan-heading qrscan-heading--success">Weryfikacja zakończona!</p>
          <p className="qrscan-text">
            Twoja tożsamość została potwierdzona.
            <br />
            Możesz zamknąć tę kartę.
          </p>
          <button className="qrscan-btn qrscan-btn--success" onClick={() => window.close()}>
            Zamknij kartę
          </button>
        </div>
      )}

      {state === 'expired' && (
        <div className="qrscan-card">
          <div className="qrscan-icon qrscan-icon--error">&#10005;</div>
          <p className="qrscan-heading qrscan-heading--error">Czas upłynął</p>
          <p className="qrscan-text">
            Sesja weryfikacji wygasła.
            <br />
            Wróć do poprzedniej karty i spróbuj ponownie.
          </p>
          <button className="qrscan-btn qrscan-btn--secondary" onClick={() => window.close()}>
            Zamknij kartę
          </button>
        </div>
      )}

      {state === 'error' && (
        <div className="qrscan-card">
          <div className="qrscan-icon qrscan-icon--error">!</div>
          <p className="qrscan-heading qrscan-heading--error">Wystąpił błąd podczas skanowania</p>
          <p className="qrscan-text">
            Weryfikacja nie powiodła się.
            <br />
            Wróć do poprzedniej karty i spróbuj ponownie.
          </p>
          <button className="qrscan-btn qrscan-btn--secondary" onClick={() => window.close()}>
            Zamknij kartę
          </button>
        </div>
      )}
    </div>
  );
}

export default QrScanPage;
