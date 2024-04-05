<script>
    import SmartTextField from '$lib/ui/SmartTextField.svelte';
    import { createEventDispatcher } from 'svelte';

    /**
     * @type {String}
     */
    export let pageName;

    const dispatch = createEventDispatcher();

    let email = "";
    let password = "";

    /**
     * @type {String | null}
     */
    let emailError = null;
    /**
     * @type {String | null}
     */
    let passwordError = null;

    function onLogin() {
        emailError = null;
        passwordError = null;

        let isInputValid = true;

        if (email == "") {
            isInputValid = false;
            emailError = "Cannot leave this empty";
        }

        if (password == "") {
            isInputValid = false;
            passwordError = "Cannot leave this empty";
        }

        if (isInputValid) {
            dispatch('login', {
                email,
                password
            });
        }
    }

    function onSwitchToRegister() {
        dispatch('switchToRegister', {});
    }
</script>
<div class="card bg-neutral-800 w-96 rounded-lg">
    <div class="card-body">
        <h1>
            Log into {pageName}
        </h1>
        <SmartTextField
            title="Email"
            bind:value={email}
            bind:error={emailError}
        />
        <SmartTextField
            title="Password"
            bind:value={password}
            bind:error={passwordError}
        />
        <div>
            <button class="login-button btn rounded-lg bg-neutral-700" on:click={onLogin}>Log in</button>
        </div>
        <div>
            Don't have a {pageName} account? <button class="switch-to-register-button text-blue-600" on:click={onSwitchToRegister}>Create one</button>
        </div>
    </div>
</div>