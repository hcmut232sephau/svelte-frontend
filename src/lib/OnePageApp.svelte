<script>
    import { ApplicationController } from "./ApplicationController"
    import Dashboard from "./Dashboard.svelte";
    import Login from "./authentication/Login.svelte";
    import Register from "./authentication/Register.svelte";
    import UnverifiedEmail from "./authentication/UnverifiedEmail.svelte";

    let appCtrl = new ApplicationController();

    /**
     * @param {CustomEvent} event
     */
    function onRegister(event) {
        console.log(event.detail);
    }

    /**
     * @param {CustomEvent} event
     */
    function onLogin(event) {
        console.log(event.detail);
    }

    function onSwitchToLogin() {
        appCtrl.isUserRegistering = false;
    }

    function onSwitchToRegister() {
        appCtrl.isUserRegistering = true;
    }
</script>
{#if appCtrl.isUserRegistering}
    <Register
        on:register={onRegister}
        on:switchToLogin={onSwitchToLogin}
    />
{:else if appCtrl.user === null}
    <Login
        on:login={onLogin}
        on:switchToRegister={onSwitchToRegister}
    />
{:else if !appCtrl.user.emailVerified}
    <UnverifiedEmail />
{:else}
    <Dashboard />
{/if}
