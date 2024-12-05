<script lang="ts">
import { enhance } from '$app/forms';
import { type SubmitFunction } from '@sveltejs/kit';
import { goto } from '$app/navigation';

type Props = {
    message?: string;
    email?: string;
}

let { message, email } = $props();

let loading = $state(false);
let isRegistering = $state(false);

const handleSubmit: SubmitFunction = () => {
   loading = true;
   return async ({ result, update }) => {
       if (result.type === 'success' && result.data?.status === 303) {
           await goto(result.data.headers.Location);
           return;
       }
       if (result.type === 'failure') await update();
       loading = false;
   };
};
</script>

<form method="POST" use:enhance={handleSubmit}>
   <input type="hidden" name="mode" value={isRegistering ? 'register' : 'signin'} />
   
   <div class="field">
       <label for="email">Email</label>
       <input 
           type="email" 
           id="email" 
           name="email" 
           value={email ?? ''} 
           required
           disabled={loading}
       />
   </div>

   <div class="field">
       <label for="password">Password</label>
       <input 
           type="password" 
           id="password" 
           name="password" 
           minlength="8"
           required
           disabled={loading}
       />
       {#if isRegistering}
           <small>Password must be at least 8 characters long</small>
       {/if}
   </div>

   {#if message}
       <p class="error">{message}</p>
   {/if}

   <button type="submit" disabled={loading}>
       {loading ? 
           (isRegistering ? 'Creating Account...' : 'Signing In...') : 
           (isRegistering ? 'Create Account' : 'Sign In')}
   </button>

   <button 
       type="button" 
       class="switch-mode"
       onclick={() => isRegistering = !isRegistering}
       disabled={loading}
   >
       {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register'}
   </button>
</form>