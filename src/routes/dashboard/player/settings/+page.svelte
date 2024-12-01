
<script>
  import { MailIcon, PhoneIcon,Edit2Icon, CameraIcon } from 'svelte-feather-icons';
  import {user} from "$lib/stores/stores"
  import { db } from '$lib/firebase/config';
  import { collection, addDoc, getDocs, updateDoc,doc } from 'firebase/firestore';

  let userData =  $user

  let isEditingAvatar = false;
  let isDirty = false;

  function handleInput() {
    isDirty = true;
  }

  function handleSubmit() {
    
    try {
      user.set(userData)
      const playerRef = doc(db, 'Player', userData.id);
      updateDoc(playerRef, userData);
      console.log('Document written with ID: ', userData.id);
    } catch (error) {
      console.error('Error adding document: ', error);
      console.log(userData)


    }
    isDirty = false;
  }

  function handleCancel() {
    
    isDirty = false;
  }

  // @ts-ignore
  function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (file) {
      isEditingAvatar = false;
    }
  }
</script>

<div class=" mx-auto p-6 ">
  
  <div class="mb-8">
    <h1 class="text-2xl font-bold text-gray-800">الإعدادات</h1>
    <p class="text-gray-500">جميع إعدادات الملف الشخصي</p>
  </div>

  
  <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
    
    <div class="relative bg-gradient-to-l from-primaryColor to-cyan-500 h-48">
      <div class="absolute -bottom-16 right-8">
        <div class="relative group">
          <div class="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
            <img
              src={userData.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5XSsGNXRAhMPD7t9VzCppJ28ec-rA1rcTzaIn0txizwy6o9E-UtVQ14dvi9eJKMSP7lk&usqp=CAU'}
              alt="Profile"
              class="w-full h-full object-cover"
            />
            <button
              class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              on:click={() => isEditingAvatar = true}
            >
              <CameraIcon class="text-white" size="24"/>
            </button>
          </div>
          {#if isEditingAvatar}
            <input
              type="file"
              accept="image/*"
              class="hidden"
              on:change={handleAvatarChange}
            />
          {/if}
        </div>
      </div>
    </div>

    
    <div class="p-8 pt-20 ">
      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">اسم المستخدم*</label>
          <div class="relative">
            <input
              type="text"
              bind:value={userData.username}
              on:input={handleInput}
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor outline-none transition-colors"
              readonly
            />
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
          </div>
        </div>

        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">الاسم الأول*</label>
            <div class="relative">
              <input
                type="text"
                bind:value={userData.firstName}
                on:input={handleInput}
                class="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200  rounded-lg focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor outline-none transition-colors"
                required
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Edit2Icon size="18"/>
              </span>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">الاسم الأخير*</label>
            <div class="relative">
              <input
                type="text"
                bind:value={userData.lastName}
                on:input={handleInput}
                class="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor outline-none transition-colors"
                required
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Edit2Icon size="18"/>
              </span>
            </div>
          </div>
        </div>

        
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">البريد الإلكتروني*</label>
          <div class="relative">
            <input
              type="email"
              bind:value={userData.email}
              on:input={handleInput}
              class="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor outline-none transition-colors"
              required
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <MailIcon size="18"/>
            </span>
          </div>
        </div>

        
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">رقم الجوال*</label>
          <div class="relative">
            <input
              type="tel"
              bind:value={userData.phone}
              on:input={handleInput}
              class="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor outline-none transition-colors"
              required
              
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <PhoneIcon size="18"/>
            </span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            class="px-6 py-2.5 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            on:click={handleCancel}
            disabled={!isDirty}
          >
            إلغاء
          </button>
          <button
            type="submit"
            class="px-6 py-2.5 bg-primaryColor text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50"
            disabled={!isDirty}
          >
            حفظ
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<style>
  @media (max-width: 768px) {
    .grid-cols-2 {
      grid-template-columns: 1fr;
    }
    
    .p-8 {
      padding: 1.5rem;
    }
  }
</style>