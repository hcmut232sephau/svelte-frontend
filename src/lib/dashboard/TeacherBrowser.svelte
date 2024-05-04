<script>
    import { onDestroy } from "svelte";
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { CourseController, CourseData, CourseState } from "$lib/CourseController";
    import { createEventDispatcher } from 'svelte';
    import { Card, Button, Input } from 'flowbite-svelte';
    import CourseMetadata from "./browsing/CourseMetadata.svelte";
    import { UserDataCacheController } from "$lib/UserDataCacheController";
    import { TeacherListController } from "$lib/TeacherListController";

    /**
     * @type {AuthenticationController}
     */
    export let authCtrl;
    /**
     * @type {UserDataCacheController}
     */
    export let userDataCacheCtrl;

    let teacherListController = new TeacherListController(authCtrl.firebaseCtrl);

    /**
     * @type {UserData[] | null}
     */
    let teachers = null;
    let unsubscribeTeachers = teacherListController.teachers.subscribe(val => {
        teachers = val;
    });
    onDestroy(() => {
        unsubscribeTeachers();
    });

</script>
<div class="flex flex-col h-full mt-16 w-[50vw]">
    {#if teachers == null}
        <h1 class="text-lg font-bold">
            Loading teachers...
        </h1>
    {:else}
        <h1 class="text-lg font-bold">
            Teachers
        </h1>
        {#each teachers as teacher}
            <Card class="mx-auto mt-4 bg-neutral-800 border-none" size="md">
                <div class="flex items-center">
                    <img src="icons/user-solid.svg" alt="" class="w-14 h-14 bg-white rounded-full p-4">
                    <div class="ml-4">
                        <div class="text-l">
                            <span class="font-bold text-white">{teacher.username}</span>
                            {#if teacher.degree != ""}
                                <span class="font-medium text-sm text-gray-300 ml-1 bg-gray-700 px-1 rounded">{teacher.degree.toUpperCase()}</span>
                            {/if}
                        </div>
                        <div class="flex items-center">
                            <span class="text-gray-400">{teacher.bio}</span>
                        </div>
                    </div>
                </div>
            </Card>
        {/each}
    {/if}
</div>

