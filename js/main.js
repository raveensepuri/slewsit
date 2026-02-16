/**
 * SlewsIT – Main JavaScript
 * Production-ready, defensive, no framework dependency
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ============================================================
       Utility Functions
    ============================================================ */

    function qs(selector, scope) {
      return (scope || document).querySelector(selector);
    }

    function qsa(selector, scope) {
      return (scope || document).querySelectorAll(selector);
    }

    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, function (c) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[c];
      });
    }

    function safeJSONParse(value, fallback) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return fallback;
      }
    }

    /* ============================================================
       Contact Form Logic
    ============================================================ */

    var form = qs('#contactForm');
    var demoSection = qs('#demoSubmissions');
    var submissionsList = qs('#subList');
    var clearBtn = qs('#clearLocal');

    var STORAGE_KEY = 'slewsit_submissions';

    function loadSubmissions() {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? safeJSONParse(raw, []) : [];
    }

    function saveSubmission(entry) {
      var subs = loadSubmissions();
      subs.unshift(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
      renderSubmissions();
    }

    function renderSubmissions() {
      if (!demoSection || !submissionsList) return;

      var subs = loadSubmissions();

      if (!subs.length) {
        demoSection.style.display = 'none';
        return;
      }

      demoSection.style.display = 'block';

      submissionsList.innerHTML = subs.map(function (s) {
        return (
          '<li>' +
          '<strong>' + escapeHtml(s.name) + '</strong>' +
          ' (' + escapeHtml(s.email) + ')' +
          '<br>' +
          '<span>' + escapeHtml(s.message) + '</span>' +
          '</li>'
        );
      }).join('');
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var name = qs('[name="name"]', form)?.value.trim();
        var email = qs('[name="email"]', form)?.value.trim();
        var message = qs('[name="message"]', form)?.value.trim();

        if (!name || !email || !message) {
          alert('Please complete all required fields.');
          return;
        }

        saveSubmission({
          name: name,
          email: email,
          message: message,
          ts: Date.now()
        });

        var subject = encodeURIComponent(
          'Executive Consultation Request – ' + name
        );

        var body = encodeURIComponent(
          'Name: ' + name +
          '\nEmail: ' + email +
          '\n\nEngagement Overview:\n' +
          message
        );

        window.location.href =
          'mailto:slewsit@gmail.com?subject=' +
          subject +
          '&body=' +
          body;

        form.reset();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        localStorage.removeItem(STORAGE_KEY);
        renderSubmissions();
      });
    }

    renderSubmissions();

    /* ============================================================
       Header Dropdown Enhancements (Optional JS Support)
       Keeps CSS hover working but improves accessibility
    ============================================================ */

    var dropdowns = qsa('.dropdown');

    dropdowns.forEach(function (dropdown) {
      var button = qs('.dropbtn', dropdown);

      if (!button) return;

      button.addEventListener('click', function (e) {
        // Allow normal navigation if direct click without JS handling
        if (button.getAttribute('href')) {
          return;
        }

        e.preventDefault();
        dropdown.classList.toggle('open');
      });
    });

    /* ============================================================
       Smooth Scroll for Anchor Links
    ============================================================ */

    qsa('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = qs(this.getAttribute('href'));
        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });

  });

})();
