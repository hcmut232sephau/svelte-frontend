<script>
    import { createEventDispatcher, onDestroy } from 'svelte';
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { UserDataController } from "./UserDataController";
    import { CourseData } from '$lib/CourseController';

    /**
     * @type {AuthenticationController}
     */
    export let authCtrl;
    /**
     * @type {CourseData}
     */
    export let course;

    $: ownerDataCtrl = new UserDataController(authCtrl, course.owner);

    /**
     * @type {UserData | null}
     */
    let userData = null;
    $: ownerDataUnsubscribe = ownerDataCtrl.data.subscribe(e => {
        userData = e;
    });

    const dispatch = createEventDispatcher();

    function onSelect() {
        // dispatch('sidebarSelect', entry);
    }
    
    onDestroy(() => {
        ownerDataUnsubscribe();
        ownerDataCtrl.destroy();
    });
</script>
{#if userData !== null}
    <div class="text-sm">
        Owned by <span class="font-medium">{userData.username}</span>
    </div>
    <div class="text-sm">
        {course.teachers.length} teacher{course.teachers.length == 1 ? "" : "s"} and {course.students.length} student{course.students.length == 1 ? "" : "s"}
    </div>
{/if}