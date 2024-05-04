<script>
    import { onDestroy } from "svelte";
    import { UserData } from "$lib/AuthenticationController";
    import { createEventDispatcher } from 'svelte';
    import { UserDataCacheController } from "$lib/UserDataCacheController";

    let dispatch = createEventDispatcher();

    /**
     * @type {string}
     */
    export let userId;
    /**
     * @type {UserDataCacheController}
     */
    export let userDataCacheCtrl;

    $: x = userDataCacheCtrl.fetchUserData(userId);

    /**
     * @type {UserData | null}
     */
    let userData = null;
    $: userDataUnsubscribe = userDataCacheCtrl.cache.subscribe(e => {
        userData = e.get(userId) ?? null;
    });

    onDestroy(() => {
        userDataUnsubscribe();
    });

    function onOpenUserView() {
        dispatch("openUserView", userId);
    }
</script>
{#if userData !== null}
    <div class="flex">
        <img src="icons/user-solid.svg" alt="" class="w-14 h-14 bg-white rounded-full p-4">
        <div class="flex flex-col text-l ml-6">
            <div class="flex">
                <button
                    class="mt-auto font-black text-blue-600 text-xl hover:text-blue-800 self-center"
                    on:click={onOpenUserView}
                >
                    {userData.username}
                </button>
                {#if userData.degree != ""}
                    <span class="font-medium text-sm text-gray-300 ml-2 bg-gray-700 px-1 rounded self-center">{userData.degree.toUpperCase()}</span>
                {/if}
            </div>
            <h1 class="mb-auto">
                {userData.formattedAccountType()}
            </h1>
        </div>
    </div>
{/if}