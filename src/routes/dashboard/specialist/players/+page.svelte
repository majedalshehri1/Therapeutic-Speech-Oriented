<script>
  // @ts-nocheck
  
    import { SearchIcon, UserPlusIcon, EyeIcon, TrashIcon, PhoneIcon, MailIcon } from "svelte-feather-icons";
    import { fade, slide } from 'svelte/transition';
    import { db } from '$lib/firebase/config';
    import {collection, addDoc, getDocs,getDoc, query, where, updateDoc, deleteDoc, doc, setDoc} from 'firebase/firestore';
    import {user, isLoading} from '$lib/stores/stores';
    import { onMount, afterUpdate } from 'svelte';
    import toast from 'svelte-french-toast';
  
  onMount (async () => {
    // await viewRegisteredPlayers();
    await viewAllPlayers();
    await viewRegisteredPlayers();
  
  })
    $: players = [];
    // Array of players available for registration
    $: availablePlayers = [];
  
    let levels = [
  {
    name: "تحديد المستوى",
    points: 50,
    totalPoints: 150,
    completedChallenges: 2,
    stages: [
      { name: "مرحلة الصحراء 1", progress: 0 },
      { name: "مرحلة الصحراء 2", progress: 0 }
    ]
  },
  {
    name: "مرحلة الغابة",
    points: 50,
    totalPoints: 150,
    completedChallenges: 2,
    stages: [
      { name: "مرحلة النار 1", progress: 0 },
      { name: "مرحلة النار 2", progress: 0 }
    ]
  },
  {
    name: "مرحلة الصحراء",
    points: 50,
    totalPoints: 150,
    completedChallenges: 2,
    stages: [
      { name: "مرحلة الكهف 1", progress: 0 },
      { name: "مرحلة الكهف 2", progress: 0 }
    ]
  },
  {
    name: "مرحلة القصر",
    points: 50,
    totalPoints: 150,
    completedChallenges: 2,
    stages: [
      { name: "مرحلة الثلج 1", progress: 0 },
      { name: "مرحلة الثلج 2", progress: 0 }
    ]
  }
];
  
    // Search state variables
    let searchQuery = '';
    let searchAvailableQuery = '';
    let isAddingPlayer = false;
  
    // Reactive statement for filtering available players based on search query
    $: filteredAvailablePlayers = availablePlayers.filter(player => 
    player.firstName?.includes(searchAvailableQuery) || 
    player.username?.toLowerCase().includes(searchAvailableQuery.toLowerCase())
  );
    // Reactive statement for filtering registered players based on search query
    $: filteredPlayers = players.filter(player => 
      player.firstName?.includes(searchQuery) || 
      player.username?.includes(searchQuery)
    );
    
  
    /**
     * Handles player removal from the system
     * @param {number} playerId - The ID of the player to remove
     */
    function handleRemovePlayer(playerId) {
      if (confirm('هل أنت متأكد من حذف هذا اللاعب؟')) {
        // Find player to remove
        const playerToRemove = players.find(p => p.id === playerId);
        
        // Remove player from registered players list
        players = players.filter(p => p.id !== playerId);
        
        // Update player status in available players list
        availablePlayers = availablePlayers.map(p => 
          p.id === playerId ? {...p, isRegistered: false} : p
        );
      }
    }
  
    /**
     * Toggles the add player modal visibility
     */
    function toggleAddPlayer() {
      isAddingPlayer = !isAddingPlayer;
    }
  
    /**
     * Handles adding a new player to the system
     * @param {Object} player - The player object to add
     */
    function handleAddPlayer(player) {
      // Check if player is already registered
      if (player.isRegistered) {
   
        return;
      }
      
      // Add player to registered players list
      players = [...players, newPlayer];
  
      // Update player status in available players list
      availablePlayers = availablePlayers.map(p => 
        p.id === player.id ? {...p, isRegistered: true} : p
      );
  
      // Close add player modal
      isAddingPlayer = false;
    }
  
  
  // Function to calculate experience points based on level
  function calculateXP(level) {
    return Math.pow(2, level) * 50;
  }
  
  // Function to add a new player
  async function addPlayer(player) {
    $isLoading = true;
    try {
      const { id: specialistId } = $user;
  
      // Check if player is already registered in the specialist
  
      const playersQuery = query(
      collection(db, 'Specialist'),
      where('players', 'array-contains', player.id)
  );
  
  const playersSnapshot = await getDocs(playersQuery);
  
  // Check if the player already exists in the array
  if (!playersSnapshot.empty) {
      toast.error('اللاعب مسجل بالفعل');
      availablePlayers = availablePlayers.map(p =>
        p.id === player.id ? {...p, isRegistered: true} : p
      );
      console.log("player:" + player.id);
      console.log("player snapshot:" + playersSnapshot.docs[0].id);
      return;
  }
  
  
  
      // Update the specialist's player list
      const specialistRef = doc(db, 'Specialist', specialistId);
      const specialistDoc = await getDoc(specialistRef);
      const specialistData = specialistDoc.data();
      await updateDoc(specialistRef, {
        players: [...(specialistData?.players || []), player.id]
      });
      players = [...players, player];
      // change the isRegistered property to true in the Player array
      availablePlayers = availablePlayers.map(p => 
        p.id === player.id ? {...p, isRegistered: true} : p
      );
      toast.success('تم تسجيل اللاعب بنجاح');
      isAddingPlayer = false;
  
      
    } catch (error) {
    } finally {
      $isLoading = false;
    }
  
    //change the isRegistered property to true in the Player collection
    const playerRef = doc(db, 'Player', player.id);
    await updateDoc(playerRef, {
      isRegistered: true
    })
  }
  
  // Function to remove a player
  async function removePlayer(playerId) {
    $isLoading = true;
    try {
      // Fetch specialist data and ensure players defaults to an empty array
      const specialistData = await getSpecialistData();
      if (!specialistData.id) {
        throw new Error('Specialist ID is undefined or invalid.');
      }
  
      const specialistId = specialistData.id;
  
      // Safely update the players array by filtering out the playerId
      const updatedPlayers = Array.isArray(specialistData.players) ? specialistData.players.filter(id => id !== playerId) : [];
  
      // Update the specialist document with the new players array
      await updateDoc(doc(db, 'Specialist', specialistId), {
        players: updatedPlayers
     
      });
  
      ///change the isRegistered property to false in the Player collection
      const playerRef = doc(db, 'Player', playerId);
      await updateDoc(playerRef, {
        isRegistered: false
      })
  
      // change is registered property to false in the player array
      availablePlayers = availablePlayers.map(p => 
        p.id === playerId ? {...p, isRegistered: false} : p
      );
  
      players = players.filter(player => player.id !== playerId);
  
      toast.success('تم حذف اللاعب بنجاح');
    } catch (error) {
    } finally {
      $isLoading = false;
    }
  }
  
  // Function to update a player's progress
  async function updatePlayerProgress(playerId, levels) {
    $isLoading = true;
    try {
      const playerRef = doc(db, 'players', playerId);
      await updateDoc(playerRef, {
        levels,
        xp: calculateXP(levels.length - 1)
      });
    } catch (error) {
    } finally {
      $isLoading = false;
    }
  }
  
  // Function to get the specialist data
  async function getSpecialistData() {
    try {
      const q = doc(db, 'Specialist', $user.id);
      const specialistDoc = await getDoc(q);
  
      if (specialistDoc.exists()) {
        
        return { id: specialistDoc.id, ...specialistDoc.data() };
      }
  
      
      return {};
    } catch (error) {
      
      return {};
    }
  } 
  
  
  async function viewAllPlayers() {
    $isLoading = true;
    // add all players to players array from the players collection regards to the current specialist
    const result = (await getDocs(collection(db, 'Player'))).docs.map(doc => {
    const playerData = doc.data();
    delete playerData.password; // remove the password field from the data
    return { id: doc.id, ...playerData };
  });
  
  
  
    $isLoading = false;
    availablePlayers = result;
    
  
    
  }
  
  async function viewRegisteredPlayers() {
    $isLoading = true;
  
    try {
      // Fetch the Specialist document by user ID
      const specialistDocRef = doc(db, 'Specialist', $user.id);
      const specialistDoc = await getDoc(specialistDocRef);
  
      if (specialistDoc.exists()) {
        // Extract the players array
        const specialistData = specialistDoc.data();
        //filter the players array to only include registered players and get thier data from available players
        players = availablePlayers.filter(player => specialistData.players.includes(player.id)) || []; // Default to an empty array if no players
        
      } else {
        players = [];
      }
    } catch (error) {
      players = [];
    } finally {
      $isLoading = false;
    }
  }
  
  // Subscribe to the user store
  $: $user = $user;
  let specialist = [];
  // Load the specialist's player list
  $: {
    if ($user.id) {
      getSpecialistData().then(data => {
        specialist = data;
      });
    }
  }
  </script>
  
  <!-- Main container with RTL layout -->
<div class="flex flex-row-reverse">
  <!-- Sidebar for search and add functionality -->
  <div class="w-80 min-h-[calc(100vh-4rem)] bg-gradient-to-b from-secondaryColor to-white border-l border-gray-100 p-4">
    <div class="space-y-4">
      <!-- Search input field -->
      <div class="relative">
        <input 
          type="search" 
          bind:value={searchQuery}
          placeholder="بحث عن لاعب..."
          class="w-full pr-10 pl-4 py-3 bg-white border border-gray-100 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-primaryColor/20 
                 focus:border-primaryColor transition-all"
        />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <SearchIcon size="18" />
        </span>
      </div>

      <!-- Add player button -->
      <button 
        class="w-full py-3 px-4 bg-primaryColor text-white rounded-lg
               hover:bg-cyan-600 transition-all flex items-center justify-center gap-2"
        on:click={toggleAddPlayer}
      >
        <UserPlusIcon size="18" />
        <span>إضافة لاعب</span>
      </button>

      <!-- Add Player Modal -->
      {#if isAddingPlayer}
        <div 
          class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          transition:fade
        >
          <div 
            class="bg-white rounded-xl p-6 w-[480px] shadow-xl"
            transition:slide
          >
            <h3 class="text-xl font-bold mb-4">إضافة لاعب جديد</h3>
            
            <!-- Modal search input -->
            <input 
              type="search"
              bind:value={searchAvailableQuery}
              placeholder="ابحث عن لاعب لإضافته..."
              class="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4"
            />

            <!-- Available players list -->
            <div class="max-h-[300px] overflow-y-auto space-y-2">
              {#each filteredAvailablePlayers as player}
                <div class="w-full p-3 flex items-center justify-between gap-3 rounded-lg hover:bg-gray-50">
                  <div class="flex items-center gap-3">
                    <img 
                      src={player.avatar} 
                      alt={player.firstName}
                      class="w-10 h-10 rounded-full"
                    />
                    <div class="text-right">
                      <div class="font-medium">{player.firstName}</div>
                      <div class="text-sm text-gray-500">{player.username}</div>
                    </div>
                  </div>
                  
                  {#if player.isRegistered}
                    <span class="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                      مسجل مسبقاً
                    </span>
                  {:else}
                    <button 
                      class="text-sm px-3 py-1 bg-primaryColor text-white rounded-full hover:bg-cyan-600"
                      on:click={() => addPlayer(player)}
                    >
                      تسجيل
                    </button>
                  {/if}
                </div>
              {/each}
            </div>

            <!-- Modal close button -->
            <button 
              class="mt-4 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              on:click={() => isAddingPlayer = false}
            >
              إغلاق
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Main content area -->
  <div class="flex-1 p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">اللاعبين</h1>
      <p class="text-gray-500 text-sm mt-1">إدارة اللاعبين ومتابعة تقدمهم</p>
    </div>

    <!-- Conditional rendering based on loading and players state -->
    {#if $isLoading}
      <div class="min-h-[60vh] flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor mx-auto"></div>
          <p class="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    {:else if filteredPlayers.length === 0}
      <div class="min-h-[60vh] flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-full mb-4 mx-auto flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">لا يوجد لاعبين مضافين</h3>
          <p class="text-gray-500">قم بإضافة لاعبين من خلال زر "إضافة لاعب"</p>
        </div>
      </div>
    {:else}
      <div class="grid gap-4">
        {#each filteredPlayers as player}
          <div class="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md">
            <!-- Player header with actions -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="relative">
                  <img 
                    src={player.avatar} 
                    alt={player.firstName}
                    class="w-14 h-14 rounded-full"
                  />
                </div>
                
                <div>
                  <h3 class="font-bold text-gray-800">{player.firstName}</h3>
                  <p class="text-sm text-gray-500">{player.username}</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <button 
                  class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="حذف"
                  on:click={() => removePlayer(player.id)}
                >
                  <TrashIcon size="18" />
                </button>
              </div>
            </div>

            <!-- Level progress section -->
            <div class="mt-6">             
              <div class="grid grid-cols-2 gap-4 mb-4">
                {#each levels as level, index}
                  <div class="p-3 bg-gray-50 rounded-lg">
                    <span class="block text-sm text-gray-500">{level.name}</span>
                    <div class="flex items-center gap-2">
                      <div class="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          class="h-full bg-primaryColor rounded-full transition-all"
                          style="width: {player.levelsCompleted?.[index] ? '100' : '0'}%"
                        ></div>
                      </div>
                      <span class="text-sm font-medium text-primaryColor">
                        {player.levelsCompleted?.[index] ? '100' : '0'}%
                      </span>
                    </div>
                    {#if player.levelsCompleted?.[index]}
                      <p class="mt-2 text-sm text-gray-600">دقة الكلمات الصحيحة {player.percentagePerLevel?.[index] || 0}%</p>
                    {/if}
                  </div>
                {/each}
              </div>

              <!-- Stats display -->
              <div class="grid grid-cols-3 gap-4">
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <span class="block text-sm text-gray-500">التحديات المكتملة</span>
                  <span class="text-lg font-bold text-primaryColor">
                    {player.levelsCompleted ? player.levelsCompleted.filter(level => level).length : '0'}
                  </span>
                </div>
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <span class="block text-sm text-gray-500">مستوى التقدم</span>
                  <span class="text-lg font-bold text-primaryColor">
                    {player.levelsCompleted ? 
                      Math.floor((player.levelsCompleted.filter(level => level).length / levels.length) * 100) : '0'}%
                  </span>
                </div>
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <span class="block text-sm text-gray-500">الحالة</span>
                  <span class="text-lg font-bold {player.levelsCompleted?.[0] ? 'text-green-500' : 'text-red-500'}">
                    {player.levelsCompleted?.[0] ? 'بدأ اللعب' : 'لم يلعب'}
                  </span>
                </div>
              </div>
            </div>

            <!-- Contact information -->
            <div dir="ltr" class="mt-4 flex items-center gap-4 text-sm text-gray-500">
              <div class="flex items-center gap-1">
                <MailIcon size="14" />
                {player.email}
              </div>
              <div class="flex items-center gap-1">
                <PhoneIcon size="14" />
                {player.phone}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
  
<style>
  @media (max-width: 1024px) {
    .flex {
      flex-direction: column;
    }
    
    .w-80 {
      width: 100%;
      min-height: auto;
      border-left: none;
      border-bottom: 1px solid #e5e7eb;
    }

    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>