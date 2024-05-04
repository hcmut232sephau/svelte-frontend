<script>
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { createEventDispatcher } from 'svelte';

    /**
     * @type {AuthenticationController}
     */
    export let authCtrl;

    const dispatch = createEventDispatcher();

    function selectStudentType() {
        authCtrl.setAccountType("student");
    }

    function selectTeacherType() {
        authCtrl.setAccountType("teacher");
    }

    function onLogout() {
        dispatch('logout', {});
    }
</script>
<div class="card bg-neutral-800 w-128 rounded">
    <div class="card-body">
        <h1 class="text-lg font-bold">
            Who are you signing up as?
        </h1>
        <div>
            <button class="PrimaryButton w-full" on:click={selectStudentType}>A student</button>
        </div>
        <div>
            <button class="PrimaryButton w-full" on:click={selectTeacherType}>A teacher</button>
        </div>
        <div>
            Want to <button class="text-blue-600" on:click={onLogout}>log out</button> instead?
        </div>
    </div>
</div>