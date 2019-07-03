<template>
  <div>
    <draggable
      v-model="mapLayers"
      class="list-group draggable"
      tag="ul"
      v-bind="dragOptions"
      handle=".handle"
      @start="drag = true"
      @end="drag = false"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">
        <li
          v-for="mapLayer in mapLayers"
          :key="mapLayer.id"
          class="layerBorder list-group-item d-flex align-items-center "
          :style="{ borderColor: mapLayer.color + '!important' }"
        >
          <img class="item-prepend handle" src="@assets/images/handle.svg" />
          <span class="flex-grow-1 item-title" draggable="false">
            {{ mapLayer.name }}
          </span>
          <eye-icon
            v-if="mapLayer.show"
            class="item-append ml-auto"
            @click="toggleShow(mapLayer)"
          />
          <eye-off-icon
            v-else
            class="item-append ml-auto"
            @click="toggleShow(mapLayer)"
          />
        </li>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { EyeIcon, EyeOffIcon } from 'vue-feather-icons'
import { mapGetters, mapMutations } from 'vuex'
const _ = require('lodash')

export default {
  components: {
    draggable,
    EyeIcon,
    EyeOffIcon,
  },
  data() {
    return {
      drag: false,
      mapLayers: null,
    }
  },
  computed: {
    ...mapGetters({
      layers: 'map/mapLayers',
    }),
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
      }
    },
  },
  watch: {
    mapLayers: {
      handler() {
        this.setMapLayers(this.mapLayers)
      },
      deep: true,
    },
  },
  mounted() {
    this.mapLayers = _.cloneDeep(this.layers)
  },

  methods: {
    ...mapMutations({
      setMapLayers: 'map/SET_MAP_LAYERS',
    }),
    sort() {
      this.list = this.list.sort((a, b) => a.order - b.order)
    },
    toggleShow(mapLayer) {
      mapLayer.show = !mapLayer.show
    },
  },
}
</script>

<style scoped>
.flipListMove {
  transition: transform 0.5s;
}
.noMove {
  transition: transform 0s;
}
/* stylelint-disable */
.handle {
  cursor: move;
}
.item-title {
  cursor: pointer;
}
.item-append {
  cursor: pointer;
}

.layerBorder {
  border-left: 3px solid !important;
}
/* stylelint-enable */
</style>
