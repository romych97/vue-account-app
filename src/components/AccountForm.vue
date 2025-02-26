<script setup lang="ts">
  import { ref } from 'vue';
  import { useAccountStore } from '@/stores/accountStore';
  import { NButton, NInput, NSelect, NForm, NFormItem, NTable, NTag, NIcon } from 'naive-ui';
  import { Trash } from '@vicons/ionicons5';

  const accountStore = useAccountStore();
  const label = ref('');
  const type = ref<string | null>(null);
  const login = ref('');
  const password = ref('');
  const accountTypes = [
    { label: 'LDAP', value: 'LDAP' },
    { label: 'Локальная', value: 'Standard' }
  ];

  const formRef = ref(null);
  const form = ref({
    label: '', 
    labels: [] as string[],
    type: '',
    login: '',
    password: ''
  });

  const rules = {
    label: [],
    type: [{ required: true, message: 'Выберите тип', trigger: 'change' }],
    login: [{ required: true, message: 'Поле обязательно', trigger: ['input', 'blur'] }],
    password: [{ required: true, message: 'Поле обязательно', trigger: ['input', 'blur'] }]
  };

  const validateField = (field: string) => {
    if (!formRef.value) return;
    formRef.value.validate();
  };

  const validateAndSave = () => {
    formRef.value?.validate((valid: boolean) => {
      if (valid) {
        const accountData = {
          ...form.value,
          labels: form.value.label.split(';').map(l => l.trim()).filter(l => l)
        };
        accountStore.addAccount(accountData);
      }
    });
  };

  const addAccount = () => {
    formRef.value?.validate((valid: boolean) => {
      if (valid) return;

      const accountData = {
        label: form.value.label,
        labels: form.value.label.split(';').map(l => l.trim()).filter(l => l),
        type: form.value.type,
        login: form.value.login,
        password: form.value.type === 'LDAP' ? null : form.value.password
      };

      accountStore.addAccount(accountData);

      form.value = { label: '', labels: [], type: '', login: '', password: '' };
    });
  };

  const removeAccount = (index: number) => {
    accountStore.accounts.splice(index, 1);
  };
</script>

<template>
  <n-form ref="formRef" :model="form" :rules="rules" inline>
    <n-form-item label="Метки" path="label" :style="{ width: '25%' }">
      <n-input v-model:value="form.label" placeholder="Введите метки" maxlength="50" @blur="validateField('label')" />
    </n-form-item>

    <n-form-item label="Тип записи" path="type" :style="{ width: '25%' }">
      <n-select v-model:value="form.type" :options="accountTypes" placeholder="Выберите тип" @update:value="validateAndSave" />
    </n-form-item>

    <n-form-item label="Логин" path="login" :style="{ width: '25%' }">
      <n-input v-model:value="form.login" placeholder="Введите логин" @blur="validateField('login')" />
    </n-form-item>

    <n-form-item label="Пароль" :style="{ visibility: form.type === 'LDAP' ? 'hidden' : 'visible', width: '25%' }">
      <n-input
              v-model:value="form.password"
              type="password"
              placeholder="Введите пароль" />
    </n-form-item>
    
    <n-form-item>
      <n-button type="primary" @click="addAccount">Добавить</n-button>
    </n-form-item>
  </n-form>

  <n-table striped>
    <thead>
      <tr>
        <th>Метки</th>
        <th>Тип</th>
        <th>Логин</th>
        <th>Пароль</th>
        <th style="width: 10%;">Действие</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(account, index) in accountStore.accounts" :key="index">
        <td>
          <n-tag v-for="(label, i) in account.labels" :key="i" style="margin-right: 5px;">{{ label }}</n-tag>
        </td>
        <td>{{ account.type }}</td>
        <td>{{ account.login }}</td>
        <td>
          <span v-if="account.type !== 'LDAP'">●●●●●</span>
          <span v-else>-</span>
        </td>
        <td>
          <n-button size="small" type="error" @click="removeAccount(index)">
            <n-icon><Trash /></n-icon>
          </n-button>
        </td>
      </tr>
    </tbody>
  </n-table>
</template>