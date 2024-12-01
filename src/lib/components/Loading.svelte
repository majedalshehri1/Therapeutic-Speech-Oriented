<!-- LoadingSpinner.svelte -->
<script>
     import {isLoading as isLoadingStore} from '$lib/stores/stores';
     
     let isLoading = $isLoadingStore || false;
  </script>
  
  {#if isLoading}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="relative flex flex-col items-center justify-center">
        <div class="loader-container">
          <div class="loader">
            <div class="loader-inner">
              <div class="loader-line-wrap">
                <div class="loader-line"></div>
              </div>
              <div class="loader-line-wrap">
                <div class="loader-line"></div>
              </div>
              <div class="loader-line-wrap">
                <div class="loader-line"></div>
              </div>
              <div class="loader-line-wrap">
                <div class="loader-line"></div>
              </div>
              <div class="loader-line-wrap">
                <div class="loader-line"></div>
              </div>
            </div>
          </div>
        </div>
        <p class="mt-4 text-white text-lg animate-pulse" style="color: rgba(30, 185, 210, 0.8);">
          Loading...
        </p>
      </div>
    </div>
  {/if}
  
  <style>
    /* Custom animation for loader */
    .loader-container {
      width: 100px;
      height: 100px;
    }
  
    .loader {
      width: 100%;
      height: 100%;
      position: relative;
      transform: rotate(45deg);
    }
  
    .loader-inner {
      width: 100%;
      height: 100%;
      position: relative;
    }
  
    .loader-line-wrap {
      width: 50%;
      height: 50%;
      position: absolute;
      top: 0;
      left: 0;
    }
  
    .loader-line {
      width: 100%;
      height: 4px;
      border-radius: 2px;
      background: rgba(30, 185, 210, 0.8);
      position: absolute;
      top: 0;
      left: 0;
      transform-origin: 100% 100%;
      animation: spin 3s cubic-bezier(0.755, 0.050, 0.855, 0.060) infinite;
    }
  
    .loader-line-wrap:nth-child(1) .loader-line {
      animation-delay: -1s;
      transform: rotate(0deg);
    }
  
    .loader-line-wrap:nth-child(2) .loader-line {
      animation-delay: -0.9s;
      transform: rotate(30deg);
    }
  
    .loader-line-wrap:nth-child(3) .loader-line {
      animation-delay: -0.8s;
      transform: rotate(60deg);
    }
  
    .loader-line-wrap:nth-child(4) .loader-line {
      animation-delay: -0.7s;
      transform: rotate(90deg);
    }
  
    .loader-line-wrap:nth-child(5) .loader-line {
      animation-delay: -0.6s;
      transform: rotate(120deg);
    }
  
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      70% {
        transform: rotate(360deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  </style>