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

    $: x = userDataCacheCtrl.fetchUserData(course.teacher);

    /**
     * @type {UserData | null}
     */
    let userData = null;
    $: teacherDataUnsubscribe = userDataCacheCtrl.cache.subscribe(e => {
        userData = e.get(course.teacher) ?? null;
    });

    onDestroy(() => {
        teacherDataUnsubscribe();
    });
</script>
{#if userData !== null}
    <div class="text-sm">
        Taught by <span class="font-medium">{userData.username}</span>
    </div>
{/if}