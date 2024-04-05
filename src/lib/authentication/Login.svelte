<script>
    import SmartTextField from '$lib/ui/SmartTextField.svelte';
    import { ApplicationController } from '$lib/Controllers'
    import { createEventDispatcher } from 'svelte';

    /**
     * @type {String}
     */
    export let pageName;
    /**
     * @type {ApplicationController}
     */
    export let appCtrl;

    const dispatch = createEventDispatcher();

    let email = "";
    let password = "";

    /**
     * @type {String | null}
     */
    let error = null;

    /**
     * @type {String | null}
     */
    let emailError = null;
    /**
     * @type {String | null}
     */
    let passwordError = null;

    function onLogin() {
        error = null;
        emailError = null;
        passwordError = null;

        let isInputValid = true;

        if (email == "") {
            isInputValid = false;
            emailError = "Cannot leave email empty";
        }

        if (password == "") {
            isInputValid = false;
            passwordError = "Cannot leave password empty";
        }

        if (isInputValid) {
            appCtrl.login(email, password)
                .catch(err => {
                    const code = err.code;
                    // const errorMessage = err.message;

                    if (code == "auth/invalid-email") {
                        emailError = "Invalid email";
                    } else if (code == "auth/invalid-login-credentials" || code == "auth/invalid-credential") {
                        password = "Incorrect password";
                    } else {
                        error = "Unknown login error. Check your credentials and try again later. (error code " + code + ")";
                    }
                });
        }
    }

    function onSwitchToRegister() {
        dispatch('switchToRegister', {});
    }
</script>
<div class="card bg-neutral-800 w-128 rounded">
    <div class="card-body">
        <h1 class="text-lg font-bold">
            Log into {pageName}
        </h1>
        <SmartTextField
            title="Email"
            type="email"
            bind:value={email}
            bind:error={emailError}
        />
        <SmartTextField
            title="Password"
            type="password"
            bind:value={password}
            bind:error={passwordError}
        />
        <div>
            <button class="PrimaryButton w-full" on:click={onLogin}>Log in</button>
        </div>
        {#if error !== null}
            <div class="text-red-500">
                {error}
            </div>
        {/if}
        <div>
            Don't have a {pageName} account? <button class="text-blue-600" on:click={onSwitchToRegister}>Create one</button>
        </div>
    </div>
</div>