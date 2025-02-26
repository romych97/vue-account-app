import { defineStore } from 'pinia';

export const useAccountStore = defineStore('account', {
  state: () => ({
    accounts: [] as { label: string; type: string; password: string | null }[]
  }),
  actions: {
    addAccount(account: { label: string; type: string; password: string | null }) {
      this.accounts.push(account);
    }
  }
});
