<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let email = "";
    let password = "";
    let reenteredPassword = "";

    function onRegister() {
        dispatch('register', {
            email,
            password
        });
    }

    function onSwitchToLogin() {
        dispatch('switchToLogin', {});
    }
</script>
<h1>
    Sign up for a Sephau account
</h1>
<div>
    <input bind:value={email} placeholder="Enter your e-mail" />
</div>
<div>
    <input bind:value={password} placeholder="Enter your password" type="password" autocomplete="off" />
</div>
<div>
    <input bind:value={reenteredPassword} placeholder="Re-enter your password" type="password" autocomplete="off" />
</div>
<div>
    <button class="login-button" on:click={onRegister}>Sign up</button>
</div>
<div>
    <button class="login-button" on:click={onSwitchToLogin}>Log in instead</button>
</div>