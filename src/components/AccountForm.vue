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

const formRef = ref();
const form = ref({
  label: '',
  type: null,
  login: '',
  password: ''
});

const rules = {
  label: [],
  type: [{ required: true, message: 'Выберите тип', trigger: 'change' }],
  login: [{ required: true, message: 'Поле обязательно', trigger: 'blur' }],
  password: [{ required: true, message: 'Поле обязательно', trigger: 'blur' }]
};

const validateField = (field: string) => {
  formRef.value?.validateField(field, (errors) => {
    if (!errors) validateAndSave();
  });
};

const validateAndSave = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      accountStore.addAccount({ ...form.value });
      console.log('Аккаунт сохранен:', form.value);
    }
  });
};

const addAccount = () => {
  accountStore.addAccount({
    labels: label.value.split(';').map(l => l.trim()).filter(l => l),
    type: type.value as string,
    login: login.value,
    password: type.value === 'LDAP' ? null : password.value 
  });

  label.value = '';
  type.value = null;
  login.value = '';
  password.value = '';
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