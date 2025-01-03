<script>
// @ts-nocheck
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase/config';
  import { doc, getDoc, updateDoc } from 'firebase/firestore';
  import { user } from '$lib/stores/stores';


  const staticLevels = [
  {
    id: 0,
    name: 'تحديد المستوى',
    stage: 'تحديد المستوى',
    totalPoints: 0  
  },
  {
    id: 1,
    name: 'المستوى الأول',
    stage: 'مرحلة الغابة',
    totalPoints: 50  
  },
  {
    id: 2,
    name: 'المستوى الأول',
    stage: 'مرحلة الصحراء',
    totalPoints: 50
  },
  {
    id: 3,
    name: 'المستوى الثاني',
    stage: 'مرحلة القصر',
    totalPoints: 100 
  },
  {
    id:4,
    name: 'المستوى الثالث',
    stage: 'مرحلة الكهف',
    totalPoints: 200  
  }
];

let currentLevel;
let playerData = null;
let levelsCompleted = [];
let isLoading = true; 

function transformFirestoreData(data) {
  if (!data || !data.levelsCompleted) {
    return [];
  }

  const levelGroups = {};
  
  staticLevels.forEach((level, index) => {
    const isStageCompleted = data.levelsCompleted[index] === true;
    const accuracyPercentage = data.percentagePerLevel?.[index] || "0";
    
    if (!levelGroups[level.name]) {
      levelGroups[level.name] = {
        id: level.id,
        name: level.name,
        totalPoints: 0,
        completedStages: 0,
        status: 'locked',
        challenges: []
      };
    }

    const group = levelGroups[level.name];
    
    
    group.challenges.push({
      name: level.stage,
      progress: isStageCompleted ? 100 : 0,
      status: isStageCompleted ? 'completed' : 'locked',
      index: index,
      totalPoints: level.totalPoints,
      accuracy: accuracyPercentage
    });

    group.totalPoints = level.totalPoints;
    if (isStageCompleted) {
      group.completedStages++;
    }
  });

  return Object.values(levelGroups)
    .map(level => {
      const progress = Math.floor((level.completedStages / level.challenges.length) * 100);
      
      let status = 'locked';
      if (progress === 100) {
        status = 'completed';
      } else if (progress > 0) {
        status = 'in-progress';
      }

      return {
        ...level,
        progress,
        status,
        score: `${progress}/${level.totalPoints}`,
      };
    })
    .sort((a, b) => a.id - b.id);
}

async function fetchPlayerData(playerId) {
  try {
    const playerRef = doc(db, 'Player', playerId);
    const playerSnap = await getDoc(playerRef);

    if (playerSnap.exists()) {
      const data = playerSnap.data();

      if (data && Object.keys(data).length > 0) {
        playerData = data;
        levelsCompleted = transformFirestoreData(data);
        
        if (levelsCompleted.length > 0) {
          const currentLevelIndex = data.level || 0;
          currentLevel = levelsCompleted[currentLevelIndex];
        }
      }
    }
  } catch (error) {
    console.error('Error fetching player data:', error);
  } finally {
    isLoading = false;
  }
}




async function updateStageStatus(stageIndex, completed) {
  try {
    const playerRef = doc(db, 'Player', $user.id);
    const updates = {
      [`levelsCompleted.${stageIndex}`]: completed
    };
    
    await updateDoc(playerRef, updates);
    
    playerData = {
      ...playerData,
      levelsCompleted: {
        ...playerData.levelsCompleted,
        [stageIndex]: completed
      }
    };


    
    levelsCompleted = transformFirestoreData(playerData);;
    currentLevel = levelsCompleted.find(level => 
      level.challenges.some(challenge => challenge.index === stageIndex)
    );
  } catch (error) {
    console.error('Error updating stage status:', error);
  }
}

onMount(async () => {
  if ($user) {
    await fetchPlayerData($user.id);
  }
});

function handleLevelChange(level) {
  if (level.status !== 'locked') {
    currentLevel = level  ;
  }
  console.log(currentLevel)
}



</script>

<div class="mx-auto p-6">
  <div class="mb-8">
    <h1 class="text-2xl font-bold text-gray-800">تقدم المستوى</h1>
    <p class="text-gray-600 mt-1">متابعة جميع مراحل التقدم في المستويات</p>
  </div>

  {#if isLoading}
    <div class="bg-white rounded-2xl p-8 shadow-sm text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor mx-auto"></div>
      <p class="mt-4 text-gray-600">جاري التحميل...</p>
    </div>
  {:else if playerData && levelsCompleted.length > 0 && currentLevel}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <!-- Progress Circle -->
          <div class="relative w-48 h-48 mx-auto">
            <svg class="w-full h-full" viewBox="0 0 100 100">
              <circle
                class="text-gray-200"
                stroke-width="10"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                class="text-primaryColor"
                stroke-width="10"
                stroke-linecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
                style="transform: rotate(-90deg); transform-origin: 50% 50%; 
                      stroke-dasharray: 251.2; 
                      stroke-dashoffset: {251.2 - (251.2 * (parseInt(currentLevel?.completedStages || 0) / currentLevel?.challenges.length) || 0)}"
              />
            </svg>

            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span class="text-3xl font-bold text-gray-800">
                {(currentLevel?.completedStages || 0) * (currentLevel?.totalPoints / currentLevel?.challenges.length || 0)}/{currentLevel?.totalPoints || 0}
              </span>
              <p class="text-sm text-gray-500 mt-1">نقطة</p>
            </div>
          </div>

          <!-- Levels List -->
          <div class="mt-8 space-y-3">
            {#each levelsCompleted as level}
              <button 
                class="w-full p-3 rounded-lg text-right transition-all 
                      {level.id === currentLevel?.id ? 'bg-primaryColor/10 text-primaryColor' : 'hover:bg-gray-50'}"
                on:click={() => handleLevelChange(level)}
                disabled={level.status === 'locked'}
              >
                <div class="flex items-center justify-between">
                  <span class="font-medium">{level.name}</span>
                  <span class="text-sm {level.status === 'locked' ? 'text-gray-400' : 'text-primaryColor'}">
                    {(level.completedStages * (level.totalPoints / level.challenges.length)) || 0}/{level.totalPoints}
                  </span>
                </div>
              </button>
            {/each}
          </div>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-800">{currentLevel.name}</h2>
            <span class="px-3 py-1 rounded-full text-sm font-medium
              {currentLevel.status === 'completed' ? 'bg-green-100 text-green-600' : 
              currentLevel.status === 'in-progress' ? 'bg-secondaryColor text-primaryColor' :
              'bg-gray-100 text-gray-600'}">
              {currentLevel.status === 'completed' ? 'مكتمل' : 
              currentLevel.status === 'in-progress' ? 'قيد التقدم' : 
              'مقفل'}
            </span>
          </div>

          <div class="space-y-6">
            {#each currentLevel.challenges as challenge}
              <div class="border border-gray-100 rounded-xl p-4">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-medium text-gray-800">{challenge.name}</h3>
                  <span class="text-sm {challenge.status === 'completed' ? 'text-green-500' : 'text-gray-400'}">
                    {challenge.progress}%
                  </span>
                </div>
                
                <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all duration-500 {
                      challenge.status === 'completed' ? 'bg-green-500' :
                      challenge.status === 'in-progress' ? 'bg-primaryColor' :
                      'bg-gray-300'
                    }"
                    style="width: {challenge.progress}%"
                  />
                </div>
                {#if challenge.status === 'completed'}
                  <p class="mt-2 text-sm text-gray-600">{challenge.accuracy}% دقة الكلمات الصحيحة</p>
                {/if}
              </div>
            {/each}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div class="bg-gray-50 rounded-xl p-4">
              <h4 class="font-medium text-gray-800 mb-2">إنجازات المستوى</h4>
              <div class="flex items-center gap-4">
                <div class="bg-white rounded-lg p-3 flex-1 text-center">
                  <span class="block text-lg font-bold text-primaryColor">{currentLevel.challenges.length}</span>
                  <span class="text-sm text-gray-500">التحديات</span>
                </div>
                <div class="bg-white rounded-lg p-3 flex-1 text-center">
                  <span class="block text-lg font-bold text-primaryColor">
                    {(currentLevel?.completedStages || 0) * (currentLevel?.totalPoints / currentLevel?.challenges.length || 0)}
                  </span>
                  <span class="text-sm text-gray-500">النقاط</span>
                </div>
              </div>
            </div>
            
            <div class="bg-primaryColor/5 rounded-xl p-4">
              <h4 class="font-medium text-primaryColor mb-2">نصيحة اليوم</h4>
              <p class="text-sm text-gray-600">
                تذكر أن تقوم بممارسة التحديات بشكل منتظم للحصول على أفضل النتائج! 🌟
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="bg-white rounded-2xl p-8 shadow-sm text-center ">
      <div class="mb-4 ">
        <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-gray-800 mb-2">لا توجد بيانات تقدم المستوى</h2>
      <p class="text-gray-600">إلا بعد البدء في اللعب</p>
    </div>
  {/if}
</div>

<style>
  @keyframes progress {
    0% { stroke-dashoffset: 251.2; }
  }

  circle {
    transition: stroke-dashoffset 1s ease-out;
  }
</style>