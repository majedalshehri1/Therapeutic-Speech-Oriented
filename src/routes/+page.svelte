<script>
// @ts-nocheck

  import { onMount } from 'svelte';
  import Header from "$lib/components/Header.svelte";
  import MainContent from "$lib/components/MainContent.svelte";
  import LoginModal from "$lib/components/forms/LoginModal.svelte";
  import RegistrationModal from "$lib/components/forms/RegistrationModal.svelte";
  import { modal } from '$lib/stores/modal';
  
  // Press the start button
  function handleStartClick() {
    modal.openLogin();
  }
</script>


<div class="flex flex-col min-h-screen bg-[#f0f6f96c] transition-colors duration-300">
  <!-- Header-->
  <div class="relative z-50">
    <Header />
  </div>
  
  <!-- Main Content-->
  <div class="flex-grow">
    <MainContent {handleStartClick} />
  </div>

  <!-- Modals -->
  {#if $modal.isLoginOpen}
    <LoginModal isOpen={true} />
  {/if}

  {#if $modal.isRegistrationOpen}
    <RegistrationModal isOpen={true} />
  {/if}

</div>

