<template>
  <a v-if="href" :href="href" target="_blank" v-bind="$attrs">
    <component :is="getIcon(icon)" v-if="to" class="custom-class"></component>
    <slot />
  </a>
  <router-link v-else :to="routerLinkTo" v-bind="$attrs">
    <component
      :is="getIcon(to.icon)"
      v-if="to"
      class="custom-class"
    ></component>
    <slot />
  </router-link>
</template>

<script>
import { HomeIcon, CpuIcon } from 'vue-feather-icons'

export default {
  components: {
    HomeIcon,
    CpuIcon,
  },
  inheritAttrs: false,
  props: {
    href: {
      type: String,
      default: '',
    },
    allowInsecure: {
      type: Boolean,
      default: false,
    },
    to: {
      type: Object,
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    routerLinkTo({ name, params }) {
      return {
        name,
        params,
        ...(this.to || {}),
      }
    },
  },
  created() {
    this.validateProps()
  },
  methods: {
    // Perform more complex prop validations than is possible
    // inside individual validator functions for each prop.
    validateProps() {
      if (process.env.NODE_ENV === 'production') return

      if (this.href) {
        // Check for non-external URL in href.
        if (!/^\w+:/.test(this.href)) {
          return console.warn(
            `Invalid <base-icon-link> href: ${
              this.href
            }.\nIf you're trying to link to a local URL, provide at least a name or to`
          )
        }
        // Check for insecure URL in href.
        if (!this.allowInsecure && !/^(https|mailto|tel):/.test(this.href)) {
          return console.warn(
            `Insecure <base-icon-link> href: ${
              this.href
            }.\nWhen linking to external sites, always prefer https URLs. If this site does not offer SSL, explicitly add the allow-insecure attribute on <base-icon-link>.`
          )
        }
      } else {
        // Check for insufficient props.
        if (!this.name && !this.to) {
          return console.warn(
            `Invalid <base-icon-link> props:\n\n${JSON.stringify(
              this.$props,
              null,
              2
            )}\n\nEither a \`name\` or \`to\` is required for internal links, or an \`href\` for external links.`
          )
        }
      }
    },
    getIcon(icon) {
      return icon ? icon + 'Icon' : 'HomeIcon'
    },
  },
}
</script>
