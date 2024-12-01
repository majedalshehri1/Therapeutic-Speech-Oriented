<script>
  
  import { onMount, onDestroy } from 'svelte';
  
  export let handleStartClick;

  
  // @ts-ignore
  let container;
  let mouse = { x: 0, y: 0 };
  let isHovering = false;
  
  // @ts-ignore
  let animationFrame;

  // @ts-ignore
  function handleMouseMove(e) {
    if (!isHovering) return;
    
    
    
    // @ts-ignore
    const rect = container.getBoundingClientRect();
    mouse = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    animationFrame = requestAnimationFrame(() => {
      
      // @ts-ignore
      container.style.setProperty('--mouse-x', `${mouse.x}px`);
      
      // @ts-ignore
      container.style.setProperty('--mouse-y', `${mouse.y}px`);
    });
  }

  function handleMouseEnter() {
    isHovering = true;
  }

  function handleMouseLeave() {
    isHovering = false;
  }

  onMount(() => {
    
    // @ts-ignore
    container?.addEventListener('mousemove', handleMouseMove);
    
    // @ts-ignore
    container?.addEventListener('mouseenter', handleMouseEnter);
    
    // @ts-ignore
    container?.addEventListener('mouseleave', handleMouseLeave);
  });

  onDestroy(() => {
    
    // @ts-ignore
    container?.removeEventListener('mousemove', handleMouseMove);
    
    // @ts-ignore
    container?.removeEventListener('mouseenter', handleMouseEnter);
    
    // @ts-ignore
    container?.removeEventListener('mouseleave', handleMouseLeave);
    
    // @ts-ignore
    if (animationFrame) cancelAnimationFrame(animationFrame);
  });
</script>

<section 
  bind:this={container}
  class="flex flex-col items-center justify-center min-h-screen bg-[#beebf641] relative overflow-hidden interactive-container"
>
  <div class="absolute inset-0 pointer-events-none">
    <div class="absolute inset-0 grid-background"></div>
    <div class="absolute inset-0 grid-overlay"></div>
    <div class="absolute inset-0 ripple-container"></div>
  </div>
  
  <div class="relative z-10 text-center space-y-12 max-w-4xl mx-auto px-4">
    <div class="wave-icon">
      {#each Array(9) as _, i}
        <div class="wave-line" style="--delay: {i * 0.1}s"></div>
      {/each}
    </div>

    <div class="space-y-6">
      <div class="space-y-4">
        <h1 class="title-gradient">طَلاقَة</h1>
        <p class="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
          فريق من المبدعين نعمل على تطوير منصة تفاعلية مبتكرة
          <br/>
          تركز على خطة علاج التأتأة.
        </p>
      </div>

      <button 
        class="action-button"
        on:click={handleStartClick}
      >
        ابدأ
        <div class="button-shine"></div>
      </button>
    </div>
  </div>  
</section>
<style >
  /* Container Styles */
  .interactive-container {
    --mouse-x: 50%;
    --mouse-y: 50%;
  }

  /* Grid Background */
  .grid-background {
    background-image: 
      linear-gradient(to right, rgba(30, 185, 210, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(30, 185, 210, 0.1) 1px, transparent 1px);
    background-size: 40px 40px;
    transition: all 0.3s ease;
    mask-image: radial-gradient(
      circle at var(--mouse-x) var(--mouse-y),
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.4) 30%,
      transparent 70%
    );
  }

  /* Grid Overlay */
  .grid-overlay {
    opacity: 0;
    transition: opacity 0.3s ease;
    background: radial-gradient(
      circle 100px at var(--mouse-x) var(--mouse-y),
      rgba(30, 185, 210, 0.1),
      transparent 50%
    );
  }

  .interactive-container:hover .grid-overlay {
    opacity: 1;
  }


  /* Ripple Effect */
  .ripple-container::before {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    border: 2px solid rgba(30, 185, 210, 0.3);
    border-radius: 40px;
    transform: translate(-50%, -50%);
    left: var(--mouse-x);
    top: var(--mouse-y);
    animation: ripple 1s linear infinite;
    opacity: 0;
    pointer-events: none;
  }

  /* Wave Animation */
  .wave-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    height: 60px;
    margin: 0 auto;
  }

  .wave-line {
    width: 3px;
    height: 20px;
    background: linear-gradient(to top, #1EB9D2, rgba(30, 185, 210, 0.3));
    border-radius: 2px;
    animation: waveAnim 1s ease-in-out infinite;
    animation-delay: var(--delay);
  }

  /* Title Styles */
  .title-gradient {
    font-size: 5rem;
    font-weight: bold;
    background: linear-gradient(180deg, #1EB9D2 0%, rgba(30, 185, 210, 0.8) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 4px rgba(30, 185, 210, 0.2));
    transition: all 0.3s ease;
  }

  .title-gradient:hover {
    transform: translateY(-2px);
    filter: drop-shadow(0 4px 8px rgba(30, 185, 210, 0.3));
  }

  /* Action Button */
  .action-button {
    position: relative;
    background: linear-gradient(135deg, #1EB9D2, #0891b2);
    color: white;
    font-size: 1.25rem;
    font-weight: 600;
    padding: 1rem 2.5rem;
    border-radius: 9999px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(30, 185, 210, 0.2);
    overflow: hidden;
  }

  .action-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(30, 185, 210, 0.3);
  }

  .button-shine {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transform: translateX(-100%);
  }

  .action-button:hover .button-shine {
    transform: translateX(100%);
    transition: transform 0.5s ease;
  }

  /* Animations */
  @keyframes waveAnim {
    0%, 100% {
      height: 20px;
      opacity: 0.3;
    }
    50% {
      height: 35px;
      opacity: 0.8;
    }
  }

  @keyframes ripple {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(3);
      opacity: 0;
    }
  }
</style>