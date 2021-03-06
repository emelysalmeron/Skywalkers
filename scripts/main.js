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
      this.$serviceSection = document.querySelector(".service-section");
      // On the blog page
      this.$blogArticles = document.querySelector(".blog-articles");
      // On the services page
      this.$services = document.querySelector(".services");

      this.$servicesHome = document.querySelector(".services--home");
    },
    async registerListeners() {
      if (!!this.$blogArticles) {
        const articles = await this.fetchBlogArticles();

        this.renderBlog(articles);
      } else if (!!this.$blogSection) {
        const articles = await this.fetchBlogArticles();

        const html = this.renderBlogArticles(articles);
        this.$blogSection.innerHTML = html;
      } else if (!!this.$services) {
        const data = await this.fetchPlanets();
        const { bodies } = data;
        const services = await this.fetchServices();
        this.fetchServiceList(bodies, services);
      }

      if (this.$servicesHome) {
        const data = await this.fetchPlanets();
        const { bodies } = data;
        const services = await this.fetchServices();
        this.fetchServiceList(bodies, services, true);
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
    async fetchPlanets() {
      const apiUrl = "https://api.le-systeme-solaire.net/rest/bodies";
      try {
        const response = await fetch(apiUrl);
        const json = await response.json();
        return json;
      } catch (err) {
        return { message: err.message };
      }
    },
    async fetchServices() {
      try {
        const res = await fetch("data/services.json");
        const json = await res.json();
        return json;
      } catch (err) {
        return { message: err.message };
      }
    },
    renderBlog(articles) {
      let output = "";
      output += this.renderBlogArticles(articles);
      output += "<h2>Check out the rest of our articles</h2>";
      output += '<ul class="blog-list">';
      const articlesLinks = articles
        .map((art) => {
          return `
        <li class="blog-list-item">
        <a class="blog-link" href="${art.url} target="_blank" rel="noopener noreferrer" title="${art.title}">${art.title}</a>
        </li>`;
        })
        .join("");
      output += `${articlesLinks}</ul>`;
      this.$blogArticles.innerHTML = output;
    },
    renderBlogArticles(articles) {
      let articlesHTML = "<div class='blog-articles'>";
      for (let i = 0; i < 2; i++) {
        const { title, url, imageUrl, newsSite, summary, publishedAt } =
          articles[i];
        articlesHTML += `
          <article class="blog-article">
          
            <img class="blog-img" src="${imageUrl}" alt="${title}" />
          
            <h2>${title}</h2>
            <div class="blog-content">
              ${summary}
            </div>
          </article>
        `;
      }
      articlesHTML += "</div>";
      return articlesHTML;
    },
    async fetchServiceList(data, services, home = false) {
      let output = '<ul class="service-list">';
      const html = await services
        .map((service) => {
          let planetList = data.filter((i) => i.aroundPlanet !== null);
          let randomDestination =
            planetList[Math.round(Math.random() * planetList.length)]
              .aroundPlanet.planet;
          if (!randomDestination) {
            randomDestination =
              data[Math.round(Math.random() * data.length)].aroundPlanet.planet;
          }
          return `
          <li class="service-list-item">
            <div class="service-card">
              <img src="${service.imageUrl}" 
                alt="${service.title}" 
                class="service-img" />
              <h3>${service.title}</h3>
              <div class="content">
                <em>Fly away to... <strong>${randomDestination.toUpperCase()}</strong></em>
                <p>${service.description}</p>
                <h4>Starting from <strong>???${service.price}</strong></h4>
              
              </div>
            </div>
          </li>`;
        })
        .join("");
      output += `${html}</ul>`;
      if (!home) {
        this.$services.innerHTML = output;
      } else {
        this.$servicesHome.innerHTML = output;
      }
    },
  };
  app.initialize();
})();
