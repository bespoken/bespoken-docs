<template>
  <main class="home" aria-labelledby="main-title">
    <header class="hero">
      <img src="../../../assets/images/LlamaMay2023.png" style="height: 30vh">
      <h1 v-if="data.heroText !== null" id="main-title">{{ data.heroText || $title || 'Hello' }}</h1>
    </header>

    <div class="features" v-if="data.features && data.features.length">
      <div class="feature" v-for="(feature, index) in data.features" :key="index">
        <a
          :href="feature.link"
          class="nav-link external"
          :target="isExternal(feature.link)? '_blank' :null "
          :rel="'noopener noreferrer'"
        >
          <h2 class="whitespace-nowrap">{{ feature.title }}</h2>
          <p>
            {{ feature.details }}
            <OutboundLink v-if="isExternal(feature.link)"/>
          </p>
        </a>
      </div>
    </div>

    <Content class="theme-default-content custom"/>

    <div class="footer" v-if="data.footer">{{ getAtualYear(data.footer) }}</div>
  </main>
</template>

<script>
import NavLink from "@theme/components/NavLink.vue";
import { isMailto, isTel, isExternal } from "../util";
export default {
  components: { NavLink },

  computed: {
    data() {
      return this.$page.frontmatter;
    },

    actionLink() {
      return {
        link: this.data.actionLink,
        text: this.data.actionText
      };
    }
  },
  methods: {
    isMailto,
    isTel,
    isExternal,
    getAtualYear: footer => {
      const year = new Date();
      const newFooter = footer.replace("year", year.getFullYear());
      return newFooter;
    }
  }
};
</script>

<style lang="stylus">
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.home {
  flex: 1;
  padding: $navbarHeight 2rem 0;
  margin: 0 20px;
  display: block;

  .hero {
    text-align: center;

    img {
      max-width: 400px;
      max-height: 400px;
      display: block;
      margin: 3rem auto 1.5rem;
    }

    h1 {
      font-size: 3rem;
      font-family: khand;
    }

    h1, .description, .action {
      margin: 1.8rem auto;
    }

    .description {
      max-width: 35rem;
      font-size: 1.6rem;
      line-height: 1.3;
      color: lighten($textColor, 40%);
    }

    .action-button {
      display: inline-block;
      font-size: 1.2rem;
      color: #fff;
      background-color: $accentColor;
      padding: 0.8rem 1.6rem;
      border-radius: 4px;
      transition: background-color 0.1s ease;
      box-sizing: border-box;
      border-bottom: 1px solid darken($accentColor, 10%);

      &:hover {
        background-color: lighten($accentColor, 10%);
      }
    }
  }

  .features {
    border-top: 1px solid $borderColor;
    padding: 1.2rem 0;
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    justify-content: center; // Center the items horizontally
    max-width: calc(3 * 280px + 3 * 1.5rem); // Ensure the grid does not exceed 3 columns in width
    margin: 0 auto; // Center the grid container itself
  }

  .feature {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background: #fff;

    h2 {
      font-size: 1.2rem;
      font-weight: 500;
      border-bottom: none;
      padding-bottom: 0;
      color: lighten($textColor, 10%);
      transition: color 0.3s ease;

      &:hover {
        color: #42b983; // Vue's default green color
      }
    }

    p {
      color: lighten($textColor, 25%);
      font-size: 14px;
      font-weight: 400;
    }
  }
}

.footer {
  height: 60px; // Fixed height for the footer
  padding: 1rem;
  border-top: 1px solid $borderColor;
  text-align: center;
  color: lighten($textColor, 25%);
  background: #fff; // Ensure it has a background color
  flex-shrink: 0; // Prevent it from shrinking
  margin-top: auto; // Push the footer to the bottom
}

@media (max-width: $MQMobile) {
  .home {
    margin: 0;

    .features {
      padding: 1.2rem;
      grid-template-columns: 1fr;
    }

    .feature {
      margin-bottom: 20px;
      padding: 0 2.5rem;
    }
  }
}

@media (max-width: $MQMobileNarrow) {
  .home {
    padding-left: 1.5rem;
    padding-right: 1.5rem;

    .hero {
      img {
        max-height: 210px;
        margin: 2rem auto 1.2rem;
      }

      h1 {
        font-size: 2rem;
      }

      h1, .description, .action {
        margin: 1.2rem auto;
      }

      .description {
        font-size: 1.2rem;
      }

      .action-button {
        font-size: 1rem;
        padding: 0.6rem 1.2rem;
      }
    }

    .features {
      padding: 1rem;
    }

    .feature {
      h2 {
        font-size: 1.25rem;
      }
    }
  }
}

</style>
