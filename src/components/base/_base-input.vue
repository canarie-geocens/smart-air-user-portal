<script>
export default {
  model: {
    event: 'update',
  },
  props: {
    type: {
      type: String,
      default: 'text',
    },
    value: {
      type: [String, Number],
      default: '',
    },
  },
}
</script>

<template>
  <input
    :type="type"
    :value="value"
    @input="$emit('update', $event.target.value)"
    v-on="$listeners"
  />
</template>
