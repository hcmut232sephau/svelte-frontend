<script>
    import { onDestroy } from "svelte";
    import { FirebaseController } from "./FirebaseController.js";
    import { AuthenticationController, UserData } from "./AuthenticationController.js"
    import Dashboard from "./dashboard/Dashboard.svelte";
    import Login from "./authentication/Login.svelte";
    import Register from "./authentication/Register.svelte";
    import AccountTypeSelector from "./authentication/AccountTypeSelector.svelte";
    import UsernameSelector from "./authentication/UsernameSelector.svelte";

    const pageName = "Neuroflask";

    let firebaseCtrl = new FirebaseController();
    let authCtrl = new AuthenticationController(firebaseCtrl);

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
    const unsubscribeIsRegistering = authCtrl.isRegistering.subscribe((val) => {
        isRegistering = val;
    });
    const unsubscribeUser = authCtrl.user.subscribe((val) => {
        user = val;
    });
    const unsubscribeUserData = authCtrl.userData.subscribe((val) => {
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
                on:switchToLogin={() => authCtrl.switchToLogin()}
            />
        {:else}
            <Login
                pageName={pageName}
                authCtrl={authCtrl}
                on:switchToRegister={() => authCtrl.switchToRegistering()}
            />
        {/if}
    </div>
{:else if userData === null}
    <div class="flex justify-center items-center h-screen bg-neutral-950">
        Loading...
    </div>
{:else if userData.accountType === "unselected"}
    <div class="flex justify-center items-center h-screen bg-neutral-950">
        <AccountTypeSelector
            pageName={pageName}
            authCtrl={authCtrl}
            on:logout={onLogout}
        />
    </div>
{:else if userData.username === ""}
    <div class="flex justify-center items-center h-screen bg-neutral-950">
        <UsernameSelector
            pageName={pageName}
            authCtrl={authCtrl}
            on:logout={onLogout}
        />
    </div>
{:else}
    <Dashboard
        pageName={pageName}
        authCtrl={authCtrl}
        userData={userData}
        on:logout={onLogout}
    />
{/if}

