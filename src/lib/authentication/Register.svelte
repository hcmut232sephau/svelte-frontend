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
    let reenteredPassword = "";

    /**
     * @type {String | null}
     */
    let emailError = null;
    /**
     * @type {String | null}
     */
    let passwordError = null;
    /**
     * @type {String | null}
     */
    let reenteredPasswordError = null;

    function onRegister() {
        emailError = null;
        passwordError = null;
        reenteredPasswordError = null;

        let isInputValid = true;

        if (email == "") {
            isInputValid = false;
            emailError = "Cannot leave this empty";
        }

        if (password == "") {
            isInputValid = false;
            if (reenteredPassword == "") {
                passwordError = "Cannot leave these empty";
            } else {
                passwordError = "Cannot leave this empty";
            }
        }

        if (password != reenteredPassword) {
            isInputValid = false;
            reenteredPasswordError = "Passwords don't match";
        }

        if (isInputValid) {
            appCtrl.register(email, password);
        }
    }

    function onSwitchToLogin() {
        dispatch('switchToLogin', {});
    }
</script>
<div class="card bg-neutral-800 w-96 rounded-lg">
    <div class="card-body">
        <h1>
            Create a {pageName} account
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
        <SmartTextField
            title="Re-enter password"
            type="password"
            bind:value={reenteredPassword}
            bind:error={reenteredPasswordError}
        />
        <div>
            <button class="login-button btn rounded-lg bg-neutral-300 text-gray-700" on:click={onRegister}>Create account</button>
        </div>
        <div>
            Already have a {pageName} account? <button class="login-button text-blue-600" on:click={onSwitchToLogin}>Log in</button>
        </div>
    </div>
</div>