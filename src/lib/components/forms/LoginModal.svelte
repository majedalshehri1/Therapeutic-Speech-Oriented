<script>
  // Import required icons and store
  import { XIcon, UserIcon, LockIcon } from "svelte-feather-icons";
  import { modal } from '$lib/stores/modal';
  import {goto} from '$app/navigation';
  import { db } from '$lib/firebase/config';
  import { collection, addDoc, getDocs } from 'firebase/firestore';
  import {user , isLoggedIn} from '$lib/stores/stores';
	import { Check } from "lucide-svelte";
  import toast from 'svelte-french-toast';
  // Props
  export let isOpen = false;
  let isSpecialist = false
  
  // Form state
  let formData = {
    username: '',
    password: '',
    rememberMe: false
  };
  
  // Event handlers
  const handleClose = () => {
    formData = { username: '', password: '', rememberMe: false };
    modal.closeAll();
  };
  
  // @ts-ignore
  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      
      const palyersRef = collection(db, isSpecialist ? 'Specialist' : 'Player');
      const querySnapshot = await getDocs(palyersRef);

      let isAuthicated = false;

      querySnapshot.forEach((doc) =>{
        const userData = doc.data();
        if (userData.username === formData.username && userData.password === formData.password){
          isAuthicated = true;
          user.set({
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username,
            type: userData.type,
            email: userData.email,
            phone: userData.phone,
            avatar  : userData.avatar,
            id: doc.id
          })


          isLoggedIn.set(true);
          if(isSpecialist){
            toast.success('تم تسجيل الدخول بنجاح');
            goto('/dashboard/specialist');
          }else{
            toast.success('تم تسجيل الدخول بنجاح');
            goto('/dashboard/player');
          }
        }
      })

      if (!isAuthicated){
        toast.error('اسم المستخدم او كلمة المرور غير صحيحة');
      }
    }
    catch(error){
      console.error('Authentication error: ', error);
      toast.error('حدث خطأ في تسجيل الدخول');
      
    } finally{
      handleClose();
    }
    
  };
  // @ts-ignore
  const handleEscape = (event) => {
    if (event.key === 'Escape') handleClose();
  };
  // @ts-ignore
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  };
  </script>
  
  <svelte:window on:keydown={handleEscape}/>
  
  {#if isOpen}
  <div 
    class="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="login-title"
  >
    <div 
      class="min-h-screen flex items-center justify-center p-4" 
      role="presentation"
      on:mousedown|self={handleClose}
    >
      <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-8">
        <button 
          on:click={handleClose}
          on:keypress={handleKeyPress}
          class="absolute left-4 top-4 p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full"
          aria-label="إغلاق"
        >
          <XIcon size="20"/>
        </button>
  
        <div class="text-center mb-6">
          <h2 id="login-title" class="text-2xl font-bold text-[#1a2942]">تسجيل الدخول</h2>
          <p class="text-gray-500 text-sm mt-2" id="login-description">أدخل بيانات الدخول الخاصة بك</p>
        </div>
  
        <form 
          on:submit={handleSubmit} 
          class="space-y-6"
          aria-describedby="login-description"
        >
          <div class="space-y-2">
            <label for="username" class="block text-sm font-medium text-gray-700">اسم المستخدم</label>
            <div class="relative">
              <input 
                id="username"
                type="text" 
                bind:value={formData.username}
                class="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                placeholder="أدخل اسم المستخدم"
                required
              />
              <span class="absolute inset-y-0 right-4 flex items-center pointer-events-none" aria-hidden="true">
                <UserIcon class="w-5 h-5 text-gray-400"/>
              </span>
            </div>
          </div>
  
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-gray-700">كلمة المرور</label>
            <div class="relative">
              <input 
                id="password"
                type="password" 
                bind:value={formData.password}
                class="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                placeholder="أدخل كلمة المرور"
                required
              />
              <span class="absolute inset-y-0 right-4 flex items-center pointer-events-none" aria-hidden="true">
                <LockIcon class="w-5 h-5 text-gray-400"/>
              </span>
            </div>
          </div>
  
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center">
              <input 
                type="checkbox" 
                bind:checked={isSpecialist}
                class="w-4 h-4 text-primaryColor border-gray-300 rounded"
              />
              <label for="remember" class="mr-2 text-gray-600">هل أنت مختص؟</label>
            </div>
            <button 
              type="button"
              class="text-primaryColor hover:text-cyan-600"
              on:keypress={handleKeyPress}
            >
              نسيت كلمة المرور؟
            </button>
          </div>
  
          <button 
            type="submit"
            class="w-full py-3 px-4 bg-primaryColor text-white rounded-lg hover:bg-cyan-600"
          >
            تسجيل الدخول
          </button>
        </form>
  
        <div class="text-center text-sm text-gray-500 mt-6">
          <span>ليس لديك حساب؟</span>
          <button 
            type="button"
            class="text-primaryColor hover:underline mr-1"
            on:click={() => modal.openRegistration()}
            on:keypress={handleKeyPress}
          >
            إنشاء حساب جديد
          </button>
        </div>
      </div>
    </div>
  </div>
  {/if}