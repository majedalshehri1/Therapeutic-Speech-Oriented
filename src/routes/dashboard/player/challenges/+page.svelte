<script>
  import { SearchIcon } from "svelte-feather-icons";
 
  const challenges = [
    {
      id: 1,
      title: 'العب وجرب وحدد مستواك!',
      level: 'تحديد المستوى',
      description: 'استمتع باكتشاف قدراتك الأولية 🎮 وحدد مستواك بكل حماس! لنبدأ الرحلة معاً في تطوير مهاراتك الصوتية 🚀',
      image: 'https://static.vecteezy.com/system/resources/previews/015/942/307/original/2d-game-art-natural-landscape-for-games-mobile-applications-and-computers-game-background-illustration-free-vector.jpg',
      points: 0,
      status: 'متاح للجميع'
    },
    {
      id: 2,
      title: 'مرحلة الغابة',
      level: 'المستوى الأول',
      description: 'المرحلة الأولى من رحلة التطور! 🎮 تحتوي على تمارين أساسية لتقوية مهارات النطق. كل خطوة تقربك من هدفك 🎯',
      image: 'https://img.freepik.com/premium-vector/panorama-evening-landscape-with-green-bushes-trees-against-background-mountains-blue-sky-summer-vector-image_531666-38.jpg',
      points: 50,
      status: 'متاح عند اجتياز تحديد المستوى'
    },
    {
      id: 3,
      title: 'مرحلة الصحراء',
      level: 'المستوى الأول',
      description: 'تحديات متقدمة في المستوى الأول 🎮 تساعدك على تطوير مهاراتك بشكل أسرع! كل تحدٍ يمنحك فرصة للتحسن 🎯❤️',
      image: 'https://t3.ftcdn.net/jpg/01/14/47/12/360_F_114471205_0O1mMyKE100dWY4kqoDKBNYJDto53kkt.jpg',
      points: 100,
      status: 'يتطلب 50 نقطة للوصول'
    },
    {
      id: 4,
      title: 'مرحلة القصر',
      level: 'المستوى الثاني',
      description: 'مرحلة متقدمة مليئة بالتحديات 🎮 صممت خصيصاً لتعزيز مهاراتك المكتسبة وتطويرها لمستويات أعلى! 🎯❤️',
      image: 'https://i.pinimg.com/736x/74/cf/26/74cf263f3b7b2f01713ee4dd11ec216a.jpg',
      points: 150,
      status: 'يتطلب 100 نقطة للوصول'
    }
  ];
 
  let searchQuery = '';
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
      <p class="text-gray-500 text-sm mt-1">استكشف جميع المراحل والتحديات</p>
    </div>
 
    <!-- Challenges Grid -->
    <div class="space-y-4">
      {#each filteredChallenges as challenge}
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
          <div class="flex flex-col lg:flex-row">
            <!-- Image Section -->
            <div class="w-full lg:w-[400px] h-[220px] relative flex-shrink-0">
              <img 
                src={challenge.image} 
                alt={challenge.title}
                class="w-full h-full object-cover"
              />
              <span class="absolute top-4 right-4 py-1 px-3 bg-white/90 rounded-full text-sm text-primaryColor font-medium">
                {challenge.level}
              </span>
            </div>

            <!-- Content Section -->
            <div class="flex-1 p-6">
              <div class="space-y-4">
                <h3 class="text-xl font-bold text-gray-800">{challenge.title}</h3>
                <p class="text-gray-600 text-sm leading-relaxed">{challenge.description}</p>
                
                <div class="flex flex-wrap items-center gap-3">
                  {#if challenge.points > 0}
                    <span class="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-sm font-medium">
                      {challenge.points} نقطة
                    </span>
                  {/if}
                  <span class="text-sm text-gray-500">
                    {challenge.status}
                  </span>
                </div>
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