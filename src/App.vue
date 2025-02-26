
<script setup lang="ts">
  import { ref } from 'vue';
  import { NConfigProvider, NGlobalStyle, darkTheme, lightTheme } from 'naive-ui';
  import AccountForm from '@/components/AccountForm.vue';

  const isDark = ref(false);
</script>

<template>
  <n-config-provider :theme="isDark ? darkTheme : lightTheme">
    <n-global-style />
    <div>
      <h1  :style="{ marginBottom: '25px' }">Учетные записи</h1> 
      <AccountForm />
    </div>
  </n-config-provider>
</template>
