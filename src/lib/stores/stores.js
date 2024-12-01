import { writable } from "svelte/store";
import { createLocalStorage, persist } from "@macfja/svelte-persistent-store";
// comment login ....
export const isLoggedIn = persist(writable(false), createLocalStorage(), 'isLoggedIn');

// comment sidebar ....
export const isSidebarOpen = persist(writable(false), createLocalStorage(), 'isSidebarOpen');

export const user = persist(writable({
  firstName: '',
  lastName: '',
  avatar: '',
  type: '', 
  username: '', 
  email: '', 
  phone: '', 
  id: ''
}), createLocalStorage(), 'user')


export const isLoading = writable(false);