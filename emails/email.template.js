export function createWelcomeEmail(name , clientURL){
    const displayName = name ? String(name) : "Friend";
    const url = clientURL || "#";

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Welcome</title>
  <style>
    /* Reset */
    body,html { margin:0; padding:0; width:100%; background:#f6f9ff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
    a { color: inherit; text-decoration: none; }

    /* Container */
    .wrap {
      width:100%; display:flex; align-items:center; justify-content:center; padding:40px 16px;
      box-sizing:border-box;
    }

    .card {
      width:100%; max-width:680px; background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
      border-radius:18px; box-shadow: 0 10px 30px rgba(20,30,60,0.08); overflow:hidden;
      position:relative;
      animation: fadeUp 650ms ease both;
    }

    /* Top accent */
    .hero {
      background: linear-gradient(90deg,#6f8cff 0%, #9be7ff 60%);
      padding:28px 28px 20px;
      color:#fff;
      display:flex;
      gap:18px;
      align-items:center;
    }

    .avatar {
      width:72px; height:72px; border-radius:50%;
      background: rgba(255,255,255,0.18); display:flex; align-items:center; justify-content:center;
      font-weight:700; font-size:26px; color:#fff; box-shadow: 0 6px 18px rgba(30,60,120,0.15);
      transform: translateZ(0);
      animation: pulse 2000ms ease-in-out infinite;
    }

    .title {
      font-size:20px; line-height:1.05; margin:0; font-weight:700;
      text-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .subtitle { margin:4px 0 0; opacity:0.95; font-size:13px; color:rgba(255,255,255,0.95); }

    .content {
      padding:28px; color:#1b2b4a; background: linear-gradient(180deg, rgba(255,255,255,0.35), transparent);
    }

    .greeting { font-size:18px; margin:0 0 8px; font-weight:700; color:#0b2140; }
    .message { margin:0 0 18px; color:#123; line-height:1.5; font-size:14px; }

    .button-wrap { text-align:left; margin-bottom:8px; }
    .btn {
      display:inline-block; padding:12px 18px; border-radius:10px; background: linear-gradient(90deg,#2546f7 0%, #6fb1ff 100%);
      color:#fff; font-weight:700; box-shadow: 0 8px 24px rgba(37,70,247,0.18);
      transition: transform 160ms ease, box-shadow 160ms ease;
      animation: float 2400ms ease-in-out infinite;
    }
    .btn:hover { transform: translateY(-3px); box-shadow: 0 14px 34px rgba(37,70,247,0.22); }

    .note { margin-top:14px; font-size:12px; color:#5b6b88; }

    .footer {
      padding:18px 28px; font-size:12px; color:#6b7a99; text-align:center; background:#fbfdff;
      border-top:1px solid rgba(20,30,60,0.03);
    }

    /* Animated accents (simple & email-friendly) */
    @keyframes fadeUp {
      from { opacity:0; transform: translateY(12px); }
      to { opacity:1; transform: translateY(0); }
    }
    @keyframes pulse {
      0% { transform: scale(1); opacity:1; }
      50% { transform: scale(1.06); opacity:0.92; }
      100% { transform: scale(1); opacity:1; }
    }
    @keyframes float {
      0% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
      100% { transform: translateY(0); }
    }

    /* Responsive */
    @media (max-width:420px){
      .hero { padding:18px; gap:12px; }
      .avatar { width:56px; height:56px; font-size:20px; }
      .content { padding:18px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card" role="article" aria-label="Welcome email">
      <div class="hero">
        <div class="avatar" aria-hidden="true">${String(displayName).charAt(0).toUpperCase()}</div>
        <div>
          <h1 class="title">Welcome, ${escapeHtml(displayName)}!</h1>
          <div class="subtitle">You've successfully joined our messenger</div>
        </div>
      </div>

      <div class="content">
        <p class="greeting">Hello ${escapeHtml(displayName)},</p>
        <p class="message">
          We're thrilled to have you here. Your account is ready — jump back in and start chatting with friends.
          This space is built for real-time conversations, quick sharing, and staying connected.
        </p>

        <div class="button-wrap">
          <a class="btn" href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">Open messenger</a>
        </div>

        <p class="note">Tip: Pin this tab for faster access. If you didn't sign up, please ignore this email or contact support.</p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} Messenger — Built with care. <br/>
        If you need help, reply to this email.
      </div>
    </div>
  </div>
</body>
</html>`;
}

/* Minimal helpers to keep template safe for interpolation */
function escapeHtml(str){
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

function escapeAttr(str){
  return escapeHtml(str).replace(/"/g, '%22');
}