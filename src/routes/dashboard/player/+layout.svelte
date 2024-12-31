<script>
  import HeaderDashboard from '$lib/components/dashboard/HeaderDashboard.svelte';
  import SideBar from '$lib/components/dashboard/SideBar.svelte';
  import { user, isLoggedIn } from "$lib/stores/stores";
  import { onMount } from 'svelte';

</script>
{#if $isLoggedIn}
<div class="min-h-screen bg-gray-50">
  <SideBar />
  <HeaderDashboard/>
  
  <main class="lg:mr-[20%] transition-all">
    <slot />
  </main>
</div>
{:else}
  <!-- show cannot access -->
<div class="min-h-screen w-full flex items-center justify-center">
  <!-- Loading -->
  <div class="text-center">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor mx-auto"></div>
    <p class="mt-4 text-gray-600">جاري التحميل...</p>
  </div>
</div>
{/if}