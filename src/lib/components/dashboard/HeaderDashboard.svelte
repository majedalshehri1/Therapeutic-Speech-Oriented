<script>
  // @ts-nocheck
  import { MoonIcon, UserIcon, ChevronDownIcon, ActivityIcon, MenuIcon, LogOutIcon } from "svelte-feather-icons";
  import { isSidebarOpen } from "$lib/stores/stores";
  import { onMount, afterUpdate, beforeUpdate} from "svelte";
  import {user as userData, isLoggedIn} from '$lib/stores/stores'  
  import { get } from "svelte/store";
  import {isLoading} from '$lib/stores/stores'
  import { goto } from '$app/navigation';
  // User data
  let user = {};
  onMount(() => {
    const unsubscribeUser = userData.subscribe(value => {
      user = value;
    })

    return () => {
      unsubscribeUser();
    }   
    isLoading.set(true)
    setTimeout(() => {
    isLoading.set()
  }, 2000)
  
  })

  // Dropdown state
  let isDropdownOpen = false;
  let dropdownRef;
  
  // Toggle sidebar
  function toggleSidebar() {
    isSidebarOpen.update(value => !value);
  }
  
  // Handle logout
  function handleLogout() {
    isDropdownOpen = false;
    userData.set({
  firstName: '',
  lastName: '',
  avatar: '',
  type: '',
  username: '',
  email: '',
  phone: '',
  id: ''
    });
    isLoggedIn.set(false);
    goto('/')
  }
  
  // Close dropdown when clicking outside
  function handleClickOutside(event) {
    if (dropdownRef && !dropdownRef.contains(event.target)) {
      isDropdownOpen = false;
    }
  }
  
  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
  </script>
  
  <header class="bg-white shadow-sm lg:mr-[20%] transition-all">
    <nav class="flex justify-between items-center p-4">
      <div class="flex items-center gap-4">
        <!-- Mobile menu button -->
        <button 
          class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          on:click={toggleSidebar}
        >
          <MenuIcon size="24" class="text-gray-600" />
        </button>
        
        <div class="text-primaryColor">
          <ActivityIcon />
        </div>
      </div>
  
      <div class="flex items-center gap-4">
        <!-- User menu -->
        <div class="relative" bind:this={dropdownRef}>
          <button 
            class="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
            on:click={() => isDropdownOpen = !isDropdownOpen}
          >
            <UserIcon class="text-gray-500 w-5 h-5" />
            <span class="text-gray-700 text-sm font-medium hidden sm:inline">{user.username || 'مستخدم'}</span>
            <ChevronDownIcon 
              class="w-4 h-4 text-gray-500 transition-transform duration-200" 
              style={isDropdownOpen ? 'transform: rotate(180deg)' : ''} 
            />
          </button>
  
          <!-- Logout dropdown -->
          {#if isDropdownOpen}
            <div class="absolute left-0 sm:right-0 mt-2 py-1 bg-white rounded-lg shadow-lg border border-gray-100 min-w-[140px] z-10">
              <button 
                class="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-sm transition-colors text-right"
                on:click={handleLogout}
              >
                <LogOutIcon class="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          {/if}
        </div>
  
        <!-- Theme toggle -->
        <button class="p-2 rounded-lg bg-gray-50 hover:bg-primaryColor text-gray-600 hover:text-white transition-all">
          <MoonIcon size="20" strokeWidth="1.5"/>
        </button>
      </div>
    </nav>
  </header>