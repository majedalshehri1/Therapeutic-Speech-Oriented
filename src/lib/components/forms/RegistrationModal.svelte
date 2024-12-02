<script>
  // Import required icons and store
  import { XIcon, UserIcon, LockIcon, MailIcon, PhoneIcon, KeyIcon } from "svelte-feather-icons";
  import { modal } from '$lib/stores/modal';
  import { db } from '$lib/firebase/config';
  import {collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc} from 'firebase/firestore';
  import toast from "svelte-french-toast";
  // Props and state
  export let isOpen = false;
  let isPlayerForm = true;
  
  // Form data structure
  let formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    verificationCode: ''
  };
  
  // Event Handlers
  function handleClose() {
    formData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      verificationCode: ''
    };
    modal.closeAll();
  }
  
  // @ts-ignore
  async function handleSubmit(event) {
    event.preventDefault();

// Input validation
if (formData.password.length < 8) {
  toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
  return;
}


try {
  // Check if username already exists
  const usersRef = collection(db, isPlayerForm ? 'Player' : 'Specialist');
  const usernameQuery = query(usersRef, where('username', '==', formData.username));
  const usernameSnapshot = await getDocs(usernameQuery);

  if (!usernameSnapshot.empty) {
    toast.error('اسم المستخدم موجود بالفعل');
    return;
  }

  // Check if email already exists
  const emailQuery = query(usersRef, where('email', '==', formData.email));
  const emailSnapshot = await getDocs(emailQuery);

  if (!emailSnapshot.empty) {
    toast.error('البريد الإلكتروني مستخدم بالفعل');
    return;
  }

  if (!isPlayerForm) {
  try {
    //get verification code from Token collection: any document in the collection has tokenId which is the verification code
    const verificationCodeQuery = await query(collection(db, 'Token'), where('tokenid', '==', formData.verificationCode));
    // const TokenSnapshot = await getDocs(collection(db, 'Token'));
    const verificationCodeSnapshot = await getDocs(verificationCodeQuery);
    
    if (verificationCodeSnapshot.empty) {
      toast.error('رمز التحقق غير صحيح');
      console.log(JSON.stringify(verificationCodeSnapshot.docs[0]?.data()));
      // console.log("Token collection:" + JSON.stringify(TokenSnapshot.docs[0].data()));
      // console.log("verfication code from user input:" + formData.verificationCode);
      return;
    }
  } catch (error) {
    console.error('Error getting verification code:', error);
    toast.error('حدث خطاء في جلب رمز التحقق. يرجى المحاولة مرة اخرى');
    return;
  }
}

  // Prepare user data for Firestore
  const userData = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    username: formData.username,
    password: formData.password, // Note: In a real app, NEVER store passwords in plain text
    type: isPlayerForm ? 'player' : 'specialist',
    verificationCode: isPlayerForm ? null : formData.verificationCode,
    createdAt: new Date(),
    lastLogin: null,
    isActive: true,
    isRegistered: isPlayerForm? false : null
  };

  // Add user to Firestore
  const docRef = await addDoc(collection(db, isPlayerForm ? 'Player' : 'Specialist'), userData);

  // Show success message
  toast.success('تم إنشاء الحساب بنجاح');
  //regenerate verification code and update it then remove the old one
  if (!isPlayerForm) {
  try {
  // Generate a new verification code
  const verificationCode =  (Math.floor(Math.random() * 900000) + 100000).toString();
    
  // Add a new document to the Token collection
  await addDoc(collection(db, 'Token'), {
    tokenid: verificationCode,
    createdAt: new Date(),
    // Optionally, link it to the user if needed
    // userId: docRef.id 
  });

  // Remove the old verification code documents
  const oldVerificationCodeQuery = query(
    collection(db, 'Token'), 
    where('tokenid', '==', formData.verificationCode)
  );
  const oldVerificationCodeSnapshot = await getDocs(oldVerificationCodeQuery);
  
  oldVerificationCodeSnapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  });

} catch (error) {
  console.error('Error regenerating verification code:', error);
  toast.error('حدث خطأ في إعادة إنشاء رمز التحقق');
}
}
  // Close modal and potentially open login modal
  handleClose();
  modal.openLogin();

} catch (error) {
  console.error('Error registering user:', error);
  toast.error('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى');
}
  }
  // @ts-ignore
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      handleClose();
    }
  }
  // @ts-ignore
  function handleOutsideClick(event) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }
  
  function toggleForm() {
    isPlayerForm = !isPlayerForm;
    formData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      verificationCode: ''
    };
  }
  </script>
  
  <svelte:window on:keydown={handleKeydown}/>
  
  {#if isOpen}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm" on:click={handleOutsideClick}
  >
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-8">
        <!-- Close Button -->
        <button 
          on:click={handleClose}
          class="absolute left-4 top-4 p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-all duration-300"
          aria-label="إغلاق"
        >
          <XIcon size="20"/>
        </button>
  
        <div class="space-y-6">
          <h2 class="text-2xl font-bold text-center text-[#1a2942]">إنشاء حساب جديد</h2>
  
          <!-- Form Type Toggle -->
          <div class="flex justify-center gap-4">
            <button 
              class="px-6 py-2 rounded-lg transition-all duration-300 {isPlayerForm ? 'bg-primaryColor text-white' : 'border-2 border-primaryColor text-primaryColor hover:bg-primaryColor/10'}"
              on:click={() => isPlayerForm = true}
            >
              تسجيل لاعب
            </button>
            <button 
              class="px-6 py-2 rounded-lg transition-all duration-300 {!isPlayerForm ? 'bg-primaryColor text-white' : 'border-2 border-primaryColor text-primaryColor hover:bg-primaryColor/10'}"
              on:click={() => isPlayerForm = false}
            >
              تسجيل مختص
            </button>
          </div>
  
          <!-- Registration Form -->
          <form on:submit={handleSubmit} class="space-y-6 mt-8">
            <p class="text-gray-500 font-medium">المعلومات الشخصية</p>
  
            <!-- First and Last Name -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="firstName" class="block text-sm font-medium text-gray-700">الاسم الأول</label>
                <div class="relative group">
                  <input 
                    id="firstName"
                    type="text"
                    bind:value={formData.firstName}
                    class="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor transition-all group-hover:border-primaryColor"
                    placeholder="الاسم الأول"
                    required
                  />
                  <span class="absolute inset-y-0 right-4 flex items-center text-gray-400">
                    <UserIcon size="18"/>
                  </span>
                </div>
              </div>
  
              <div class="space-y-2">
                <label for="lastName" class="block text-sm font-medium text-gray-700">الاسم الأخير</label>
                <div class="relative group">
                  <input 
                    id="lastName"
                    type="text"
                    bind:value={formData.lastName}
                    class="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor transition-all group-hover:border-primaryColor"
                    placeholder="الاسم الأخير"
                    required
                  />
                  <span class="absolute inset-y-0 right-4 flex items-center text-gray-400">
                    <UserIcon size="18"/>
                  </span>
                </div>
              </div>
            </div>
  
            <!-- Email -->
            <div class="space-y-2">
              <label for="email" class="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
              <div class="relative group">
                <input 
                  id="email"
                  type="email"
                  bind:value={formData.email}
                  class="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor transition-all group-hover:border-primaryColor"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
                <span class="absolute inset-y-0 right-4 flex items-center text-gray-400">
                  <MailIcon size="18"/>
                </span>
              </div>
            </div>
  
            <!-- Phone -->
            <div class="space-y-2">
              <label for="phone" class="block text-sm font-medium text-gray-700">رقم الجوال</label>
              <div class="relative group">
                <input 
                  id="phone"
                  type="tel"
                  bind:value={formData.phone}
                  class="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor transition-all group-hover:border-primaryColor"
                  placeholder="+966"
                  required
                />
                <span class="absolute inset-y-0 right-4 flex items-center text-gray-400">
                  <PhoneIcon size="18"/>
                </span>
              </div>
            </div>
  
            <!-- Username and Password -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="username" class="block text-sm font-medium text-gray-700">اسم المستخدم</label>
                <div class="relative group">
                  <input 
                    id="username"
                    type="text"
                    bind:value={formData.username}
                    class="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor transition-all group-hover:border-primaryColor"
                    placeholder="اسم المستخدم"
                    required
                  />
                  <span class="absolute inset-y-0 right-4 flex items-center text-gray-400">
                    <UserIcon size="18"/>
                  </span>
                </div>
              </div>
  
              <div class="space-y-2">
                <label for="password" class="block text-sm font-medium text-gray-700">كلمة المرور</label>
                <div class="relative group">
                  <input 
                    id="password"
                    type="password"
                    bind:value={formData.password}
                    class="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor transition-all group-hover:border-primaryColor"
                    placeholder="كلمة المرور"
                    required
                    minlength="8"
                  />
                  <span class="absolute inset-y-0 right-4 flex items-center text-gray-400">
                    <LockIcon size="18"/>
                  </span>
                </div>
              </div>
            </div>
  
            <!-- Verification Code -->
            {#if !isPlayerForm}
              <div class="space-y-2">
                <label for="verificationCode" class="block text-sm font-medium text-gray-700">رمز التحقق</label>
                <div class="relative group">
                  <input 
                    id="verificationCode"
                    type="text"
                    bind:value={formData.verificationCode}
                    class="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor transition-all group-hover:border-primaryColor"
                    placeholder="أدخل رمز التحقق"
                    required="{!isPlayerForm}"
                  />
                  <span class="absolute inset-y-0 right-4 flex items-center text-gray-400">
                    <KeyIcon size="18"/>
                  </span>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  للحصول على رمز التحقق الرجاء التواصل مع 
                  <a 
                    href="mailto:talaqa.sa@gmail.com" 
                    class="text-primaryColor hover:underline hover:text-cyan-600 transition-colors"
                  >
                    talaqa.sa@gmail.com
                  </a>
                </p>
              </div>
            {/if}
  
            <!-- Submit Button -->
            <button 
              type="submit"
              class="w-full py-3 px-4 bg-primaryColor text-white rounded-lg hover:bg-cyan-600 transition-all duration-300 relative overflow-hidden group mt-6"
            >
              <span class="relative z-10">إنشاء حساب</span>
              <div class="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 bg-cyan-600"></div>
            </button>
  
            <!-- Login Link -->
            <p class="text-center text-sm text-gray-600">
              لديك حساب بالفعل؟
              <button 
                type="button"
                class="text-primaryColor hover:underline"
                on:click={() => modal.openLogin()}
              >
                تسجيل الدخول
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
  {/if}