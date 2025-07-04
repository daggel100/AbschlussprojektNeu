import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react'; 
import './Login.css'; 
import { API_URL } from '../config';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      alert('Bitte alle Felder ausfüllen');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        if (rememberMe) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('rememberMe', 'true');
        } else {
          sessionStorage.setItem('token', data.token);
          localStorage.removeItem('rememberMe');
        }
        
        window.location.href = '/profile'; // <-- geändert von '/dashboard' zu '/profile'
      } else {
        alert(data.message || 'Login fehlgeschlagen');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Verbindungsfehler');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      alert('Bitte E-Mail-Adresse eingeben');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      console.log('Password reset for:', formData.email);
      setIsLoading(false);
      alert('E-Mail zum Zurücksetzen des Passworts wurde gesendet!');
      setShowForgotPassword(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (showForgotPassword) {
        handleForgotPassword();
      } else {
        handleLogin();
      }
    }
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="login-page-wrapper">
      {/* Background Pattern */}
      <div className="background-pattern-container">
        <div className="background-pattern"></div>
      </div>

      {/* Login Container */}
      <div className="login-main-container">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="back-button"
        >
          <ArrowLeft size={20} className="back-button-icon" />
          Zurück
        </button>

        {/* Main Card */}
        <div className="login-card">
          {/* Header with Gradient */}
          <div className="login-card-header">
            <div className="header-icon-wrapper">
              <User size={32} className="header-icon" />
            </div>
            <h1 className="header-title">
              {showForgotPassword ? 'Passwort zurücksetzen' : 'Willkommen zurück'}
            </h1>
            <p className="header-subtitle">
              {showForgotPassword 
                ? 'Gib deine E-Mail-Adresse ein'
                : 'Logge dich ein, um fortzufahren und der Nachbartschaft zu helfen.'
              }
            </p>
          </div>

          {/* Form Content */}
          <div className="login-card-content">
            {/* Login Form */}
            {!showForgotPassword ? (
              <div className="form-section login-form">
                {/* Email Field - KORRIGIERT */}
                <div className="input-group">
                  <User size={20} className="input-icon" />
                  <input
                    type="email"
                    name="email" // <-- KORRIGIERT von "username" zu "email"
                    placeholder="E-Mail"
                    value={formData.email} // <-- KORRIGIERT von formData.username
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="input-group">
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Passwort"
                    value={formData.password}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="form-options">
                  <label className="remember-me-checkbox">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Angemeldet bleiben</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="forgot-password-link"
                  >
                    Passwort vergessen?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="submit-button primary-button"
                >
                  {isLoading ? (
                    <div className="spinner-container">
                      <div className="spinner"></div>
                      Anmelden...
                    </div>
                  ) : (
                    'Anmelden'
                  )}
                </button>
              </div>
            ) : (
              /* Forgot Password Form */
              <div className="form-section forgot-password-form">
                {/* Email Field */}
                <div className="input-group">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="E-Mail-Adresse"
                    value={formData.email}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    required
                  />
                </div>

                {/* Info Text */}
                <div className="info-box">
                  <p>
                    📧 Du erhältst eine E-Mail mit einem Link zum Zurücksetzen deines Passworts.
                  </p>
                </div>

                {/* Buttons */}
                <div className="button-group">
                  <button
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                    className="submit-button primary-button"
                  >
                    {isLoading ? (
                      <div className="spinner-container">
                        <div className="spinner"></div>
                        Senden...
                      </div>
                    ) : (
                      'Passwort zurücksetzen'
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowForgotPassword(false)}
                    className="submit-button secondary-button"
                  >
                    Zurück zum Login
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="card-footer">
              <div className="separator">
                <span>oder</span>
              </div>
              <p className="register-prompt">
                Noch kein Konto? 
                <a href="/register" className="register-link">
                  Jetzt registrieren
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="additional-info">
          <p>
            🔒 Deine Daten sind sicher und werden verschlüsselt übertragen
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;