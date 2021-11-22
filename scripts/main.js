(() => {
  const app = {
    initialize() {
      this.cacheElements();
      this.registerListeners();
    },
    cacheElements() {
      // menu toggler & navbar
      this.$menuToggler = document.querySelector(".menuToggler");
      this.$navbar = document.querySelector(".navbar");

      this.$contactForm = document.querySelector(".contact-form");
      // On the main page
      this.$blogSection = document.querySelector(".blog-section");
      // On the blog page
      this.$blogArticles = document.querySelector(".blog-articles");
    },
    async registerListeners() {
      if (!!this.$blogArticles) {
        const articles = await this.fetchBlogArticles();

        this.renderBlog(articles);
      } else if (!!this.$blogSection) {
        const articles = await this.fetchBlogArticles();

        const html = this.renderBlogArticles(articles);
        this.$blogSection.innerHTML = html;
      }

      // Toggle hamburgermenu
      this.$menuToggler.addEventListener("click", () => {
        this.$navbar.classList.toggle("visible");
        this.$menuToggler.classList.toggle("visible");
      });
    },
    async fetchBlogArticles() {
      const apiUrl = "https://api.spaceflightnewsapi.net/v3/articles";

      try {
        const response = await fetch(apiUrl);
        const json = await response.json();
        return json;
      } catch (err) {
        return { message: err.message };
      }
    },
    renderBlog(articles) {
      let output = '<ul class="blog-list">';
      const articlesLinks = articles
        .map((art) => {
          console.table(art);
          return `
          <li class="blog-list-item">
              <a class="blog-link" href="${art.url} target="_blank" rel="noopener noreferrer" title="${art.title}">${art.title}</a>
          </li>`;
        })
        .join("");
      output += `${articlesLinks}</ul>`;
      output += this.renderBlogArticles(articles);
      this.$blogArticles.innerHTML = output;
    },
    renderBlogArticles(articles) {
      let articlesHTML = "<div class='blog-articles'";
      for (let i = 0; i < 2; i++) {
        const { title, url, imageUrl, newsSite, summary, publishedAt } =
          articles[i];
        articlesHTML += `
          <article class="blog-article">
            <h2>${title}</h2>
            <img class="blog-img" src="${imageUrl}" alt="${title}" />
            <div class="blog-content">
              ${summary}
            </div>
          </article>
        `;
      }
      articlesHTML += "</div>";
      return articlesHTML;
    },
  };
  app.initialize();
})();
