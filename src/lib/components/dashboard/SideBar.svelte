<script>
  // @ts-nocheck
  // Import required icons
  import { 
    HomeIcon, 
    ClipboardIcon, 
    UsersIcon, 
    SettingsIcon, 
    ChevronLeftIcon, 
    MenuIcon, 
    XIcon 
  } from "svelte-feather-icons";
  
  // Import stores
  import { user } from '$lib/stores/stores'; 
  import { page } from '$app/stores';
  import { isSidebarOpen } from "$lib/stores/stores";
  import { fly } from 'svelte/transition';
  
  // Define navigation links for players
  const playerLinks = [
    { name: 'الصفحة الرئيسية', icon: HomeIcon, url: '/dashboard/player' },
    { name: 'التحديات', icon: ClipboardIcon, url: '/dashboard/player/challenges' },
    { name: 'التقدم', icon: UsersIcon, url: '/dashboard/player/progress' },
    { name: 'الإعدادات', icon: SettingsIcon, url: '/dashboard/player/settings' }
  ];
  
  // Define navigation links for specialists
  const specialistLinks = [
    { name: 'الصفحة الرئيسية', icon: HomeIcon, url: '/dashboard/specialist' },
    { name: 'التحديات', icon: ClipboardIcon, url: '/dashboard/specialist/challenges' },
    { name: 'اللاعبين', icon: UsersIcon, url: '/dashboard/specialist/players' },
    { name: 'الإعدادات', icon: SettingsIcon, url: '/dashboard/specialist/settings' }
  ];
  
  // Reactive statement to determine which links to show based on user type
  $: links = $user.type === 'player' ? playerLinks : specialistLinks;
  
  // Function to close the sidebar
  function closeSidebar() {
    isSidebarOpen.set(false);
  }
  </script>
  
  <!-- Backdrop overlay for mobile - shows when sidebar is open -->
  {#if $isSidebarOpen}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div 
      class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-all"
      on:click={closeSidebar}
      transition:fly={{ duration: 200, opacity: 0.5 }}
    ></div>
  {/if}
  
  <!-- Main Sidebar Container -->
  <aside 
    class="bg-gradient-to-b from-secondaryColor to-white fixed h-screen z-50 transition-all duration-300 
           border-l border-gray-100/50
           lg:w-[20%] lg:right-0 lg:translate-x-0
           w-80 {$isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}"
  >
    <!-- Mobile Close Button -->
    <button 
      class="lg:hidden absolute left-3 top-3 p-2.5 rounded-full bg-white/80 hover:bg-white shadow-sm z-50
             hover:shadow transition-all text-gray-600 hover:text-gray-800"
      on:click={closeSidebar}
    >
      <XIcon size="20" />
    </button>
  
    <!-- Sidebar Content Wrapper -->
    <div class="h-full flex flex-col p-6">
      <!-- User Profile Section -->
      <div class="relative mb-12 flex flex-col items-center">
        <!-- Avatar Container with Animation -->
        <div class="relative group">
          <!-- Glowing Background Effect -->
          <div class="absolute inset-0 bg-gradient-to-r from-primaryColor/20 to-cyan-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
          
          <!-- Animated Border Ring -->
          <div class="relative w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr from-primaryColor via-cyan-400 to-primaryColor animate-border-rotate">
            <!-- Avatar Image Container -->
            <div class="relative w-full h-full rounded-full bg-white p-1">
              <!-- User Avatar -->
              <img 
                src={$user.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5XSsGNXRAhMPD7t9VzCppJ28ec-rA1rcTzaIn0txizwy6o9E-UtVQ14dvi9eJKMSP7lk&usqp=CAU'} 
                alt="User Avatar"
                class="w-full h-full object-cover rounded-full transform transition-all duration-500 group-hover:scale-110" 
              />
            </div>
          </div>
        </div>
  
        <!-- User Information Section -->
        <div class="mt-6 text-center relative">
          <div class="relative inline-block">
            <!-- Username with Gradient -->
            <h2 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
              {$user.firstName + ' ' + $user.lastName  || 'مستخدم'}
            </h2>
            <!-- Verification Badge -->
            <div class="absolute -left-6 top-1/2 -translate-y-1/2">
              <svg class="w-5 h-5 text-primaryColor" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
            </div>
          </div>
          <!-- Welcome Message -->
          <p class="mt-1 text-sm font-medium bg-gradient-to-r from-primaryColor to-cyan-500 text-transparent bg-clip-text">
            أهلاً بك
          </p>
        </div>
      </div>
  
      <!-- Navigation Links Section -->
      <nav class="flex-1 space-y-2 overflow-y-auto pretty-scrollbar p-2">
        {#each links as link}
          <a 
            href={link.url} 
            class="block"
            on:click={() => {
              if (window.innerWidth < 1024) closeSidebar();
            }}
          >
            <!-- Navigation Item -->
            <div class="rounded-xl flex items-center p-5 transition-all my-5 
                      {$page.url.pathname === link.url 
                        ? 'bg-gradient-to-l from-primaryColor to-cyan-500 text-white shadow-md shadow-primaryColor/10 scale-[1.02]' 
                        : 'hover:bg-white/80 text-gray-600 hover:text-primaryColor hover:shadow-sm hover:scale-[1.02]'}">
              <div class="flex items-center justify-between w-full gap-4 px-2">
                <div>
                  <svelte:component this={link.icon} size="20" />
                </div>
                <span class="font-medium text-sm">{link.name}</span>
                <ChevronLeftIcon 
                  size="16" 
                  class="transition-transform {$page.url.pathname === link.url ? '-rotate-90' : ''}"
                />
              </div>
            </div>
          </a>
        {/each}
      </nav>
  
      <!-- Footer Section -->
      <div class="pt-4 mt-auto">
        <div class="p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm border border-white/50">
          <div class="text-xs text-gray-500 text-center">
            طَلاقة &copy; {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  </aside>
  
  