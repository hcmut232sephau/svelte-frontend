<script>
    import { onDestroy } from "svelte";
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { CourseController, CourseData, CourseState } from "$lib/CourseController";
    import { createEventDispatcher } from 'svelte';
    import { Card, Button, Input, Textarea} from 'flowbite-svelte';
    import { SideBarCourseEntry } from "../sidebar/States";
    import CourseSettings from "./CourseSettings.svelte";
    import { UserDataCacheController } from "$lib/UserDataCacheController";
    import UserView from "./UserView.svelte";
    import {ArrowRightOutline, FileLinesSolid, FileCirclePlusSolid, TrashBinSolid, FileWordSolid} from "flowbite-svelte-icons"
    import { CalendarWeekSolid } from 'flowbite-svelte-icons';
    import InlineCourseTeacherView from "./InlineCourseTeacherView.svelte";

    let dispatch = createEventDispatcher();

    /**
     * @type {AuthenticationController}
     */
    export let authCtrl;
    /**
     * @type {UserDataCacheController}
     */
    export let userDataCacheCtrl;
    /**
     * @type {CourseController}
     */
    export let courseCtrl;
    /**
     * @type {SideBarCourseEntry}
     */
    export let entry;

    /**
     * @type {import("firebase/auth").User | "loggedOut" | null}
     */
    let user = null;
    /**
     * @type {UserData | null}
     */
    let userData = null;
    /**
     * @type {CourseState | null}
     */
    let courseState = null;
    const unsubscribeUser = authCtrl.user.subscribe(val => {
        user = val;
    });
    const unsubscribeUserData = authCtrl.userData.subscribe(val => {
        userData = val;
    });
    const unsubscribeCourseData = courseCtrl.courses.subscribe(val => {
        courseState = val?.find(e => e.data.id == entry.course.id) ?? null;
    });

    $: isTeacher = userData?.accountType == "teacher" && user !== null && user != "loggedOut";

    onDestroy(() => {
        unsubscribeUser();
        unsubscribeUserData();
        unsubscribeCourseData();
    });

    /**
     * @type {string | null}
     */
    let userView = null;
    
    let titles = ["Introduction", "Course info"]
    let notes = ["Introduction to the course", "Grading, criteria, resources"]
    let index = [0, 1]
    let dates = ["Tue May 13", "Thur May 15"]
    let details = ["Room 306\nBuilding B4", "https://meet.google.com/sasf-sfs-wtw"]

</script>
{#if userView == null}
    <div class="flex flex-col w-[50vw] mb-8 mx-auto">
        {#if courseState !== null}
            <Card class="bg-neutral-800 border-none mx-auto mt-8" size="lg">
                <InlineCourseTeacherView
                    userId={courseState.data.teacher}
                    userDataCacheCtrl={userDataCacheCtrl}
                    on:openUserView={event => {
                        userView = event.detail;
                    }}
                />
            </Card>
        {/if}
        <Card class="bg-neutral-800 border-none mx-auto mt-8" size="lg">
            <h1 class="text-white text-lg font-bold mr-auto">
                Schedule
            </h1>
            {#each index as i}
                <Card class="bg-neutral-700 border-none mx-auto mt-2" size="lg">
                    <h1 class="text-gray-200 text-l font-bold mr-auto">{dates[i]}</h1>
                    <p class="mt-2 text-gray-300 whitespace-pre-wrap text-sm break-words">{details[i]}</p>
                    <div class="flex mt-4">
                        <Button class="mr-2">Open link</Button>
                        <Button class="px-3 bg-red-700">
                            <TrashBinSolid class="mr-2"/> Delete
                        </Button>
                    </div>
                </Card>
            {/each}
            {#if isTeacher}
                <Input placeholder="dd/mm/yy" class="bg-neutral-700 text-white mt-4"/>
                <Textarea placeholder="Detail" class="bg-neutral-700 text-white mt-2"/>
                <Button class="mt-2">Add</Button>
            {/if}
        </Card>
        <Card class="bg-neutral-800 border-none mx-auto mt-8" size="lg">
            <h1 class="text-white text-lg font-bold mr-auto">
                Notes
            </h1>
            {#each index as i}
                <Card class="bg-neutral-700 border-none mx-auto mt-2" size="lg">
                    <h1 class="flex items-center text-gray-200 text-l font-bold mr-auto">
                        <FileLinesSolid class="mr-2"/> {titles[i]}
                    </h1>
                    <p class="mt-2 text-gray-300 whitespace-pre-wrap text-sm break-words">{notes[i]}</p>
                    <div class="flex mt-4">
                        <Button class="mr-2">Open link</Button>
                        <Button class="px-3 bg-red-700">
                            <TrashBinSolid class="mr-2"/> Delete
                        </Button>
                    </div>
                </Card>
            {/each}
            {#if isTeacher}
                <Input placeholder="dd/mm/yy" class="bg-neutral-700 text-white mt-4"/>
                <Textarea placeholder="Detail" class="bg-neutral-700 text-white mt-2"/>
                <Button class="mt-2">Add</Button>
            {/if}
        </Card>
        <CourseSettings
            entry={entry}
            isTeacher={isTeacher}
            on:updateCourseIdentity
            on:deleteCourse
            on:leaveCourse
        />
    </div>
{:else}
    <UserView
        userId={userView}
        userDataCacheCtrl={userDataCacheCtrl}
        on:closeUserView={() => {
            userView = null;
        }}
    />
{/if}
