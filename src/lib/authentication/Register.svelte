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
    let error = null;

    /**
     * @type {String | null}
     */
    let emailError = null;
    /**
     * @type {String | null}
     */
    let passwordError = null;

    function onRegister() {
        error = null;
        emailError = null;
        passwordError = null;

        let isInputValid = true;

        if (email == "") {
            isInputValid = false;
            emailError = "Cannot leave email empty";
        }

        if (password == "" || reenteredPassword == "") {
            isInputValid = false;
            passwordError = "Cannot leave password inputs empty";
        }

        if (password != reenteredPassword) {
            isInputValid = false;
            passwordError = "Passwords don't match";
        }

        if (isInputValid) {
            appCtrl.register(email, password)
                .catch(err => {
                    const code = err.code;
                    // const errorMessage = err.message;

                    if (code == "auth/invalid-email") {
                        emailError = "Invalid email";
                    } else if (code == "auth/weak-password") {
                        password = "Password is too weak";
                    } else if (code == "auth/email-already-in-use") {
                        emailError = "Email already used";
                    } else if (code == "auth/invalid-login-credentials" || code == "auth/invalid-credential") {
                        password = "Invalid credentals";
                    } else {
                        error = "Unknown account creation error. Check your inputs and try again later. (error code " + code + ")";
                    }
                });
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
            error={null}
        />
        <SmartTextField
            title="Re-enter password"
            type="password"
            bind:value={reenteredPassword}
            bind:error={passwordError}
        />
        <div>
            <button class="login-button btn rounded-lg bg-neutral-300 text-gray-700" on:click={onRegister}>Create account</button>
        </div>
        {#if error !== null}
            <div class="text-red-500">
                {error}
            </div>
        {/if}
        <div>
            Already have a {pageName} account? <button class="login-button text-blue-600" on:click={onSwitchToLogin}>Log in</button>
        </div>
    </div>
</div>