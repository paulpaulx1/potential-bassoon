<!-- routes/auth/register/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';

    type ActionData = {
        message?: string;
        email?: string;
    }

    let { message, email }: ActionData = $props();

</script>

<div class="container">
    <h1>Create Account</h1>

    <form method="POST" use:enhance>
        <div class="form-group">
            <label for="email">Email</label>
            <input 
                type="email" 
                id="email" 
                name="email" 
                value={email ?? ''} 
                required
            />
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input 
                type="password" 
                id="password" 
                name="password" 
                minlength="8"
                required
            />
            <small>Password must be at least 8 characters long</small>
        </div>

        {#if message}
            <p class="error">{message}</p>
        {/if}

        <button type="submit">Create Account</button>
    </form>

    <p class="sign-in-link">
        Already have an account? <a href="/auth/signin">Sign in</a>
    </p>
</div>

<style>
    .container {
        max-width: 400px;
        margin: 2rem auto;
        padding: 1rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }

    input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    small {
        display: block;
        margin-top: 0.25rem;
        color: #666;
    }

    .error {
        color: #dc2626;
        margin-bottom: 1rem;
    }

    button {
        width: 100%;
        padding: 0.75rem;
        background-color: #2563eb;
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
    }

    button:hover {
        background-color: #1d4ed8;
    }

    .sign-in-link {
        text-align: center;
        margin-top: 1rem;
    }

    .sign-in-link a {
        color: #2563eb;
        text-decoration: none;
    }

    .sign-in-link a:hover {
        text-decoration: underline;
    }
</style>