---
to: "src/router/views/<%= h.inflection.dasherize(name) %>.vue"
---
<%
  const fileName = h.inflection.dasherize(name)
  const importName = h.inflection.camelize(fileName.replace(/-/g, '_'))
%>
<template>
  <layout>
    <%= h.inflection.titleize(name.replace(/-/g, '_')) %>
  </layout>
</template>

<script>
import Layout from '@layouts/main'

export default {
  page: {
    title: '<%= importName %>',
    meta: [{ name: 'description', content: '<%= importName %>' }],
  },
  components: { Layout }
}
</script>

<%if (useStyles) { %>
<style lang="scss" module>
@import '@design';
</style>
<% } %>
