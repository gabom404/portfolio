/**
 * visitors.js — who played the hot lap.
 * Before the start lights, the game asks for the visitor's first and last name.
 * The visit and each completed lap are saved to Cloud Firestore through its REST
 * API, so no Firebase SDK is needed. The form says that the name is saved with the
 * times. Security rules (firestore.rules) only allow creating documents with these
 * fields; nobody can read them from the site.
 *
 * Loaded on demand with the game.
 */
(function (root) {
  'use strict';

  /* Firebase web config of the project (public identifiers, not secrets).
     Leave apiKey empty to run the game without saving anything. */
  var FIREBASE = {
    apiKey: '',
    projectId: ''
  };

  var STORAGE_PLAYER = 'c404-player';

  /* ---------- name check (pure, unit-tested) ---------- */
  var PLACEHOLDERS = ['user', 'usuario', 'username', 'test', 'tester', 'prueba', 'admin', 'administrador', 'root',
    'guest', 'invitado', 'anon', 'anonimo', 'anonymous', 'nombre', 'name', 'apellido', 'lastname', 'nadie', 'nobody',
    'demo', 'hola', 'hello', 'asdf', 'qwerty', 'xxx', 'abc', 'foo', 'bar', 'null', 'undefined', 'player', 'jugador', 'recruiter', 'reclutador'];

  function fold(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }

  /** Cleans the name: trims, collapses spaces and capitalises each word. */
  function tidy(name) {
    return String(name || '').trim().replace(/\s+/g, ' ').split(' ').map(function (w) {
      return w.split('-').map(function (p) { return p ? p.charAt(0).toLocaleUpperCase('es') + p.slice(1).toLocaleLowerCase('es') : p; }).join('-');
    }).join(' ');
  }

  /** Returns null when the name looks like a real first and last name, or the key of the problem. */
  function checkName(name) {
    var n = String(name || '').trim().replace(/\s+/g, ' ');
    if (n.length < 5 || n.length > 60) return 'visit.err.length';
    if (!/^[\p{L}][\p{L}'’.\- ]*$/u.test(n)) return 'visit.err.chars';
    var words = n.split(' ').filter(function (w) { return w.replace(/[.'’-]/g, '').length > 0; });
    if (words.length < 2) return 'visit.err.surname';
    for (var i = 0; i < words.length; i++) {
      var w = fold(words[i]).replace(/[.'’-]/g, '');
      if (PLACEHOLDERS.indexOf(w) !== -1) return 'visit.err.fake';
      if (w.length >= 2 && !/[aeiouy]/.test(w)) return 'visit.err.fake';      // keyboard mash, e.g. "sdfg"
      if (/(.)\1\1/.test(w)) return 'visit.err.fake';                         // "aaa", "xxxx"
    }
    if (words.filter(function (w) { return w.replace(/[.'’-]/g, '').length >= 2; }).length < 2) return 'visit.err.surname';
    if (fold(words[0]) === fold(words[1])) return 'visit.err.fake';
    return null;
  }

  /* ---------- Firestore REST ---------- */
  function enabled() { return !!(FIREBASE.apiKey && FIREBASE.projectId); }

  function toFields(data) {
    var f = {};
    Object.keys(data).forEach(function (k) {
      var v = data[k];
      if (Object.prototype.toString.call(v) === '[object Date]') f[k] = { timestampValue: v.toISOString() };
      else if (typeof v === 'boolean') f[k] = { booleanValue: v };
      else if (typeof v === 'number') f[k] = { integerValue: String(Math.round(v)) };
      else f[k] = { stringValue: String(v) };
    });
    return { fields: f };
  }

  function save(collection, data) {
    if (!enabled() || !root.fetch) return Promise.resolve(false);
    var url = 'https://firestore.googleapis.com/v1/projects/' + encodeURIComponent(FIREBASE.projectId) +
      '/databases/(default)/documents/' + collection + '?key=' + encodeURIComponent(FIREBASE.apiKey);
    return root.fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toFields(data)),
      keepalive: true
    }).then(function (r) { return r.ok; }, function () { return false; });
  }

  /* ---------- player ---------- */
  var player = null;

  function remembered() {
    try { var p = JSON.parse(localStorage.getItem(STORAGE_PLAYER) || 'null'); return p && !checkName(p.name) ? p : null; } catch (e) { return null; }
  }

  /** Registers the player for this session and logs the visit. */
  function register(name, lang) {
    player = { name: tidy(name) };
    try { localStorage.setItem(STORAGE_PLAYER, JSON.stringify(player)); } catch (e) { /* ignore */ }
    save('visitas', { nombre: player.name, idioma: lang === 'en' ? 'en' : 'es', fecha: new Date() });
    return player;
  }

  function forget() {
    player = null;
    try { localStorage.removeItem(STORAGE_PLAYER); } catch (e) { /* ignore */ }
  }

  /** Saves a finished lap of the current player. */
  function lap(ms, reaction, jump) {
    if (!player) return Promise.resolve(false);
    return save('vueltas', { nombre: player.name, tiempoMs: ms, reaccionMs: reaction == null ? -1 : reaction, salidaEnFalso: !!jump, fecha: new Date() });
  }

  root.C404 = root.C404 || {};
  root.C404.visitors = {
    checkName: checkName, tidy: tidy, toFields: toFields,
    enabled: enabled, remembered: remembered, register: register, forget: forget, lap: lap,
    get player() { return player; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
