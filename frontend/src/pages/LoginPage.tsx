import { type FormEvent, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { login } from "../store/authSlice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token, loading, error } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (token) navigate("/home", { replace: true });
  }, [token]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function handleLogin(e: FormEvent) {
    e.preventDefault();
    dispatch(login({ email, password }));
  }

  return (
    <div style={styles.container}>
      {/* Background with subtle pattern */}
      <div style={styles.background}>
        <div style={styles.floatingCircle1}></div>
        <div style={styles.floatingCircle2}></div>
        <div style={styles.floatingCircle3}></div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <div style={styles.logo}>
            <span style={styles.logoText}>✈</span>
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div style={styles.card}>
          <div style={styles.cardTopBorder}></div>
          
          <div style={styles.cardContent}>
            <form onSubmit={handleLogin} style={styles.form}>
              {/* Email Field */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputContainer}>
                  <svg style={styles.inputIcon} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div style={styles.fieldGroup}>
                <div style={styles.passwordHeader}>
                  <label style={styles.label}>Password</label>
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={styles.showPasswordButton}
                  >
                    {isPasswordVisible ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div style={styles.inputContainer}>
                  <svg style={styles.inputIcon} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div style={styles.errorContainer}>
                  <svg style={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span style={styles.errorText}>{error}</span>
                </div>
              )}

              {/* Options */}
              <div style={styles.optionsContainer}>
                <label style={styles.checkboxContainer}>
                  <input type="checkbox" style={styles.checkbox} />
                  <span style={styles.checkboxLabel}>Remember me</span>
                </label>
                <Link to="/forgot-password" style={styles.forgotPassword}>
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitButton,
                  ...(loading ? styles.submitButtonDisabled : {}),
                }}
              >
                {loading ? (
                  <div style={styles.loadingContainer}>
                    <div style={styles.spinner}></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg style={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerText}>Or continue with</span>
            </div>

            {/* Social Login */}
            <div style={styles.socialButtons}>
              <button style={styles.socialButton}>
                <svg style={styles.socialIcon} viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                </svg>
                Google
              </button>
              <button style={styles.socialButton}>
                <svg style={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            {/* Signup Link */}
            <div style={styles.signupContainer}>
              <p style={styles.signupText}>
                Don't have an account?{" "}
                <Link to="/signup" style={styles.signupLink}>
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>© {new Date().getFullYear()} SkyPortal. All rights reserved.</p>
          <p style={styles.footerSubtext}>By signing in, you agree to our Terms and Privacy Policy</p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-15px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: '20px',
    position: 'relative' as const,
    overflow: 'hidden',
  },

  background: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none' as const,
  },

  floatingCircle1: {
    position: 'absolute' as const,
    top: '20%',
    left: '10%',
    width: '300px',
    height: '300px',
    backgroundColor: '#f0f9ff',
    borderRadius: '50%',
    animation: 'float 20s ease-in-out infinite',
    opacity: 0.8,
  },

  floatingCircle2: {
    position: 'absolute' as const,
    bottom: '30%',
    right: '15%',
    width: '250px',
    height: '250px',
    backgroundColor: '#f8fafc',
    borderRadius: '50%',
    animation: 'float 15s ease-in-out infinite',
    opacity: 0.8,
  },

  floatingCircle3: {
    position: 'absolute' as const,
    top: '50%',
    left: '30%',
    width: '200px',
    height: '200px',
    backgroundColor: '#eff6ff',
    borderRadius: '50%',
    animation: 'float 10s ease-in-out infinite',
    opacity: 0.8,
  },

  content: {
    width: '100%',
    maxWidth: '440px',
    position: 'relative' as const,
    zIndex: 10,
    animation: 'fadeIn 0.6s ease-out',
  },

  logoContainer: {
    textAlign: 'center' as const,
    marginBottom: '40px',
  },

  logo: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
    marginBottom: '20px',
    animation: 'slideUp 0.5s ease-out',
  },

  logoText: {
    fontSize: '28px',
    color: '#ffffff',
  },

  title: {
    fontSize: '32px',
    fontWeight: 'bold' as const,
    color: '#111827',
    margin: '0 0 8px 0',
    animation: 'slideUp 0.5s ease-out 0.1s both',
  },

  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
    animation: 'slideUp 0.5s ease-out 0.2s both',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f3f4f6',
    overflow: 'hidden' as const,
    animation: 'slideUp 0.5s ease-out 0.3s both',
    transition: 'box-shadow 0.3s ease',
  },

  cardTopBorder: {
    height: '4px',
    background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
  },

  cardContent: {
    padding: '40px',
  },

  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },

  fieldGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  label: {
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#374151',
  },

  inputContainer: {
    position: 'relative' as const,
  },

  inputIcon: {
    position: 'absolute' as const,
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    color: '#9ca3af',
    transition: 'color 0.2s ease',
  },

  input: {
    width: '100%',
    padding: '14px 14px 14px 40px',
    fontSize: '15px',
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
    outline: 'none',
  },

  passwordHeader: {
    display: 'flex',
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },

  showPasswordButton: {
    fontSize: '14px',
    color: '#3b82f6',
    background: 'none',
    border: 'none',
    cursor: 'pointer' as const,
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'color 0.2s ease',
  },

  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    padding: '16px',
  },

  errorIcon: {
    width: '20px',
    height: '20px',
    color: '#dc2626',
    flexShrink: 0,
  },

  errorText: {
    fontSize: '14px',
    color: '#dc2626',
  },

  optionsContainer: {
    display: 'flex',
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },

  checkboxContainer: {
    display: 'flex',
    alignItems: 'center' as const,
    gap: '8px',
    cursor: 'pointer' as const,
  },

  checkbox: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    cursor: 'pointer' as const,
  },

  checkboxLabel: {
    fontSize: '14px',
    color: '#374151',
  },

  forgotPassword: {
    fontSize: '14px',
    color: '#3b82f6',
    textDecoration: 'none' as const,
    transition: 'color 0.2s ease',
  },

  submitButton: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600' as const,
    color: '#ffffff',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },

  submitButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed' as const,
  },

  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },

  buttonIcon: {
    width: '20px',
    height: '20px',
  },

  divider: {
    position: 'relative' as const,
    margin: '32px 0',
    textAlign: 'center' as const,
  },

  dividerLine: {
    position: 'absolute' as const,
    top: '50%',
    left: 0,
    right: 0,
    height: '1px',
    backgroundColor: '#e5e7eb',
  },

  dividerText: {
    position: 'relative' as const,
    display: 'inline-block',
    padding: '0 16px',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    color: '#6b7280',
  },

  socialButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },

  socialButton: {
    padding: '14px',
    fontSize: '15px',
    fontWeight: '500' as const,
    color: '#374151',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    cursor: 'pointer' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },

  socialIcon: {
    width: '20px',
    height: '20px',
  },

  signupContainer: {
    marginTop: '32px',
    paddingTop: '32px',
    borderTop: '1px solid #e5e7eb',
  },

  signupText: {
    fontSize: '15px',
    color: '#6b7280',
    textAlign: 'center' as const,
    margin: 0,
  },

  signupLink: {
    fontSize: '15px',
    fontWeight: '600' as const,
    color: '#3b82f6',
    textDecoration: 'none' as const,
    transition: 'color 0.2s ease',
  },

  footer: {
    marginTop: '40px',
    textAlign: 'center' as const,
  },

  footerText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 8px 0',
  },

  footerSubtext: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
  },
};