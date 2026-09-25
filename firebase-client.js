import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

const cfg = window.UMRAHKASIH_FIREBASE_CONFIG || {};
export const firebaseReady = Boolean(cfg.apiKey && cfg.authDomain && cfg.projectId && cfg.appId);

let app = null;
let auth = null;
let db = null;

if (firebaseReady) {
  app = initializeApp(cfg);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };

export function normalizeMusawwiqId(value='') {
  return String(value).toUpperCase().replace(/[^A-Z0-9]/g,'');
}

export function authEmailFromId(id) {
  return `${normalizeMusawwiqId(id).toLowerCase()}@login.umrahkasih.online`;
}

export function makeMusawwiqId(country='MY') {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const rand = [...bytes].map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
  return `MW${country}${rand}`;
}
