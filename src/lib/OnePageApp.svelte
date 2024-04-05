<script>
    import { onDestroy } from "svelte";
    import { ApplicationController } from "./Controllers.js"
    import Dashboard from "./Dashboard.svelte";
    import { nonNullAssert } from "./TypeTools";
    import Login from "./authentication/Login.svelte";
    import Register from "./authentication/Register.svelte";
    import UnverifiedEmail from "./authentication/UnverifiedEmail.svelte";

    const pageName = "Neuroflask";

    let appCtrl = new ApplicationController();

    /**
     * @type {boolean}
     */
    let isRegistering;
    /**
     * @type {import("firebase/auth").User | null}
     */
    let user;
    const unsubscribeIsRegistering = appCtrl.isRegistering.subscribe((val) => {
        isRegistering = val;
    });
    const unsubscribeUser = appCtrl.user.subscribe((val) => {
        user = val;
    });
    onDestroy(() => {
        unsubscribeIsRegistering();
        unsubscribeUser();
    });

    /**
     * @param {CustomEvent} event
     */
    function onLogout(event) {
        appCtrl.logout();
    }
</script>
<div class="flex justify-center items-center h-screen bg-neutral-950">
    {#if user === null}
        {#if isRegistering}
            <Register
                pageName={pageName}
                appCtrl={appCtrl}
                on:switchToLogin={() => appCtrl.switchToLogin()}
            />
        {:else}
            <Login
                pageName={pageName}
                appCtrl={appCtrl}
                on:switchToRegister={() => appCtrl.switchToRegistering()}
            />
        {/if}
    <!-- Uncomment below if email verification is needed -->
    <!-- {:else if !nonNullAssert(user).emailVerified}
        <UnverifiedEmail
            on:logout={onLogout}
        /> -->
    {:else}
        <Dashboard
            on:logout={onLogout}
        />
    {/if}
</div>