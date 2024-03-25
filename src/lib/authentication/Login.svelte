<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let email = "";
    let password = "";

    function onLogin() {
        dispatch('login', {
            email,
            password
        });
    }

    function onSwitchToRegister() {
        dispatch('switchToRegister', {});
    }
</script>
<h1>
    Log into Sephau
</h1>
<div>
    <input bind:value={email} placeholder="Enter your e-mail" />
</div>
<div>
    <input bind:value={password} placeholder="Enter your password" type="password" autocomplete="off" />
</div>
<div>
    <button class="login-button" on:click={onLogin}>Log in</button>
</div>
<div>
    <button class="switch-to-register-button" on:click={onSwitchToRegister}>Sign up instead</button>
</div>