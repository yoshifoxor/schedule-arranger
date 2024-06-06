const { html } = require('hono/html');

function layout(c, title, body) {
  const { user } = c.get('session') ?? {};
  title = title ? `${title} - 予定調整くん` : '予定調整くん';
  return html`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/stylesheets/bundle.css" />
        <style>
          :root{--bs-font-sans-serif:'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Helvetica Neue', 'Lucida Grande', Helvetica, 'BIZ UDPGothic', Arial, Meiryo, sans-serif;}
          body{font-family: var(--bs-font-sans-serif);}
          h1, h2, h3, h4, h5, h6{font-family: var(--bs-font-sans-serif);}
        </style>
      </head>
      <body>
        <nav class="navbar navbar-expand-md navbar-light bg-light">
          <div class="container-fluid">
            <a class="navbar-brand" href="/">予定調整くん</a>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarResponsive"
              aria-controls="navbarResponsive"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div id="navbarResponsive" class="collapse navbar-collapse">
              <ul class="navbar-nav ms-auto">
                ${user
                  ? html`
                      <li class="nav-item">
                        <a class="nav-link" href="/logout"
                          >${user.login} をログアウト</a
                        >
                      </li>
                    `
                  : html`
                      <li class="nav-item">
                        <a class="nav-link" href="/login">ログイン</a>
                      </li>
                    `}
              </ul>
            </div>
          </div>
        </nav>
        <div class="container">${body}</div>
        <script src="/javascripts/main.bundle.js"></script>
      </body>
    </html>
  `;
}

module.exports = layout;
