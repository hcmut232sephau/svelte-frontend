<script>
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

    // function selectStudentType() {
    //     appCtrl.changeAccountType("student");
    // }

    function selectTeacherType() {
        appCtrl.changeAccountType("teacher");
    }

    function onLogout() {
        dispatch('logout', {});
    }
</script>
<div class="card bg-neutral-800 w-128 rounded">
    <div class="card-body">
        <h1 class="text-lg font-bold">
            Select your {pageName} account type
        </h1>
        <!-- <div>
            <button class="PrimaryButton w-full" on:click={selectStudentType}>Student</button>
        </div> -->
        <div>
            <button class="PrimaryButton w-full" on:click={selectTeacherType}>Teacher</button>
        </div>
        <div>
            Want to <button class="text-blue-600" on:click={onLogout}>log out</button> instead?
        </div>
    </div>
</div>