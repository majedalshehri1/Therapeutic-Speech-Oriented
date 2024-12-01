<!-- specialist/+layout.svelte -->
<script>
  import HeaderDashboard from '$lib/components/dashboard/HeaderDashboard.svelte';
  import SideBar from '$lib/components/dashboard/SideBar.svelte';
  import { user,isLoggedIn } from "$lib/stores/stores";
  import { onMount } from 'svelte';

</script>
{#if $isLoggedIn}
<div class="min-h-screen bg-gray-50">
  <SideBar />
  <HeaderDashboard />
  
  <main class="lg:mr-[20%] transition-all">
    <slot />
  </main>
</div>
{:else}
  <!-- show cannot access -->
   <div class="min-h-screen">
    <h1 class="text-3xl text-center mt-10">لا يمكنك الوصول</h1>
   </div>
{/if}
