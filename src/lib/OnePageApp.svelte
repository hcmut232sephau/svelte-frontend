<script>
    import { onDestroy } from "svelte";
    import { ApplicationController } from "./Controllers.js"
    import Dashboard from "./dashboard/Dashboard.svelte";
    import { nonNullAssert } from "./TypeTools";
    import Login from "./authentication/Login.svelte";
    import Register from "./authentication/Register.svelte";
    import UnverifiedEmail from "./authentication/UnverifiedEmail.svelte";
    import AccountTypeSelector from "./authentication/AccountTypeSelector.svelte";

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
    /**
     * @type {"student" | "teacher" | "unselected" | null}
     */
    let accountType;
    const unsubscribeIsRegistering = appCtrl.isRegistering.subscribe((val) => {
        isRegistering = val;
    });
    const unsubscribeUser = appCtrl.user.subscribe((val) => {
        user = val;
    });
    const unsubscribeAccountType = appCtrl.accountType.subscribe((val) => {
        accountType = val;
    });
    onDestroy(() => {
        unsubscribeIsRegistering();
        unsubscribeUser();
        unsubscribeAccountType();
    });

    /**
     * @param {CustomEvent} event
     */
    function onLogout(event) {
        appCtrl.logout();
    }
</script>

{#if user === null}
    <div class="flex justify-center items-center h-screen bg-neutral-950">
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
    </div>
    <!-- Uncomment below if email verification is needed -->
    <!-- {:else if !nonNullAssert(user).emailVerified}
        <UnverifiedEmail
            on:logout={onLogout}
        /> -->
{:else if accountType === null}
    <div class="flex justify-center items-center h-screen bg-neutral-950">
        Loading...
    </div>
{:else if accountType === "unselected"}
    <div class="flex justify-center items-center h-screen bg-neutral-950">
        <AccountTypeSelector
            pageName={pageName}
            appCtrl={appCtrl}
            on:logout={onLogout}
        />
    </div>
{:else}
    <Dashboard
        pageName={pageName}
        on:logout={onLogout}
    />
{/if}
