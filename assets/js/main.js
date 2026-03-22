/**
 * Team Zentris – Esports website
 * Vanilla JS: mobile menu, slider, video modal, active nav
 */
(function () {
  'use strict';

  // --- Upcoming events cards (image, status, name, game, participants, icon) ---
  var eventCards = [
    { image: 'assets/img/upcoming-event-hungarian-pro-series-starcraft2-budapest.webp', status: 'Online', name: 'Hungarian Pro Series 7', game: 'StarCraft II', participants: [], icon: 'crown' },
    { image: 'assets/img/upcoming-event-hungarian-pro-series-starcraft2-budapest.webp', status: 'Online', name: 'HPS: Sunday Cup #2', game: 'StarCraft II', participants: [], icon: 'trophy' },
    { image: 'assets/img/wortex-esport-csapatok-versenye.webp', status: 'OFFLINE - HU, Budapest', name: 'WORTEX 2026', game: 'StarCraft II', participants: [], icon: 'crown' },
    { image: 'assets/img/wortex-esport-csapatok-versenye.webp', status: 'OFFLINE - HU, Budapest', name: 'WORTEX 2026', game: 'Hearthstone', participants: [], icon: 'crown' }
  ];

  var iconSvgs = {
    trophy: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="url(#eventCardIconGradient)" aria-hidden="true"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zm-2 0v3.82c-1.16-.42-2-1.52-2 2.82h2V5zm-4 0v6.74c-1.12-.26-2-1.04-2-2.74V5h4zM5 8c0 1.3.84 2.4 2 2.82V5H5v3zm14 0V5h-2v5.82c1.16-.42 2-1.52 2-2.82z"/></svg>',
    crown: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="url(#eventCardIconGradient)" aria-hidden="true"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z"/></svg>'
  };

  // --- Mobile menu toggle ---
  function initMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var open = nav.classList.contains('is-open');
      nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', !open);
    });

    // Close on link click (mobile)
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Logo click on home: smooth scroll to top ---
  function initLogoScroll() {
    var logo = document.querySelector('.site-logo[href="index.html"]');
    if (!logo) return;
    var path = window.location.pathname;
    var page = path.split('/').pop() || 'index.html';
    if (page === '') page = 'index.html';
    if (page !== 'index.html') return;

    logo.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Active nav link (current page) ---
  function setActiveNav() {
    var path = window.location.pathname;
    var page = path.split('/').filter(Boolean).pop() || 'index';
    if (page === '') page = 'index';
    var pageBase = page.replace(/\.html$/, '');
    var isRosterPage = pageBase === 'roster' || path.indexOf('/roster/') >= 0 || path.indexOf('roster\\') >= 0;
    document.querySelectorAll('.main-nav a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      var linkPage = href.split('/').filter(Boolean).pop() || 'index';
      var linkBase = linkPage.replace(/\.html$/, '');
      var isRosterLink = linkBase === 'roster';
      if (linkBase === pageBase || (isRosterPage && isRosterLink)) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  // --- Upcoming events: 1 card per slide, arrows move 1 card (2 cards visible) ---
  function renderEventCards() {
    var viewport = document.getElementById('event-cards-viewport');
    var track = document.getElementById('event-cards-track');
    if (!viewport || !track) return;

    var numCards = eventCards.length;
    viewport.style.setProperty('--event-cards-count', String(numCards));

    function cardHtml(card) {
      var icon = iconSvgs[card.icon] || iconSvgs.trophy;
      var imgSrc = card.image ? escapeHtml(card.image) : '';
      return (
        '<article class="event-card">' +
          '<div class="event-card-bg">' +
            (imgSrc ? '<img src="' + imgSrc + '" alt="">' : '') +
          '</div>' +
          '<div class="event-card-overlay"></div>' +
          '<span class="event-card-icon">' + icon + '</span>' +
          '<div class="event-card-body">' +
            '<span class="event-card-status">' + escapeHtml(card.status) + '</span>' +
            '<h3 class="event-card-title">' + escapeHtml(card.name) + '</h3>' +
            (card.game ? '<p class="event-card-game">' + escapeHtml(card.game) + '</p>' : '') +
          '</div>' +
        '</article>'
      );
    }

    track.innerHTML = eventCards.map(function (card) {
      return '<div class="event-cards-slide">' + cardHtml(card) + '</div>';
    }).join('');

    var slideIndex = 0;
    function getCardsVisible() {
      var v = getComputedStyle(viewport).getPropertyValue('--event-cards-visible').trim();
      return Math.max(1, parseInt(v, 10) || 1);
    }
    function getMaxIndex() {
      return Math.max(0, numCards - getCardsVisible());
    }
    function goToSlide(idx) {
      var maxIdx = getMaxIndex();
      slideIndex = Math.max(0, Math.min(idx, maxIdx));
      var percentPerCard = 100 / numCards;
      track.style.transform = 'translateX(-' + (slideIndex * percentPerCard) + '%)';
    }

    var prevBtn = document.getElementById('event-cards-prev');
    var nextBtn = document.getElementById('event-cards-next');
    if (prevBtn) prevBtn.addEventListener('click', function () { goToSlide(slideIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goToSlide(slideIndex + 1); });

    // --- Drag / swipe to move (PC and mobile) ---
    var dragStartX = 0;
    var dragCurrentX = 0;
    var isDragging = false;
    var trackTransition = track.style.transition;

    function getDragX(e) {
      if (e.touches && e.touches.length) return e.touches[0].clientX;
      return e.clientX;
    }

    function onDragStart(e) {
      isDragging = true;
      dragStartX = getDragX(e);
      dragCurrentX = dragStartX;
      track.style.transition = 'none';
      viewport.style.cursor = 'grabbing';
    }

    function onDragMove(e) {
      if (!isDragging) return;
      dragCurrentX = getDragX(e);
      var delta = dragCurrentX - dragStartX;
      var percentPerCard = 100 / numCards;
      track.style.transform = 'translateX(calc(-' + (slideIndex * percentPerCard) + '% + ' + delta + 'px))';
    }

    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = trackTransition || '';
      viewport.style.cursor = '';
      var delta = dragCurrentX - dragStartX;
      var threshold = viewport.offsetWidth * 0.15;
      if (delta > threshold) goToSlide(slideIndex - 1);
      else if (delta < -threshold) goToSlide(slideIndex + 1);
      else goToSlide(slideIndex);
    }

    viewport.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      onDragStart(e);
    });
    document.addEventListener('mousemove', function (e) {
      onDragMove(e);
    });
    document.addEventListener('mouseup', function () {
      onDragEnd();
    });
    document.addEventListener('mouseleave', function () {
      if (isDragging) onDragEnd();
    });

    viewport.addEventListener('touchstart', function (e) {
      onDragStart(e.touches[0] ? e : { touches: [e] });
    }, { passive: true });
    viewport.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      dragCurrentX = e.touches[0].clientX;
      var delta = dragCurrentX - dragStartX;
      var percentPerCard = 100 / numCards;
      track.style.transform = 'translateX(calc(-' + (slideIndex * percentPerCard) + '% + ' + delta + 'px))';
      if (Math.abs(delta) > 10) e.preventDefault();
    }, { passive: false });
    viewport.addEventListener('touchend', function () {
      onDragEnd();
    });
    viewport.addEventListener('touchcancel', function () {
      onDragEnd();
    });

    window.addEventListener('resize', function () {
      var maxIdx = getMaxIndex();
      if (slideIndex > maxIdx) goToSlide(maxIdx);
    });
  }

  // --- Video modal ---
  function initVideoModal() {
    var card = document.getElementById('video-card');
    var modal = document.getElementById('video-modal');
    var closeBtn = document.getElementById('modal-close');
    if (!card || !modal || !closeBtn) return;

    function openModal() {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      modal.setAttribute('aria-modal', 'true');
      closeBtn.focus();
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('aria-modal', 'false');
      document.body.style.overflow = '';
    }

    card.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  // --- Forms: prevent submit (no backend) ---
  function initContactForm() {
    var form = document.querySelector('.contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        var orig = btn.textContent;
        btn.textContent = 'Sent (demo)';
        setTimeout(function () { btn.textContent = orig; }, 2000);
      }
    });
  }


  // --- Roster: filters (All, StarCraft 2, Hearthstone, Fighting, Staff) with smooth switch animation ---
  var ROSTER_EXIT_MS = 280;
  var ROSTER_ENTER_MS = 320;

  function initRosterFilters() {
    var filtersWrap = document.querySelector('.roster-filters');
    var titleEl = document.getElementById('roster-title');
    var grid = document.getElementById('roster-grid');
    if (!filtersWrap || !titleEl || !grid) return;

    var titleByFilter = {
      all: 'Roster',
      sc2: 'StarCraft 2',
      hearthstone: 'Hearthstone',
      fighting: 'Fighting games',
      staff: 'Staff'
    };

    filtersWrap.querySelectorAll('.roster-filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        if (btn.classList.contains('active')) return;

        filtersWrap.querySelectorAll('.roster-filter').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        titleEl.textContent = titleByFilter[filter] || 'Roster';

        var cards = grid.querySelectorAll('.player-card[data-game]');
        var toShow = [];
        var toHide = [];

        cards.forEach(function (card) {
          var games = (card.getAttribute('data-game') || '').split(/\s+/);
          var show = filter === 'all' || games.indexOf(filter) >= 0;
          if (show) {
            toShow.push(card);
          } else {
            toHide.push(card);
          }
        });

        // Exit: animate out then hide
        toHide.forEach(function (card) {
          card.classList.remove('roster-card-enter', 'roster-card-enter-active');
          card.classList.add('roster-card-exit');
        });

        setTimeout(function () {
          toHide.forEach(function (card) {
            card.classList.add('is-hidden');
            card.classList.remove('roster-card-exit');
          });
          // Enter: show then animate in
          toShow.forEach(function (card) {
            card.classList.remove('is-hidden');
            card.classList.add('roster-card-enter');
            card.offsetHeight; // reflow
            card.classList.add('roster-card-enter-active');
          });
          setTimeout(function () {
            toShow.forEach(function (card) {
              card.classList.remove('roster-card-enter', 'roster-card-enter-active');
            });
          }, ROSTER_ENTER_MS);
        }, ROSTER_EXIT_MS);
      });
    });
  }

  // --- Roster: More/Close button = same as desktop hover, but click to toggle ---
  function initPlayerMore() {
    document.querySelectorAll('.player-more-btn').forEach(function (btn) {
      var id = btn.getAttribute('aria-controls');
      var panel = id ? document.getElementById(id) : null;
      if (!panel) return;
      function updateButtonLabel() {
        var isOpen = !panel.classList.contains('is-hidden');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        btn.textContent = isOpen ? 'Close' : 'More';
      }
      btn.addEventListener('click', function () {
        var isOpen = !panel.classList.contains('is-hidden');
        if (isOpen) {
          panel.classList.add('is-hidden');
        } else {
          panel.classList.remove('is-hidden');
        }
        updateButtonLabel();
      });
      updateButtonLabel();
    });
  }

  // --- Results table: sort by Placement or Date (asc/desc) ---
  function initResultsTableSort() {
    var table = document.querySelector('.results-table');
    if (!table) return;
    var thead = table.querySelector('thead th[data-sort]');
    if (!thead) return;
    var headers = table.querySelectorAll('th[data-sort]');
    var tbody = table.querySelector('tbody');
    if (!tbody) return;
    var rows = Array.from(tbody.querySelectorAll('tr'));
    var currentSort = { column: 'date', dir: 'desc' };

    function getSortValue(row, col) {
      var val = row.getAttribute('data-sort-' + col);
      return col === 'placement' ? parseFloat(val, 10) : (val || '');
    }

    function updateHeaders() {
      headers.forEach(function (th) {
        var col = th.getAttribute('data-sort');
        var ascEl = th.querySelector('.sort-asc');
        var descEl = th.querySelector('.sort-desc');
        if (col === currentSort.column) {
          th.setAttribute('aria-sort', currentSort.dir === 'asc' ? 'ascending' : 'descending');
          if (ascEl) ascEl.classList.toggle('active', currentSort.dir === 'asc');
          if (descEl) descEl.classList.toggle('active', currentSort.dir === 'desc');
        } else {
          th.setAttribute('aria-sort', 'none');
          if (ascEl) ascEl.classList.remove('active');
          if (descEl) descEl.classList.remove('active');
        }
      });
    }

    function sortRows() {
      var col = currentSort.column;
      var dir = currentSort.dir === 'asc' ? 1 : -1;
      rows.sort(function (a, b) {
        var va = getSortValue(a, col);
        var vb = getSortValue(b, col);
        if (col === 'placement') return (va - vb) * dir;
        return (va < vb ? -1 : va > vb ? 1 : 0) * dir;
      });
      tbody.classList.add('sorting');
      setTimeout(function () {
        rows.forEach(function (row) { tbody.appendChild(row); });
        tbody.classList.remove('sorting');
        updateHeaders();
      }, 180);
    }

    headers.forEach(function (th) {
      th.addEventListener('click', function () {
        var col = th.getAttribute('data-sort');
        if (col === currentSort.column) {
          currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
        } else {
          currentSort.column = col;
          currentSort.dir = 'desc';
        }
        sortRows();
      });
    });

    updateHeaders();
  }

  // --- Results: filter by game + type (All / Online / Offline), smooth show/hide ---
  var RESULTS_ROW_EXIT_MS = 280;

  function initResultsFilters() {
    var gameFiltersWrap = document.querySelector('.results-section .results-filters:not(.results-filters-type)');
    var typeFiltersWrap = document.querySelector('.results-filters-type');
    var table = document.querySelector('.results-section .results-table');
    if (!table) return;
    var tbody = table.querySelector('tbody');
    if (!tbody) return;

    var state = { game: 'all', type: 'all' };

    function applyFilters() {
      var rows = tbody.querySelectorAll('tr[data-game]');
      var toShow = [];
      var toHide = [];

      rows.forEach(function (row) {
        var game = row.getAttribute('data-game');
        var type = row.getAttribute('data-type') || '';
        var matchGame = state.game === 'all' || game === state.game;
        var matchType = state.type === 'all' || type === state.type;
        var show = matchGame && matchType;
        if (show) {
          toShow.push(row);
        } else {
          toHide.push(row);
        }
      });

      toHide.forEach(function (row) {
        row.classList.add('results-row-exit');
      });

      setTimeout(function () {
        toHide.forEach(function (row) {
          row.classList.remove('results-row-exit');
          row.classList.add('is-hidden');
        });
        toShow.forEach(function (row) {
          row.classList.remove('is-hidden');
          row.classList.add('results-row-enter');
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              row.classList.remove('results-row-enter');
            });
          });
        });
      }, RESULTS_ROW_EXIT_MS);
    }

    if (gameFiltersWrap) {
      gameFiltersWrap.querySelectorAll('.results-filter:not(.results-filter-type)').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var filter = btn.getAttribute('data-filter');
          if (btn.classList.contains('active')) return;
          state.game = filter;
          gameFiltersWrap.querySelectorAll('.results-filter:not(.results-filter-type)').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          applyFilters();
        });
      });
    }

    if (typeFiltersWrap) {
      typeFiltersWrap.querySelectorAll('.results-filter-type').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var filter = btn.getAttribute('data-filter');
          if (btn.classList.contains('active')) return;
          state.type = filter;
          typeFiltersWrap.querySelectorAll('.results-filter-type').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          applyFilters();
        });
      });
    }
  }

  // --- Init ---
  function init() {
    initMenu();
    initLogoScroll();
    setActiveNav();
    renderEventCards();
    initVideoModal();
    initRosterFilters();
    initPlayerMore();
    initContactForm();
    initResultsTableSort();
    initResultsFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
