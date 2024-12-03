<script>
  import { SearchIcon } from "svelte-feather-icons";
 
  // Data challenges
  const challenges = [
    {
      id: 1,
      title: 'العب وجرب وحدد مستواك!',
      level: 'تحديد المستوى',
      description: 'استمتع باكتشاف قدراتك الأولية 🎮 وحدد مستواك بكل حماس! لنبدأ الرحلة 🚀',
      playersCount: 4,
    },
    {
      id: 2,
      title: 'مرحلة الغابة',
      level: 'المستوى الأول',
      description: 'ابدأ رحلتك الآن! 🎮 يتكون المستوى الأول من عدة مراحل، قم فيها بتطوير نقاط لاختبار المستوى 😊❤️',
      playersCount: 3,
    },
    {
      id: 3, 
      title: 'مرحلة الصحراء',
      level: 'المستوى الأول',
      description: 'ابدأ التحدي الثاني الآن! 🎮 يحتوي المستوى الأول على مراحل أصعب، اجمع النقاط واكتشف مهاراتك بشكل أسرع! 😊❤️',
      playersCount: 2,
    },
    {
      id: 4,
      title: 'مرحلة القصر',
      level: 'المستوى الثاني', 
      description: 'استعد للإثارة! 🎮 المستوى الثاني مليء بالتحديات المتقدمة، اجمع النقاط وتفوق على نفسك! 😊❤️',
      playersCount: 1,
    }
  ];
 
  let searchQuery = '';
   //filter challenges on search
   $: filteredChallenges = challenges.filter(challenge => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      challenge.title.toLowerCase().includes(searchTerm) ||
      challenge.level.toLowerCase().includes(searchTerm)
    );
  });
</script>

<div class="flex flex-row-reverse">
  <!-- Search Sidebar -->
  <div class="w-72 min-h-[calc(100vh-4rem)] bg-gradient-to-b from-secondaryColor to-white border-l border-gray-100 p-4">
    <div class="relative">
      <input 
        type="search"
        bind:value={searchQuery}
        placeholder="بحث..."
        class="w-full pr-10 pl-4 py-2 bg-white border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor transition-all"
      />
      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <SearchIcon size="18" />
      </span>
    </div>
  </div>
  
  <!-- Main Content -->
  <div class="flex-1 p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">التحديات</h1>
      <p class="text-gray-500 text-sm mt-1">جميع المراحل في المستويات</p>
    </div>
 
    <!-- Challenges Grid -->
    <div class="space-y-4">
      {#each filteredChallenges as challenge}
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
          <div class="flex flex-col lg:flex-row gap-6">
            <div class="flex-1">
              <!-- Challenge Header -->
              <div class="mb-4">
                <span class="inline-block px-3 py-1 bg-primaryColor/10 text-primaryColor text-sm rounded-lg mb-2">
                  {challenge.level}
                </span>
                <h3 class="text-xl font-bold text-gray-800">{challenge.title}</h3>
              </div>
 
              <!-- Challenge Description -->
              <p class="text-gray-600 text-sm leading-relaxed mb-4">
                {challenge.description}
              </p>
 
              <!-- Players Count & Action -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">{challenge.playersCount} لاعبين</span>
                
               
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  @media (max-width: 1024px) {
    .flex {
      flex-direction: column;
    }
    
    .w-72 {
      width: 100%;
      min-height: auto;
      border-left: none;
      border-bottom: 1px solid #e5e7eb;
    }
  }
</style>