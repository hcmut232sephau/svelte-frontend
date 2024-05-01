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
        {#if userData === null}
            Loading...
        {:else}
            <div class="flex m-8">
                <img src="icons/user-solid.svg" alt="" class="w-24 h-24 bg-white rounded-full p-8">
                <div class="flex flex-col ml-10">
                    <h1 class="mt-auto mb-2 font-black text-white text-2xl">{userData.username}</h1>
                    <h1 class="mb-auto text-xl">{formatAccountType(userData.accountType)}</h1>
                </div>
            </div>
            <div class="flex flex-col m-8">
                <h1 class="text-xl font-black text-white">Date of birth</h1>
                <p class="mb-4">Jan 1, 1990</p>
                <h1 class="text-xl font-black text-white">Email</h1>
                <p class="mb-4">username@exmaple.com</p>
                {#if userData.accountType == "student"}
                    <h1 class="text-xl font-black text-white">Major</h1>
                    <p class="mb-4">Computer Science</p>
                {/if}
                {#if userData.accountType == "teacher"}
                    <h1 class="text-xl font-black text-white">Degree</h1>
                    <p class="mb-4">Computer Science</p>
                {/if}
            </div>
        {/if}

        <Button class="my-2" on:click={onCloseView}>
            Close
        </Button>
    </Card>
</div>
