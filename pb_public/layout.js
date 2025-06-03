(function () {
  const PB_API = 'http://localhost:8090/api/collections/events/records';

  const userIdKey = 'flowseer_uid';
  const sessionIdKey = 'flowseer_sid';
  const flowKey = 'flowseer_flow';

  const userId = localStorage.getItem(userIdKey) || (() => {
    const id = 'uid-' + Math.random().toString(36).substring(2, 12);
    localStorage.setItem(userIdKey, id);
    return id;
  })();

  const sessionId = sessionStorage.getItem(sessionIdKey) || (() => {
    const id = 'sid-' + Date.now();
    sessionStorage.setItem(sessionIdKey, id);
    sessionStorage.setItem(flowKey, JSON.stringify([]));
    return id;
  })();

  const now = () => new Date().toISOString();

  function appendToFlow(path) {
    const flow = JSON.parse(sessionStorage.getItem(flowKey) || '[]');
    if (flow[flow.length - 1] !== path) {
      flow.push(path);
      sessionStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }

  const recordEvent = (event_type, page, metadata = {}, includeFlowPath = false) => {
    const data = {
      user_id: userId,
      session_id: sessionId,
      event_type,
      page,
      timestamp: now(),
      metadata
    };

    if (includeFlowPath) {
      const flow = JSON.parse(sessionStorage.getItem(flowKey) || '[]');
      data.flow_path = flow.join(' → ');
    }

    fetch(PB_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(err => console.warn('Flowseer track failed:', err));
  };

  // Initial pageview
  const page = window.location.pathname;
  recordEvent('pageview', page);
  appendToFlow(page);

  // Route changes
  let lastPath = page;
  const trackRouteChange = () => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      recordEvent('pageview', currentPath);
      appendToFlow(currentPath);
    }
  };

  const _push = history.pushState;
  history.pushState = function () {
    _push.apply(this, arguments);
    setTimeout(trackRouteChange, 100);
  };

  const _replace = history.replaceState;
  history.replaceState = function () {
    _replace.apply(this, arguments);
    setTimeout(trackRouteChange, 100);
  };

  window.addEventListener('popstate', trackRouteChange);

  // Click tracking
  document.addEventListener('click', function (e) {
    const target = e.target.closest('button, a, [data-track]');
    if (!target) return;

    const label = target.innerText || target.getAttribute('aria-label') || target.id || 'unknown';
    recordEvent('click', window.location.pathname, { label });
  });

  // Session duration & flow
  const startTime = Date.now();

  window.addEventListener('beforeunload', function () {
    const duration = Math.round((Date.now() - startTime) / 1000);
    const flow = JSON.parse(sessionStorage.getItem(flowKey) || '[]');

    recordEvent('session_end', window.location.pathname, {
      duration_seconds: duration,
      flow: flow.join(' → ')
    }, true); // include flow_path
  });
})();