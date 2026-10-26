// Web demo layer for Orbit Glide. Sits on top of the unmodified game build:
// hides iPhone-only features (shop, purchases, Game Center, sharing), and invites players to get the full game.
(() => {
  const STORE = 'https://apps.apple.com/app/id6820881837';
  const css = `
    [data-action^="store"], [data-action="restore"], [data-action="privacy-options"],
    [data-action="leaderboard"], [data-action="share"], [data-action="daily-share"],
    .mock-ad-sub { display: none !important; }
    .og-pill { position: fixed; left: 50%; top: calc(22px + env(safe-area-inset-top)); transform: translateX(-50%);
      z-index: 9998; padding: 9px 14px; border-radius: 999px; font: 700 12px/1 -apple-system, system-ui, sans-serif;
      color: #0b1030; background: linear-gradient(180deg, #fff, #d6e6ff); text-decoration: none;
      box-shadow: 0 8px 24px -6px rgba(120,180,255,.6); white-space: nowrap; }
    .og-modal { position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center; padding: 16px;
      background: rgba(5,8,25,.72); backdrop-filter: blur(6px); font-family: -apple-system, system-ui, sans-serif; }
    .og-card { max-width: 340px; width: 100%; text-align: center; color: #e8eef7; padding: 26px 22px; border-radius: 26px;
      border: 1px solid rgba(255,255,255,.16); background: linear-gradient(160deg, rgba(40,55,140,.95), rgba(14,20,64,.97)); }
    .og-card h2 { margin: 0 0 8px; font-size: 22px; }
    .og-card p { margin: 0 0 16px; color: #c8d4e6; font-size: 15px; line-height: 1.45; }
    .og-card ul { text-align: left; margin: 0 0 18px; padding-left: 20px; color: #c8d4e6; font-size: 14px; line-height: 1.6; }
    .og-get { display: block; padding: 14px; border-radius: 999px; color: #0b1030; font-weight: 800; text-decoration: none;
      background: linear-gradient(180deg, #fff, #d6e6ff); }
    .og-more { margin-top: 12px; background: none; border: 0; color: #9fdcff; font-size: 15px; cursor: pointer; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Purchases are iPhone-only: never show the developer purchase simulator.
  window.confirm = () => false;

  const pill = document.createElement('a');
  pill.className = 'og-pill';
  pill.href = STORE;
  pill.target = '_blank';
  pill.rel = 'noopener';
  pill.textContent = 'Full game free on iPhone';
  document.body.appendChild(pill);

  // Hide the pill during a run so it never covers the playfield.
  let runs = 0, wasOver = false, modalOpen = false;
  const showModal = () => {
    modalOpen = true;
    const m = document.createElement('div');
    m.className = 'og-modal';
    m.innerHTML = `<div class="og-card"><h2>Enjoying Orbit Glide?</h2>
      <p>You're playing the free web demo. The full game is free on iPhone and plays offline.</p>
      <ul><li>200 levels, including Upside Down mode</li><li>A new Daily Challenge every day</li>
      <li>100 comets to collect</li><li>Game Center leaderboards</li></ul>
      <a class="og-get" href="${STORE}" target="_blank" rel="noopener">Download on the App Store</a>
      <button class="og-more">Keep playing the demo</button></div>`;
    m.querySelector('.og-more').onclick = () => { m.remove(); modalOpen = false; };
    document.body.appendChild(m);
  };
  const screen = () => [...document.querySelectorAll('.screen.show')].map((e) => e.id);
  setInterval(() => {
    const s = screen();
    const playing = s.includes('hud') && !s.includes('results');
    const over = s.includes('results');
    pill.style.display = playing ? 'none' : '';
    if (over && !wasOver) {
      runs++;
      if ((runs === 2 || runs % 5 === 0) && !modalOpen) setTimeout(showModal, 900);
    }
    wasOver = over;
  }, 250);
})();
