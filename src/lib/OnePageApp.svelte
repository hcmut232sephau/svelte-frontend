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
    function onRegister(event) {
        const detail = event.detail;

        console.log("onRegister", detail);
        console.log("Calling Firebase");

        appCtrl.register(detail.email, detail.password);
    }

    /**
     * @param {CustomEvent} event
     */
     function onLogin(event) {
        const detail = event.detail;

        console.log("onLogin", detail);
        console.log("Calling Firebase");

        appCtrl.login(detail.email, detail.password);
    }

    /**
     * @param {CustomEvent} event
     */
    function onLogout(event) {
        console.log("onLogout", event.detail);
        console.log("Calling Firebase");

        appCtrl.logout();
    }
</script>
<div class="flex justify-center items-center h-screen bg-neutral-950">
    {#if user === null}
        {#if isRegistering}
            <Register
                pageName={pageName}
                on:register={onRegister}
                on:switchToLogin={() => appCtrl.switchToLogin()}
            />
        {:else}
            <Login
                pageName={pageName}
                on:login={onLogin}
                on:switchToRegister={() => appCtrl.switchToRegistering()}
            />
        {/if}
    {:else if !nonNullAssert(user).emailVerified}
        <UnverifiedEmail
            on:logout={onLogout}
        />
    {:else}
        <Dashboard
            on:logout={onLogout}
        />
    {/if}
</div>