<script>
    import { createEventDispatcher, onDestroy } from "svelte";
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { Card, Button, Input } from 'flowbite-svelte';
    import { SingleCourseController } from "$lib/SingleCourseController";
    import { UserDataCacheController } from "$lib/UserDataCacheController";

    let dispatch = createEventDispatcher();

    /**
     * @type {SingleCourseController}
     */
    export let singleCourseCtrl;

    $: _ = singleCourseCtrl.updateStudents();

    /**
     * @type {UserData[] | null}
     */
    let students = null;
    let unsubscribeStudents = singleCourseCtrl.students.subscribe(val => {
        students = val;
    });
    onDestroy(() => {
        unsubscribeStudents();
        singleCourseCtrl.ditchStudentCache();
    });

    function onClose() {
        dispatch("close", {});
    }
</script>
<div class="flex flex-col h-full mt-16 w-[50vw]">
    <div class="flex items-center">
        <h1 class="text-lg font-bold mr-auto">
            {#if students == null}
                Loading students...
            {:else}
                Students
            {/if}
        </h1>
        <Button class="px-3" on:click={onClose}>
            Close
        </Button>
    </div>
    {#if students != null}
        {#each students as student}
            <Card class="mx-auto mt-4 bg-neutral-800 border-none" size="md">
                <div class="flex items-center">
                    <img src="icons/user-solid.svg" alt="" class="w-14 h-14 bg-white rounded-full p-4">
                    <div class="ml-4">
                        <div class="text-l">
                            <span class="font-bold text-white">{student.username}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="text-gray-400">{student.bio}</span>
                        </div>
                    </div>
                </div>
            </Card>
        {/each}
    {/if}
</div>

