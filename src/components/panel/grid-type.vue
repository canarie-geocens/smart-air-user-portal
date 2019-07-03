<template>
  <div class="form-row mt-2">
    <div v-for="(type, index) in typeOptions" :key="index" class="col">
      <a href="#" @click="selectType(type)">
        <figure class="figure" :class="{ active: isActive(type) }">
          <img
            :src="gridTypeImageUrl(type)"
            class="figure-img img-fluid rounded"
            :alt="type"
          />
          <figcaption class="figure-caption text-center">{{ type }}</figcaption>
        </figure>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    gridType: {
      type: String,
      default: 'Square',
    },
  },
  data() {
    return {
      selectedType: 'Square',
      typeOptions: ['Square', 'Hex', 'Point'],
    }
  },
  mounted() {
    if (this.gridType) {
      this.selectedType = this.typeOptions.includes(this.gridType)
        ? this.gridType
        : this.typeOptions[0]
    } else {
      this.selectedType = this.typeOptions[0]
    }
  },
  methods: {
    isActive(type) {
      return this.selectedType === type
    },
    gridTypeImageUrl(type) {
      return require(`@assets/images/${type.toLowerCase()}.png`)
    },
    selectType(type) {
      this.selectedType = type
      this.$emit('update:grid-type', type)
    },
  },
}
</script>

<style lang="scss">
.figure {
  padding: 2px;
  background-color: #fff;
  border: 1px solid #eee;
  &:hover {
    background-color: #f3f3f3;
  }
  &.active {
    border: 1px solid #1786e8;
  }
}

.imageWrapper {
  margin-top: 10px;
}
</style>
