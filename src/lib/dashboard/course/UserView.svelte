<script>
    import { onDestroy } from "svelte";
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { CourseController, CourseData, CourseState } from "$lib/CourseController";
    import { createEventDispatcher } from 'svelte';
    import { Card, Button, Input } from 'flowbite-svelte';
    import { SideBarCourseEntry } from "../sidebar/States";
    import CourseSettings from "./CourseSettings.svelte";
    import { UserDataCacheController } from "$lib/UserDataCacheController";

    /**
     * @param {"student" | "teacher" | "unselected"} type
     */
    function formatAccountType(type) {
        switch (type) {
            case "student": return "Student";
            case "teacher": return "Teacher";
            case "unselected": return "Unselected";
        }
    }


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
    <Card class="bg-neutral-800 border-none mx-auto mt-10" size="lg">
        <div>User</div>
        {#if userData === null}
            Loading...
        {:else}
            {userData.username} ({formatAccountType(userData.accountType)})
        {/if}

        <Button class="my-2" on:click={onCloseView}>
            Close
        </Button>
    </Card>
</div>
