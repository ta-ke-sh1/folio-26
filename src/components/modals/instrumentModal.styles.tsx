export function InstrumentModalStyles() {
  return <style>{`
    .instrument-window {
      --instrument-space: clamp(10px, 1.8vw, 16px);
      --instrument-titlebar-height: clamp(34px, 4vw, 38px);
      --instrument-title-size: clamp(9px, 0.7vw, 11px);
      --instrument-body-size: clamp(12px, 0.9vw, 13px);
      --instrument-orange: #ff7700;
      --instrument-panel: #0d0d0c;
      --instrument-raised: #171613;
      --instrument-line: #3b3832;
      --instrument-text: #d8d3c9;
      --instrument-text-strong: #e8e2d8;
      --instrument-muted: #89847b;
      --instrument-muted-dim: #68635b;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      width: 100%;
      max-height: min(calc(100dvh - 120px), 760px);
      color: var(--instrument-text);
      border: 1px solid #514b42;
      border-radius: 6px;
      background:
        linear-gradient(rgba(255, 119, 0, 0.022) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 119, 0, 0.022) 1px, transparent 1px),
        var(--instrument-panel);
      background-size: 24px 24px;
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.78), 0 0 24px rgba(255, 119, 0, 0.12), inset 0 1px #625b50;
    }

    .instrument-window-frame { isolation: isolate; }
    .instrument-window--active {
      border-color: rgba(255, 119, 0, 0.82);
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.82), 0 0 30px rgba(255, 119, 0, 0.2), inset 0 1px #7d654e;
    }
    .instrument-window--footer {
      height: min(calc(100dvh - 120px), 620px);
      min-height: 0;
      max-height: min(calc(100dvh - 120px), 620px);
    }
    .instrument-window--footer .instrument-window__body {
      flex: 1 1 0;
      min-height: 0;
      overflow: hidden !important;
      padding: 0 !important;
    }
    .instrument-window__titlebar {
      flex: 0 0 auto;
      min-height: var(--instrument-titlebar-height);
      padding-inline: var(--instrument-space) !important;
      border-bottom: 1px solid var(--instrument-line);
      background: linear-gradient(180deg, #1b1a17, #11110f);
    }
    .instrument-window__titlebar:active { background: #1d1b17; }
    .instrument-window__signal {
      width: 7px;
      height: 7px;
      flex: 0 0 auto;
      border-radius: 50%;
      background: var(--instrument-orange);
      box-shadow: 0 0 9px var(--instrument-orange);
    }
    .instrument-window__title {
      color: var(--instrument-text-strong);
      font-family: monospace;
      font-size: var(--instrument-title-size);
      font-weight: 700;
      letter-spacing: 1px;
    }
    .instrument-window__ruler {
      flex: 0 0 8px;
      border-bottom: 1px solid #292722;
      background: repeating-linear-gradient(90deg, #6e685e 0 1px, transparent 1px 12px), #0a0a09;
      opacity: 0.72;
    }
    .instrument-window__body {
      min-height: 0;
      overflow: auto;
      scrollbar-color: var(--instrument-orange) #111;
      scrollbar-width: thin;
    }
    .instrument-window__body::-webkit-scrollbar { width: 5px; }
    .instrument-window__body::-webkit-scrollbar-track { background: #111; }
    .instrument-window__body::-webkit-scrollbar-thumb { background: var(--instrument-orange); }
    .instrument-window__close {
      color: var(--instrument-muted);
      border: 1px solid transparent;
      border-radius: 2px;
    }
    .instrument-window__close:hover {
      color: #090909;
      border-color: var(--instrument-orange);
      background: var(--instrument-orange);
    }
    .instrument-window__telemetry {
      color: var(--instrument-muted-dim);
      font-family: monospace;
      font-size: 9px;
      letter-spacing: 0.6px;
    }
    .instrument-form { font-family: monospace; font-size: var(--instrument-body-size); }
    .instrument-form__beacon {
      position: relative;
      overflow: hidden;
      border: 1px solid #393630;
      border-left: 3px solid var(--instrument-orange);
      border-radius: 3px;
      background: linear-gradient(90deg, rgba(255, 119, 0, 0.07), transparent 42%), #070706;
    }
    .instrument-form__beacon::after {
      position: absolute;
      top: 0;
      right: 0;
      width: 28%;
      height: 100%;
      content: "";
      background: repeating-linear-gradient(90deg, transparent 0 8px, rgba(255, 119, 0, 0.08) 8px 9px);
      pointer-events: none;
    }
    .instrument-form__beacon pre {
      position: relative;
      z-index: 1;
      max-width: 100%;
      overflow: hidden;
      color: var(--instrument-orange);
      font-family: monospace;
      letter-spacing: 0;
      white-space: pre-wrap;
    }
    .instrument-form__intro {
      color: var(--instrument-muted);
      font-family: monospace;
      font-size: clamp(9px, 0.7vw, 10px);
      letter-spacing: 0.3px;
    }
    .instrument-form .mantine-InputWrapper-label {
      color: var(--instrument-muted);
      font-family: monospace;
      font-size: clamp(8px, 0.65vw, 9px);
      letter-spacing: 1px;
    }
    .instrument-form .mantine-Input-input {
      min-height: clamp(32px, 3vw, 36px);
      color: var(--instrument-text);
      border-color: #3a3731;
      border-radius: 3px;
      background: rgba(8, 8, 7, 0.86);
      font-family: monospace;
      transition: border-color 150ms ease, box-shadow 150ms ease;
    }
    .instrument-form .mantine-Input-input:focus,
    .instrument-form .mantine-Input-input:focus-within {
      border-color: var(--instrument-orange);
      box-shadow: 0 0 0 1px rgba(255, 119, 0, 0.18), 0 0 14px rgba(255, 119, 0, 0.08);
    }
    .instrument-form__message-shell {
      border: 1px solid #3a3731;
      border-radius: 3px;
      background: rgba(8, 8, 7, 0.9);
      box-shadow: inset 0 1px #211f1b;
    }
    .instrument-form__protocol {
      color: var(--instrument-orange);
      font-family: monospace;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .instrument-form__submit {
      height: 38px;
      color: #090909;
      border: 1px solid #ff9b45;
      border-radius: 3px;
      background: var(--instrument-orange);
      font-family: monospace;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.7px;
      box-shadow: 0 0 18px rgba(255, 119, 0, 0.18);
    }
    .instrument-form__submit:hover {
      background: #ff9133;
      box-shadow: 0 0 24px rgba(255, 119, 0, 0.32);
    }
    .instrument-form__success {
      min-height: clamp(180px, 28vh, 260px);
      border: 1px solid #393630;
      background: radial-gradient(circle at center, rgba(255, 119, 0, 0.08), transparent 54%), #090908;
    }
    .instrument-contact {
      border: 1px solid #33302b;
      border-radius: 3px;
      background: rgba(15, 15, 13, 0.92);
      transition: border-color 150ms ease, background 150ms ease;
    }
    .instrument-contact:hover {
      border-color: rgba(255, 119, 0, 0.62);
      background: rgba(255, 119, 0, 0.045);
    }
    .instrument-contact__icon {
      border: 1px solid #393630;
      border-radius: 3px;
      background: #0a0a09;
      box-shadow: inset 0 0 8px rgba(255, 119, 0, 0.05);
    }
    .instrument-contact__handle {
      color: var(--instrument-muted-dim);
      font-family: monospace;
      font-size: 10px;
    }
    .instrument-detail__heading { padding-bottom: 12px; border-bottom: 1px solid #34312c; }
    .instrument-detail__description {
      margin: 0;
      color: var(--instrument-muted);
      font-size: var(--instrument-body-size);
      line-height: 1.6;
    }
    .instrument-window--archive {
      --instrument-panel: #11100e;
      overflow: hidden;
      border-color: #342f27;
      border-radius: 3px;
      background: #11100e;
      box-shadow: 0 28px 80px rgba(0, 0, 0, 0.65), 0 0 0 5px rgba(22, 20, 17, 0.72);
    }
    .instrument-window--archive.instrument-window--active {
      border-color: #51483a;
      box-shadow: 0 28px 80px rgba(0, 0, 0, 0.65), 0 0 0 5px rgba(22, 20, 17, 0.72);
    }
    .instrument-window--archive .instrument-window__body {
      overflow: auto;
      scrollbar-color: #81725d #171512;
    }
    .instrument-window--archive .instrument-window__titlebar {
      min-height: 34px;
      border-bottom-color: #39342d;
      background: #171512;
    }
    .instrument-window--archive .instrument-window__titlebar:active { background: #1c1915; }
    .instrument-window--archive .instrument-window__ruler {
      flex-basis: 5px;
      border-bottom-color: #28241e;
      background: repeating-linear-gradient(90deg, #5d5447 0 1px, transparent 1px 14px), #12110f;
    }
    .editorial-file {
      width: 100%;
      padding: 0;
      background:
        radial-gradient(ellipse at 50% 0%, rgba(107, 85, 57, 0.15), transparent 58%),
        #171512;
    }
    .editorial-file__spread {
      position: relative;
      display: grid;
      grid-template-columns: 0.92fr 1.08fr;
      min-height: clamp(350px, 43vw, 440px);
      overflow: visible;
      background: #d8d0c0;
      box-shadow: 0 16px 38px rgba(0, 0, 0, 0.38);
    }
    .editorial-file__poster {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      padding: clamp(50px, 6vw, 64px) clamp(14px, 2vw, 22px) 13px;
      color: #24211c;
      border: 1px solid rgba(52, 45, 34, 0.34);
      background:
        linear-gradient(90deg, rgba(94, 79, 55, 0.055), transparent 9%, transparent 94%, rgba(94, 79, 55, 0.07)),
        #e9e3d6;
      box-shadow: inset -8px 0 14px -14px rgba(0, 0, 0, 0.8);
    }
    .editorial-file__clip {
      position: absolute;
      z-index: 4;
      top: 8px;
      left: 12%;
      display: block;
      width: 38px;
      height: 52px;
      overflow: visible;
      color: #716b60;
      filter: drop-shadow(1px 2px 1px rgba(0, 0, 0, 0.32));
      pointer-events: none;
    }
    .editorial-file__eyebrow,
    .editorial-file__poster-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-family: "DM Mono", monospace;
      font-size: clamp(6px, 0.75vw, 8px);
      font-weight: 700;
      letter-spacing: 0.55px;
      line-height: 1.4;
      text-transform: uppercase;
    }
    .editorial-file__eyebrow { padding-bottom: 11px; border-bottom: 1px solid #aaa18f; }
    .editorial-file__poster-title { padding: clamp(18px, 3.2vw, 34px) 0 14px; }
    .editorial-file__overline {
      display: block;
      margin-bottom: 6px;
      color: #857b68;
      font-family: "DM Mono", monospace;
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 1.15px;
      text-transform: uppercase;
    }
    .editorial-file__poster-title h2 {
      margin: 0;
      font-family: "Plus Jakarta Sans", "Arial", sans-serif;
      font-size: clamp(26px, 4.2vw, 48px);
      font-weight: 800;
      letter-spacing: -0.075em;
      line-height: 0.94;
      text-transform: uppercase;
    }
    .editorial-file__poster-title p {
      margin: 10px 0 0;
      color: #686052;
      font-family: "DM Mono", monospace;
      font-size: clamp(8px, 1vw, 10px);
      line-height: 1.5;
    }
    .editorial-file__index {
      display: grid;
      gap: 0;
      margin-block: auto 15px;
      border-top: 1px solid #bcb4a5;
    }
    .editorial-file__index-row {
      display: grid;
      grid-template-columns: 24px minmax(0, 1fr);
      gap: 7px;
      align-items: start;
      padding: 8px 0;
      border-bottom: 1px solid #c9c1b2;
      font-family: "Plus Jakarta Sans", "Arial", sans-serif;
      font-size: clamp(8px, 0.9vw, 10px);
      font-weight: 600;
      line-height: 1.35;
    }
    .editorial-file__index-number {
      color: #8e816a;
      font-family: "DM Mono", monospace;
      font-size: 8px;
      letter-spacing: 0.3px;
    }
    .editorial-file__poster-footer {
      padding-top: 9px;
      border-top: 1px solid #aaa18f;
      color: #716957;
      font-size: 6px;
    }
    .editorial-file__rings {
      position: absolute;
      z-index: 3;
      top: 0;
      bottom: 0;
      left: 46%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      width: 8%;
      pointer-events: none;
    }
    .editorial-file__rings span {
      position: relative;
      display: block;
      width: 28px;
      height: 13px;
      margin-left: -10px;
      border: 2px solid #282722;
      border-right-color: #777365;
      border-radius: 50%;
      background: transparent;
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.36);
      transform: rotate(4deg);
    }
    .editorial-file__photograph {
      position: relative;
      z-index: 2;
      min-width: 0;
      min-height: 0;
      margin: 0;
      overflow: hidden;
      background: #30271e;
    }
    .editorial-file__photograph > img {
      display: block;
      width: 100%;
      height: 100%;
      min-height: inherit;
      object-fit: cover;
      object-position: center;
      filter: saturate(0.84) contrast(1.04);
    }
    .editorial-file--pets .editorial-file__photograph > img { object-position: 48% center; }
    .editorial-file--awards .editorial-file__photograph > img { object-position: center 42%; }
    .editorial-file__photograph::after {
      position: absolute;
      inset: 38% 0 0;
      content: "";
      background: linear-gradient(180deg, transparent, rgba(20, 15, 10, 0.34));
      pointer-events: none;
    }
    .editorial-file__note {
      position: absolute;
      z-index: 4;
      right: clamp(12px, 2vw, 22px);
      bottom: clamp(15px, 3vw, 28px);
      display: flex;
      flex-direction: column;
      width: min(54%, 208px);
      min-height: 178px;
      padding: clamp(13px, 1.8vw, 19px);
      color: #f0e2c9;
      border: 1px solid rgba(247, 210, 166, 0.35);
      background:
        linear-gradient(135deg, rgba(139, 75, 38, 0.92), rgba(103, 52, 29, 0.88)),
        #86502e;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.28);
      transform: rotate(3deg);
      backdrop-filter: blur(3px);
    }
    .editorial-file__note-kicker {
      font-family: "DM Mono", monospace;
      font-size: 7px;
      font-weight: 700;
      letter-spacing: 0.7px;
      line-height: 1.5;
    }
    .editorial-file__note-rule {
      position: relative;
      width: 100%;
      height: 1px;
      margin: 18px 0 12px;
      background: rgba(244, 222, 190, 0.6);
    }
    .editorial-file__note-rule::after {
      position: absolute;
      top: -3px;
      left: 50%;
      width: 7px;
      height: 7px;
      content: "";
      border: 1px solid rgba(244, 222, 190, 0.8);
      border-radius: 50%;
      background: #88502f;
      transform: translateX(-50%);
    }
    .editorial-file__note p {
      margin: 0;
      font-family: "Plus Jakarta Sans", "Arial", sans-serif;
      font-size: clamp(8px, 0.9vw, 10px);
      line-height: 1.55;
    }
    .editorial-file__note-signature {
      margin-top: auto;
      padding-top: 12px;
      color: rgba(240, 226, 201, 0.75);
      font-family: "DM Mono", monospace;
      font-size: 6px;
      letter-spacing: 0.6px;
      text-transform: uppercase;
    }
    .editorial-file__photo-count {
      position: absolute;
      z-index: 1;
      right: 13px;
      top: 13px;
      color: rgba(255, 247, 232, 0.82);
      font-family: "DM Mono", monospace;
      font-size: 7px;
      letter-spacing: 0.8px;
      text-shadow: 0 1px 5px rgba(0, 0, 0, 0.8);
    }
    .instrument-detail__features {
      border: 1px solid #34312c;
      border-left: 3px solid var(--instrument-orange);
      border-radius: 3px;
      background: rgba(9, 9, 8, 0.84);
    }
    .instrument-detail__datum { border: 1px solid #34312c; border-radius: 2px; background: #080807; }
    .instrument-detail__footer { padding-top: 8px; border-top: 1px solid #292722; }

    :root[data-mantine-color-scheme="light"] .instrument-window {
      --instrument-panel: #fff;
      --instrument-raised: #f3f3f1;
      --instrument-line: #d5d5d1;
      --instrument-text: var(--folio-text);
      --instrument-text-strong: var(--folio-text);
      --instrument-muted: var(--folio-muted);
      --instrument-muted-dim: var(--folio-muted);
      color: var(--folio-text);
      border-color: #c8c8c3;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18), 0 0 22px rgba(255, 119, 0, 0.1);
    }
    :root[data-mantine-color-scheme="light"] .instrument-window--archive {
      --instrument-panel: #11100e;
      color: #d8d3c9;
      border-color: #342f27;
      background: #11100e;
      box-shadow: 0 28px 80px rgba(0, 0, 0, 0.65), 0 0 0 5px rgba(22, 20, 17, 0.72);
    }
    :root[data-mantine-color-scheme="light"] .instrument-window--archive .instrument-window__titlebar {
      background: #171512;
    }
    :root[data-mantine-color-scheme="light"] .instrument-window__titlebar { background: linear-gradient(180deg, #fff, #ececea); }
    :root[data-mantine-color-scheme="light"] .instrument-window__titlebar:active,
    :root[data-mantine-color-scheme="light"] .instrument-window__ruler,
    :root[data-mantine-color-scheme="light"] .instrument-form__beacon,
    :root[data-mantine-color-scheme="light"] .instrument-form__success,
    :root[data-mantine-color-scheme="light"] .instrument-contact,
    :root[data-mantine-color-scheme="light"] .instrument-contact__icon,
    :root[data-mantine-color-scheme="light"] .instrument-detail__features,
    :root[data-mantine-color-scheme="light"] .instrument-detail__datum { background-color: #f5f5f3; }
    :root[data-mantine-color-scheme="light"] .instrument-window__title,
    :root[data-mantine-color-scheme="light"] .instrument-form .mantine-Input-input { color: var(--folio-text); }
    :root[data-mantine-color-scheme="light"] .instrument-window__close,
    :root[data-mantine-color-scheme="light"] .instrument-window__telemetry,
    :root[data-mantine-color-scheme="light"] .instrument-form__intro,
    :root[data-mantine-color-scheme="light"] .instrument-form .mantine-InputWrapper-label,
    :root[data-mantine-color-scheme="light"] .instrument-contact__handle,
    :root[data-mantine-color-scheme="light"] .instrument-detail__description { color: var(--folio-muted); }
    :root[data-mantine-color-scheme="light"] .instrument-form .mantine-Input-input,
    :root[data-mantine-color-scheme="light"] .instrument-form__message-shell {
      border-color: var(--folio-card-border);
      background: #fff;
    }

    @media (max-width: 48em) {
      .instrument-window-frame { width: calc(100% - 24px) !important; }
      .instrument-window { max-height: calc(100dvh - 96px); }
      .instrument-window--footer { height: calc(100dvh - 96px); max-height: calc(100dvh - 96px); }
      .instrument-form__beacon pre { font-size: 8px !important; }
      .editorial-file__spread { grid-template-columns: minmax(0, 1fr); }
      .editorial-file__poster { min-height: 330px; padding: 56px 20px 13px; }
      .editorial-file__poster-title { padding: 22px 0 12px; }
      .editorial-file__poster-title h2 { font-size: clamp(34px, 10vw, 48px); }
      .editorial-file__index-row { font-size: 10px; }
      .editorial-file__rings { display: none; }
      .editorial-file__photograph { min-height: 330px; }
      .editorial-file__note { width: min(58%, 220px); min-height: 156px; }
      .editorial-file__note p { font-size: 9px; }
    }
    @media (max-height: 42.5em) {
      .instrument-window { max-height: calc(100dvh - 80px); }
    }
  `}</style>;
}