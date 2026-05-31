import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService.js';
import {
  hashPassword,
  createPasskeySecret,
  createIdentity,
} from '../../services/identityService.js';
import './UserRegisterPage.css';

function UserRegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const handleEudiWalletClick = async () => {
    try {
      setLoading(true);
      setError('');

      const responseData = await authService.registerStep1();
      const qr = responseData?.qr;
      const transactionId = responseData?.transactionId;
      if (!qr || !transactionId) {
        throw new Error('Serwer nie zwrócił danych weryfikacyjnych (qr/transactionId)');
      }

      // Open QR code URL in new tab
      window.open(qr, '_blank');
      setStep(2);

      // Start long polling for verification
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await authService.registerStep2Poll(transactionId, controller.signal);
        setStep(3);
      } catch (pollErr) {
        if (pollErr.name === 'CanceledError' || pollErr.name === 'AbortError') {
          return;
        }
        if (pollErr.code === 'ECONNABORTED') {
          setError('Upłynął czas oczekiwania na weryfikację. Spróbuj ponownie.');
          setStep(1);
          return;
        }
        throw pollErr;
      }
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Błąd podczas łączenia z serwerem',
      );
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIdentity = async (secretString) => {
    try {
      setLoading(true);
      setError('');

      const identity = createIdentity(secretString);
      const commitment = identity.commitment.toString();
      await authService.registerStep3(commitment);

      setPassword('');
      setSuccess(true);
      authService.logout();
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Błąd podczas tworzenia tożsamości lub generowania klucza',
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyClick = async (attachment) => {
    try {
      setError('');
      const secret = await createPasskeySecret(attachment);
      await handleCreateIdentity(secret);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Błąd podczas tworzenia Passkey');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Hasło nie może być puste');
      return;
    }
    if (password.length < 12) {
      setError('Hasło musi mieć co najmniej 12 znaków');
      return;
    }
    try {
      const hashed = await hashPassword(password);
      await handleCreateIdentity(hashed);
    } catch {
      setError('Błąd podczas hashowania hasła');
    }
  };

  return (
    <>
      {success && (
        <div className="toast toast--success">
          Rejestracja zakończona pomyślnie!
        </div>
      )}
      <RegisterContent
        step={step}
        loading={loading}
        error={error}
        password={password}
        setPassword={setPassword}
        usePassword={usePassword}
        setUsePassword={setUsePassword}
        handleEudiWalletClick={handleEudiWalletClick}
        handlePasskeyClick={handlePasskeyClick}
        handlePasswordSubmit={handlePasswordSubmit}
      />
    </>
  );
}

function RegisterContent({
  step,
  loading,
  error,
  password,
  setPassword,
  usePassword,
  setUsePassword,
  handleEudiWalletClick,
  handlePasskeyClick,
  handlePasswordSubmit,
}) {
  if (step === 1) {
    return (
      <div className="user-register-container">
        <h2>Rejestracja użytkownika</h2>
        <p>Rozpocznij proces rejestracji używając portfela EUDI Wallet.</p>
        <button className="eudi-btn" onClick={handleEudiWalletClick} disabled={loading}>
          {loading ? 'Przetwarzanie...' : 'Zarejestruj z EUDI Wallet'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="user-register-container">
        <h2>Weryfikacja tożsamości</h2>
        <p>
          Otwarto kartę weryfikacji. Proszę dokończyć proces w otwartej karcie.
          <br />
          Oczekiwanie na potwierdzenie...
        </p>
        <div className="spinner" />
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }

  return (
    <div className="user-register-container">
      <h2>Zabezpiecz swoją tożsamość</h2>
      <p>Utwórz tożsamość, aby móc bezpiecznie i anonimowo podpisywać petycje.</p>

      {!usePassword ? (
        <div
          className="passkey-options"
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          <button
            className="passkey-btn"
            onClick={() => handlePasskeyClick('platform')}
            disabled={loading}
            style={{ backgroundColor: '#0f766e' }}
          >
            {loading ? 'Przetwarzanie...' : 'Windows Hello / Biometria'}
          </button>
          <button
            className="passkey-btn"
            onClick={() => handlePasskeyClick('security-key')}
            disabled={loading}
            style={{ backgroundColor: '#1e40af' }}
          >
            {loading ? 'Przetwarzanie...' : 'Klucz sprzętowy (U2F/Yubikey)'}
          </button>
          <button
            className="passkey-btn"
            onClick={() => handlePasskeyClick('hybrid')}
            disabled={loading}
            style={{ backgroundColor: '#6d28d9' }}
          >
            {loading ? 'Przetwarzanie...' : 'Kod QR / Telefon (Wymagany Bluetooth)'}
          </button>
          <button
            className="passkey-btn"
            onClick={() => setUsePassword(true)}
            disabled={loading}
            style={{ backgroundColor: '#64748b', marginTop: '10px' }}
          >
            Chcę użyć tradycyjnego hasła
          </button>
        </div>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="password-form">
          <input
            type="password"
            placeholder="Wprowadź silne hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Przetwarzanie...' : 'Utwórz tożsamość'}
          </button>
          <button
            type="button"
            className="passkey-btn"
            onClick={() => setUsePassword(false)}
            disabled={loading}
            style={{ backgroundColor: '#6366f1', marginTop: '10px' }}
          >
            Wróć do opcji Passkeys
          </button>
        </form>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default UserRegisterPage;
