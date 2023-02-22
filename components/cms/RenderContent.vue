<template>
  <div v-editable="content || ''">
    <component
      v-for="(component, index) in components"
      v-editable="content[index] ? content[index] : ''"
      :is="component.componentName"
      :key="index"
      v-bind="component.props"
    />

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { extractComponents } from '@vue-storefront/storyblok'
import Hero from '../cms/Hero.vue'
import Heading from '../cms/Heading.vue'
import Page from '../cms/Page.vue'
import CallToAction from '../cms/CallToAction.vue'
import Banner from '../cms/Banner.vue'
import ProductSlider from '../cms/ProductSlider.vue'

interface RenderContent {
  componentName: string
  props?: {}
}

export default Vue.extend({
  name: 'Page',
  props: {
    content: {
      type: Array,
    },
  },
  computed: {
    components(): RenderContent[] {
      return extractComponents(this.content)
    },
  },
  components: {
    Page,
    Hero,
    Heading,
    ProductSlider,
    CallToAction,
    Banner
  },
})
</script>
