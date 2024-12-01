<script>
  import "../app.css";
  import {Toaster} from "svelte-french-toast"

</script>
<Toaster/>
<div class="min-h-screen font-[Cairo]">
  <main class="relative">
    <slot/>
  </main>
</div>
