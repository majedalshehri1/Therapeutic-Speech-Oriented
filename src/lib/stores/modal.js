import { writable } from 'svelte/store';

const createModalStore = () => {
  const { subscribe, set, update } = writable({
    isLoginOpen: false,
    isRegistrationOpen: false
  });

  return {
    subscribe,
    openLogin: () => update(s => ({ ...s, isLoginOpen: true, isRegistrationOpen: false })),
    openRegistration: () => update(s => ({ ...s, isLoginOpen: false, isRegistrationOpen: true })),
    closeAll: () => set({ isLoginOpen: false, isRegistrationOpen: false })
  };
};

export const modal = createModalStore();