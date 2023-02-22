<template>
  <div id="home">

    <div>
      <div v-if="loading">Loading content...</div>
      <div v-else-if="error.search">Something is wrong!</div>
      <div v-else-if="content">
        <RenderContent :content="[content]"/>
      </div>
    </div>



    <LazyHydrate when-visible>
      <div class="similar-products">
        <SfHeading :title="$t('Match with it')" :level="2" />
        <nuxt-link :to="localePath('/c/women')" class="smartphone-only">
          {{ $t("See all") }}
        </nuxt-link>
      </div>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <SfCarousel
        class="carousel"
        :settings="{ peek: 16, breakpoints: { 1023: { peek: 0, perView: 2 } } }"
      >
        <template #prev="{ go }">
          <SfArrow
            :aria-label="$t('prev')"
            class="sf-arrow--left sf-arrow--long"
            @click="go('prev')"
          />
        </template>
        <template #next="{ go }">
          <SfArrow
            :aria-label="$t('next')"
            class="sf-arrow--right sf-arrow--long"
            @click="go('next')"
          />
        </template>
        <SfCarouselItem
          class="carousel__item"
          v-for="(product, i) in products"
          :key="i"
        >
          <ProductCard
            class="carousel__item__product"
            :product="product"
            :nuxt-img-config="{
              format: 'webp',
              fit: 'fill',
            }"
          />
        </SfCarouselItem>
      </SfCarousel>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <SfCallToAction
        :title="$t('Subscribe to Newsletters')"
        :button-text="$t('Subscribe')"
        :description="
          $t(
            'Be aware of upcoming sales and events. Receive gifts and special offers!'
          )
        "
        :image="'/homepage/newsletter.webp' | addBasePathFilter"
        class="call-to-action"
      >
        <template #button>
          <SfButton
            class="sf-call-to-action__button"
            data-testid="cta-button"
            @click="handleNewsletterClick"
          >
            {{ $t("Subscribe") }}
          </SfButton>
        </template>
      </SfCallToAction>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <NewsletterModal @email-submitted="onSubscribe" />
    </LazyHydrate>
  </div>
</template>


<script>
import {
  SfHero,
  SfBanner,
  SfCallToAction,
  SfCarousel,
  SfProductCard,
  SfBannerGrid,
  SfHeading,
  SfArrow,
  SfButton,
} from "@storefront-ui/vue";
import RenderContent from "../components/cms/RenderContent.vue";
import LazyHydrate from "vue-lazy-hydration";
import {
  computed,
  watch,
  defineComponent,
  useContext,
  useMeta,
  onMounted,
} from "@nuxtjs/composition-api";
import { onSSR } from "@vue-storefront/core";
import {
  useFacet,
  useCurrency,
  facetGetters,
  useLocale,
  productPriceTransform,
} from "@vsf-enterprise/commercetools";
import NewsletterModal from "~/components/NewsletterModal.vue";
import { useUiState } from "~/composables";
import ProductCard from "~/components/ProductCard";
import { useContent, storyblokBridge } from "@vue-storefront/storyblok";

export default {
  setup() {
    const {
      app: { i18n },
    } = useContext();
    const { toggleNewsletterModal } = useUiState();
    const { availableLocales, defaultLocale, selectedLocale, changeLocale: changeLocaleComposable } = useLocale();
    const { result, search } = useFacet("home");
    const story = computed(() => content.value);
    console.log(story, "story");
    const { currency } = useCurrency();
    const products = computed(() => facetGetters.getProducts(result.value));
    onMounted(() => {
      storyblokBridge(story.value);
    });
    const fetchProducts = async () => {
      await search({
        filters: {},
        page: 1,
        itemsPerPage: 12,
        sort: "latest",
        phrase: "",
        customQuery: { productProjections: "getFacetProducts" },
      });
    };

    watch(currency, async () => {
      await fetchProducts();
    });

    const searchCMS = useContent("unique-id").search;
    const { content, loading, error } = useContent("unique-id");
    console.log(content, 'CONTENT?', selectedLocale)
    onSSR(async () => {
      await fetchProducts();
      await searchCMS({ url: "home-page", locale: selectedLocale.value });
    });

    watch(selectedLocale, async () => {
      await searchCMS({ url: "home-page", locale: selectedLocale.value });
    });
    const handleNewsletterClick = () => {
      toggleNewsletterModal();
    };

    const onSubscribe = (emailAddress) => {
      console.log(`Email ${emailAddress} was added to newsletter.`);
      toggleNewsletterModal();
    };

    useMeta({
      title: i18n.t("Vue Storefront and commercetools"),
      meta: [
        {
          hid: "og:title",
          property: "og:title",
          content: i18n.t("Vue Storefront and commercetools Demo"),
        },
        {
          hid: "description",
          name: "description",
          content: i18n.t(
            "Demo of Vue Storefront, Lightning-Fast Frontend for commercetools"
          ),
        },
        {
          hid: "og:description",
          name: "og:description",
          content: i18n.t(
            "Demo of Vue Storefront, Lightning-Fast Frontend for commercetools"
          ),
        },
        {
          hid: "og:image",
          property: "og:image",
          content:
            "https://res.cloudinary.com/dcqchkrzw/image/upload/v1650360290/homepage/commercetools_pwh3rt.png",
        },
        {
          hid: "og:url",
          property: "og:url",
          content: "https://demo-ct.vuestorefront.io/",
        },
        { hid: "og:type", property: "og:type", content: "website" },
        { hid: "twitter:card", property: "twitter:card", content: "summary" },
      ],
    });

    return {
      products,
      handleNewsletterClick,
      onSubscribe,
      productPriceTransform,
      content,
      loading,
      error,
    };
  },
  head: {},
  components: {
    ProductCard,
    LazyHydrate,
    NewsletterModal,
    SfArrow,
    SfBanner,
    SfBannerGrid,
    SfButton,
    SfCallToAction,
    SfCarousel,
    SfHeading,
    SfHero,
    SfProductCard,
    RenderContent,
  },
};
</script>

<style lang="scss">
.carousel__item__product {
  .sf-product-card__title {
    margin: var(--spacer-base) 0 var(--spacer-xs) 0;
  }

  .sf-product-card__add-button {
    margin-bottom: var(--spacer-xl);
  }
}
</style>

<style lang="scss" scoped>
#home {
  box-sizing: border-box;
  padding: 0 var(--spacer-sm);
  @include for-desktop {
    max-width: 1240px;
    padding: 0;
    margin: 0 auto;
  }
}

.hero {
  ::v-deep .sf-banner__title {
    width: 60%;
    text-transform: none;
    font: var(--font-weight--semibold) var(--h2-font-size) / 1.2
      var(--font-family--secondary);
    padding-top: var(--spacer-sm);
  }
  ::v-deep .sf-banner__subtitle {
    font: var(--font-weight--normal) var(--h6-font-size) / 1.4
      var(--font-family--secondary);
    color: var(--c-gray);
  }
  @include for-desktop {
    margin: var(--spacer-xl) auto var(--spacer-2xl);
    min-height: 586px;
  }
  @include for-mobile {
    margin: var(--spacer-xl) auto var(--spacer-lg);
    min-height: 230px;
    --banner-background-position: 30%;
    ::v-deep .sf-banner__subtitle,
    ::v-deep .sf-banner__title {
      width: 60%;
      text-align: left;
      white-space: normal;
    }
    ::v-deep .sf-banner__wrapper {
      padding: var(--spacer-xl) var(--spacer-sm) 0;
    }
  }
}

.banner-grid {
  --banner-container-width: 50%;
  margin: var(--spacer-xl) 0;
  ::v-deep .sf-link:hover {
    color: var(--c-white);
  }
  @include for-desktop {
    margin: var(--spacer-2xl) 0;
    ::v-deep .sf-link {
      --button-width: auto;
      text-decoration: none;
    }
  }
}

.banner {
  &__tshirt {
    background-position: left;
  }
  &-central {
    @include for-desktop {
      --banner-container-flex: 0 0 70%;
    }
  }
}

.similar-products {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacer-2xs);
  --heading-padding: 0;
  border-bottom: 1px var(--c-light) solid;
  @include for-desktop {
    border-bottom: 0;
    justify-content: center;
    padding-bottom: 0;
  }
}

.call-to-action {
  background-position: right;
  margin: var(--spacer-xs) 0;
  @include for-desktop {
    margin: var(--spacer-xl) 0 var(--spacer-2xl) 0;
  }
}

.carousel {
  margin: 0 calc(0 - var(--spacer-sm)) 0 0;
  @include for-desktop {
    margin: 0;
  }
  &__item {
    margin: 1.375rem 0 2.5rem 0;
    @include for-desktop {
      margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
    }
    &__product {
      display: flex;
      justify-content: center;
      --product-card-add-button-transform: translate3d(0, 30%, 0);
      ::v-deep .sf-product-card {
        &__title {
          margin: var(--spacer-base) 0 var(--spacer-xs) 0;
        }
        &__add-button {
          margin-bottom: var(--spacer-xl);
        }
      }
    }
  }
  ::v-deep .sf-arrow--long .sf-arrow--right {
    --arrow-icon-transform: rotate(180deg);
    -webkit-transform-origin: center;
    transform-origin: center;
  }
}
</style>
