"use strict";

/* ======================================================
   AUTH.JS — Client-Side Auth for Personal Section
   • SHA-256 via Web Crypto (HTTPS / localhost)
   • Automatic fallback hash for HTTP dev environments
   • Users stored in localStorage (ak_users)
   • Token in sessionStorage (session) or localStorage (remember me)
====================================================== */

const AUTH_USERS_KEY  = "ak_users";
const AUTH_TOKEN_KEY  = "ak_auth_token";
const SESSION_EXP_MS  = 24 * 60 * 60 * 1000;        // 24 h
const REMEMBER_EXP_MS = 30 * 24 * 60 * 60 * 1000;   // 30 days
const RATE_LIMIT_KEY  = "ak_login_attempts";
const MAX_ATTEMPTS    = 5;
const LOCKOUT_MS      = 15 * 60 * 1000;              // 15 min

/* ======================================================
   HASH — SHA-256 with fallback for non-secure contexts
====================================================== */

async function hashPassword(password) {
  if (window.crypto && window.crypto.subtle) {
    try {
      const enc = new TextEncoder();
      const buf = await window.crypto.subtle.digest("SHA-256", enc.encode(password));
      return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
    } catch { /* fall through to simple hash */ }
  }
  /* Fallback: cyrb53 double-hash for non-secure HTTP contexts */
  return cyrb53(password);
}

function cyrb53(str) {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
       Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
       Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hi = (h2 >>> 0).toString(16).padStart(8, "0");
  const lo = (h1 >>> 0).toString(16).padStart(8, "0");
  return hi + lo + str.length.toString(16);
}

/* ======================================================
   RATE LIMITING
====================================================== */

function checkRateLimit() {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { blocked: false };
    const data = JSON.parse(raw);
    if (Date.now() > data.resetAt) {
      sessionStorage.removeItem(RATE_LIMIT_KEY);
      return { blocked: false };
    }
    return { blocked: data.attempts >= MAX_ATTEMPTS };
  } catch { return { blocked: false }; }
}

function recordFailedAttempt() {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
    const data = raw ? JSON.parse(raw) : { attempts: 0, resetAt: Date.now() + LOCKOUT_MS };
    data.attempts++;
    if (Date.now() > data.resetAt) data.resetAt = Date.now() + LOCKOUT_MS;
    sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  } catch {}
}

function clearRateLimit() {
  try { sessionStorage.removeItem(RATE_LIMIT_KEY); } catch {}
}

/* ======================================================
   TOKEN HELPERS
====================================================== */

function saveToken(username, remember) {
  const token = JSON.stringify({
    username,
    exp: Date.now() + (remember ? REMEMBER_EXP_MS : SESSION_EXP_MS)
  });
  try {
    if (remember) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  } catch { /* storage blocked (private mode quota, etc.) */ }
}

function getToken() {
  try {
    const raw =
      sessionStorage.getItem(AUTH_TOKEN_KEY) ||
      localStorage.getItem(AUTH_TOKEN_KEY);
    if (!raw) return null;
    const token = JSON.parse(raw);
    if (Date.now() > token.exp) {
      clearToken();
      return null;
    }
    return token;
  } catch {
    clearToken();
    return null;
  }
}

function clearToken() {
  try {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {}
}

/* ======================================================
   PUBLIC API
====================================================== */

function isAuthenticated() {
  return getToken() !== null;
}

function getAuthUser() {
  const token = getToken();
  return token ? token.username : null;
}

function hasAnyUser() {
  try {
    const users = JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || "[]");
    return users.length > 0;
  } catch {
    return false;
  }
}

async function signup(username, password) {
  try {
    username = username.trim().toLowerCase();
    if (!username || !password)  return { ok: false, error: "All fields are required." };
    if (username.length < 3)     return { ok: false, error: "Username must be at least 3 characters." };
    if (password.length < 6)     return { ok: false, error: "Password must be at least 6 characters." };

    const users = JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || "[]");
    if (users.find(u => u.username === username)) {
      return { ok: false, error: "That username is already taken." };
    }

    const passwordHash = await hashPassword(password);
    users.push({ username, passwordHash });
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
    return { ok: true };
  } catch (err) {
    console.error("[auth] signup error:", err);
    return { ok: false, error: "Signup failed. Please try again." };
  }
}

async function login(username, password, remember = false) {
  try {
    if (checkRateLimit().blocked) {
      return { ok: false, error: "Too many attempts. Please wait 15 minutes." };
    }

    username = username.trim().toLowerCase();
    if (!username || !password) return { ok: false, error: "All fields are required." };

    const users = JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || "[]");
    const user  = users.find(u => u.username === username);
    if (!user) { recordFailedAttempt(); return { ok: false, error: "Incorrect username or password." }; }

    const hash = await hashPassword(password);
    if (hash !== user.passwordHash) { recordFailedAttempt(); return { ok: false, error: "Incorrect username or password." }; }

    clearRateLimit();
    saveToken(username, remember);
    return { ok: true };
  } catch (err) {
    console.error("[auth] login error:", err);
    return { ok: false, error: "Login failed. Please try again." };
  }
}

function logout() {
  clearToken();
  window.location.replace("/pages/login.html");
}

/* ======================================================
   ROUTE GUARD
   Call this synchronously at top of protected pages.
   Hides body until auth confirmed to prevent flash.
====================================================== */

function requireAuth() {
  if (!isAuthenticated()) {
    document.documentElement.style.visibility = "hidden";
    const next = encodeURIComponent(
      window.location.pathname + window.location.search
    );
    window.location.replace("/pages/login.html?next=" + next);
  }
}
