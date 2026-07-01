/* ================================================================
   STATS LOADER — Vishaali Portfolio
   ----------------------------------------------------------------
   Fetches data/stats.json and updates every [data-stat] element
   on the page.  Edit stats.json each night — that's it.

   HOW IT WORKS
   1. Fetch data/stats.json
   2. Build a lookup map from the JSON values
   3. Find every element that has a data-stat attribute
   4. Write the matching value into that element's text
   5. Update the progress-bar width + ARIA attributes
   6. Show an optional motivational message in the Journey section
   ================================================================ */

(function () {
  'use strict';

  /* 1. Fetch stats.json */
  fetch('data/stats.json')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('stats.json not found (HTTP ' + response.status + ')');
      }
      return response.json();
    })
    .then(function (data) {
      applyStats(data);
    })
    .catch(function (err) {
      // Silently fail — the hardcoded fallback values in HTML remain visible
      console.warn('[Stats Loader] Could not load stats.json:', err.message);
    });

  /* 2. Apply stats to the page */
  function applyStats(data) {
    var journey = data.journey || {};
    var stats   = data.stats   || {};

    var currentDay    = journey.currentDay  || 0;
    var totalDays     = journey.totalDays   || 180;
    var daysRemaining = totalDays - currentDay;
    var progressPct   = totalDays > 0
      ? parseFloat(((currentDay / totalDays) * 100).toFixed(2))
      : 0;

    /*
      Flat lookup so HTML elements can reference any key
      via data-stat="keyName". Calculated values included.
    */
    var lookup = {
      currentDay:     currentDay,
      totalDays:      totalDays,
      daysRemaining:  daysRemaining,
      progressPct:    progressPct,
      problemsSolved: stats.problemsSolved || 0,
      githubStreak:   stats.githubStreak   || 0,
      projectsBuilt:  stats.projectsBuilt  || 0,
      hoursInvested:  stats.hoursInvested  || 0,
    };

    /* 3. Update all [data-stat] elements */
    var statEls = document.querySelectorAll('[data-stat]');
    statEls.forEach(function (el) {
      var key = el.getAttribute('data-stat');
      if (key in lookup) {
        el.textContent = lookup[key];
      }
    });

    /* 4. Update progress bar */
    var bar = document.querySelector('[data-progress-bar]');
    if (bar) {
      bar.style.width        = progressPct + '%';
      bar.setAttribute('aria-valuenow', currentDay);
      bar.setAttribute('aria-valuemax', totalDays);
      bar.setAttribute(
        'aria-label',
        'Journey progress: Day ' + currentDay + ' of ' + totalDays
      );
    }

    /* 5. Optional motivational message */
    showMotivationalMessage(lookup, journey.startDate, data.lastUpdated);
  }

  /* 6. Motivational/reminder message (bonus) */
  function showMotivationalMessage(lookup, startDate, lastUpdated) {
    var journeySection = document.getElementById('journey');
    if (!journeySection) return;

    // Remove any previous message so refreshes don't stack
    var old = document.getElementById('stats-motivational-msg');
    if (old) old.remove();

    var msg = '';

    // Perfect streak check
    if (lookup.githubStreak > 0 && lookup.githubStreak >= lookup.currentDay) {
      msg = "Streak: Perfect! You've committed every single day!";
    } else if (lookup.githubStreak > 0 && lookup.githubStreak < lookup.currentDay) {
      msg = "Keep going! Every day counts — rebuild that streak!";
    }

    // Warn if stats.json appears stale (actual days since startDate > currentDay + 1)
    if (startDate) {
      var start      = new Date(startDate);
      var now        = new Date();
      var actualDays = Math.floor((now - start) / 86400000);
      if (actualDays > lookup.currentDay + 1) {
        msg = "Don't forget to update stats.json! (Last updated: " + (lastUpdated || 'unknown') + ')';
      }
    }

    if (!msg) return;

    var msgEl       = document.createElement('p');
    msgEl.id        = 'stats-motivational-msg';
    msgEl.className = 'stats-motivational-msg';
    msgEl.textContent = msg;

    var cta = journeySection.querySelector('.journey-cta');
    if (cta) {
      journeySection.querySelector('.container').insertBefore(msgEl, cta);
    }
  }
})();
