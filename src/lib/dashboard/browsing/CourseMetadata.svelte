<script>
    import { createEventDispatcher, onDestroy } from 'svelte';
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { UserDataCacheController } from "$lib/UserDataCacheController";
    import { CourseData } from '$lib/CourseController';

    /**
     * @type {UserDataCacheController}
     */
    export let userDataCacheCtrl;
    /**
     * @type {CourseData}
     */
    export let course;

    $: x = userDataCacheCtrl.fetchUserData(course.owner);

    /**
     * @type {UserData | null}
     */
    let userData = null;
    $: ownerDataUnsubscribe = userDataCacheCtrl.cache.subscribe(e => {
        userData = e.get(course.owner) ?? null;
    });

    onDestroy(() => {
        ownerDataUnsubscribe();
    });
</script>
{#if userData !== null}
    <div class="text-sm">
        Owned by <span class="font-medium">{userData.username}</span>
    </div>
{/if}