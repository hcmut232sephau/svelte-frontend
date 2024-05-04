<script>
    import { onDestroy } from "svelte";
    import { UserData } from "$lib/AuthenticationController";
    import { createEventDispatcher } from 'svelte';
    import { Card, Button } from 'flowbite-svelte';
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

    function onCloseView() {
        dispatch("closeUserView", {});
    }
</script>
<div class="flex flex-col w-[50vw]">
    <Card class="bg-neutral-800 border-none mx-auto mt-8" size="lg">
        {#if userData === null}
            Loading...
        {:else}
            <div class="flex m-2 mb-6">
                <img src="icons/user-solid.svg" alt="" class="w-16 h-16 bg-white rounded-full p-4">
                <div class="flex flex-col ml-6">
                    <h1 class="mt-auto font-black text-white text-xl">{userData.username}</h1>
                    <h1 class="mb-auto text-l">{userData.formattedAccountType()}</h1>
                </div>
            </div>
            {#if userData.bio != ""}
                <div class="flex flex-col m-2">
                    <h1 class="text-xl font-black text-white">Bio</h1>
                    <p class="mb-4">{userData.bio}</p>
                </div>
            {/if}
            {#if userData.degree != ""}
                <div class="flex flex-col m-2">
                    <h1 class="text-xl font-black text-white">Degree</h1>
                    <p class="mb-4">{userData.degree}</p>
                </div>
            {/if}
        {/if}

        <Button class="mt-2" on:click={onCloseView}>
            Close
        </Button>
    </Card>
</div>
