<script>
    import { onDestroy } from "svelte";
    import { FirebaseController } from "./FirebaseController.js";
    import { AuthenticationController, UserData } from "./AuthenticationController.js"
    import Dashboard from "./dashboard/Dashboard.svelte";
    import Login from "./authentication/Login.svelte";
    import Register from "./authentication/Register.svelte";
    import AccountTypeSelector from "./authentication/AccountTypeSelector.svelte";
    import PersonalInfoSelector from "./authentication/PersonalInfoSelector.svelte";
    import { UserDataCacheController } from "./UserDataCacheController.js";

    const pageName = "Neuroflask";

    let firebaseCtrl = new FirebaseController();
    let userDataCacheCtrl = new UserDataCacheController(firebaseCtrl);
    let authCtrl = new AuthenticationController(firebaseCtrl, userDataCacheCtrl);

    let isRegistering = false;

    /**
     * @type {import("firebase/auth").User | "loggedOut" | null}
     */
    let user;
    /**
     * @type {UserData | null}
     */
    let userData = null;
    const unsubscribeUser = authCtrl.user.subscribe(val => {
        user = val;
    });
    const unsubscribeUserData = authCtrl.userData.subscribe(val => {
        userData = val;
    });
    onDestroy(() => {
        unsubscribeUser();
        unsubscribeUserData();
    });

    // Account type is left out, we have a separate screen for it
    $: isUserDataIncomplete = userData != null && (userData.username == "" || userData.bio == "");

    /**
     * @param {CustomEvent} event
     */
    function onLogout(event) {
        authCtrl.logout();
    }
</script>

{#if user === null}
    <div class="flex justify-center items-center h-screen bg-neutral-950">
        Authenticating...
    </div>
{:else if user === "loggedOut"}
    <div class="flex justify-center items-center h-screen bg-neutral-950">
        {#if isRegistering}
            <Register
                pageName={pageName}
                authCtrl={authCtrl}
                on:switchToLogin={() => isRegistering = false}
            />
        {:else}
            <Login
                pageName={pageName}
                authCtrl={authCtrl}
                on:switchToRegister={() => isRegistering = true}
            />
        {/if}
    </div>
{:else if userData === null}
    <div class="flex justify-center items-center h-screen bg-neutral-950">
        Loading...
    </div>
{:else if isUserDataIncomplete}
    <div class="flex justify-center items-center h-screen bg-neutral-950">
        <PersonalInfoSelector
            pageName={pageName}
            authCtrl={authCtrl}
            userData={userData}
            on:logout={onLogout}
        />
    </div>
{:else if userData.accountType === "unset"}
    <div class="flex justify-center items-center h-screen bg-neutral-950">
        <AccountTypeSelector
            pageName={pageName}
            authCtrl={authCtrl}
            on:logout={onLogout}
        />
    </div>
{:else}
    <Dashboard
        pageName={pageName}
        authCtrl={authCtrl}
        userDataCacheCtrl={userDataCacheCtrl}
        on:logout={onLogout}
    />
{/if}

