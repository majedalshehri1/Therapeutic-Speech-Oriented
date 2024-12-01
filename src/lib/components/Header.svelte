<script>
// @ts-nocheck

  import { MoonIcon, ActivityIcon } from "svelte-feather-icons";
</script>

<header class="fixed top-5 left-0 right-0 w-1/2 mx-auto bg-white rounded-lg font-[Cairo] shadow-sm z-50">
  <nav class="flex justify-between items-center p-3">
    <div class="text-primaryColor">
      <ActivityIcon size="24"/>
    </div>
    
    <button 
      class="bg-[#F7F8F9] hover:bg-primaryColor text-[#5046E5] hover:text-white rounded-md p-2.5 transition-all duration-300"
    >
      <MoonIcon size="20" strokeWidth="1.5"/>
    </button>
  </nav>
</header>