<script>
    import { onDestroy } from "svelte";
    import { ApplicationController, UserData } from "./Controllers.js"
    import Dashboard from "./dashboard/Dashboard.svelte";
    import { nonNullAssert } from "./TypeTools";
    import Login from "./authentication/Login.svelte";
    import Register from "./authentication/Register.svelte";
    import UnverifiedEmail from "./authentication/UnverifiedEmail.svelte";
    import AccountTypeSelector from "./authentication/AccountTypeSelector.svelte";
    import UsernameSelector from "./authentication/UsernameSelector.svelte";

    const pageName = "Neuroflask";

    let appCtrl = new ApplicationController();

    /**
     * @type {boolean}
     */
    let isRegistering;
    /**
     * @type {import("firebase/auth").User | "loggedOut" | null}
     */
    let user;
    /**
     * @type {UserData | null}
     */
    let userData;
    const unsubscribeIsRegistering = appCtrl.isRegistering.subscribe((val) => {
        isRegistering = val;
    });
    const unsubscribeUser = appCtrl.user.subscribe((val) => {
        user = val;
    });
    const unsubscribeUserData = appCtrl.userData.subscribe((val) => {
        userData = val;
    });
    onDestroy(() => {
        unsubscribeIsRegistering();
        unsubscribeUser();
        unsubscribeUserData();
    });

    /**
     * @param {CustomEvent} event
     */
    function onLogout(event) {
        appCtrl.logout();
    }
</script>

{#if (user === null) || ((user !== "loggedOut") && (userData === null))}
    <div class="flex justify-center items-center h-screen bg-neutral-950">
        Loading...
    </div>
{:else if user === "loggedOut"}
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
{:else if userData.accountType === "unselected"}
    <div class="flex justify-center items-center h-screen bg-neutral-950">
        <AccountTypeSelector
            pageName={pageName}
            appCtrl={appCtrl}
            on:logout={onLogout}
        />
    </div>
{:else if userData.username === ""}
    <div class="flex justify-center items-center h-screen bg-neutral-950">
        <UsernameSelector
            pageName={pageName}
            appCtrl={appCtrl}
            on:logout={onLogout}
        />
    </div>
{:else}
    <Dashboard
        pageName={pageName}
        appCtrl={appCtrl}
        userData={userData}
        on:logout={onLogout}
    />
{/if}

