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
    import {ArrowRightOutline, FileLinesSolid, FileCirclePlusSolid, TrashBinSolid} from "flowbite-svelte-icons"
    import { Timeline, TimelineItem } from 'flowbite-svelte';
    import { CalendarWeekSolid } from 'flowbite-svelte-icons';
    import InlineCourseOwnerView from "./InlineCourseOwnerView.svelte";

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

    $: isOwner = userData?.accountType == "teacher" && user !== null && user != "loggedOut" && user.uid == courseState?.data.owner;
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
    <div class="flex flex-col w-[50vw] mb-8">
        <Card class="bg-neutral-800 border-none mx-auto mt-10 w-[50vw]" size="lg">
            {#if courseState !== null}
                <InlineCourseOwnerView
                    userId={courseState.data.owner}
                    userDataCacheCtrl={userDataCacheCtrl}
                    on:openUserView={event => {
                        userView = event.detail;
                    }}
                />
            {/if}
            <Timeline order="horizontal" class="mx-4 mt-6 mb-2">
                {#each index as i}
                <TimelineItem>
                    <svelte:fragment slot="icon">
                    <div class="flex items-center">
                        <div class="flex z-10 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-0 ring-white dark:bg-primary-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                        <CalendarWeekSolid class="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div class="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700" />
                    </div>
                    </svelte:fragment>
                    <h1 class="text-white text-2xl font-black mt-3 mr-20">{dates[i]}</h1>
                    <p class="whitespace-pre text-wrap">{details[i]}</p>
                </TimelineItem>
                {/each}
            </Timeline>
        </Card>
        {#each index as i}
            <Card class="bg-neutral-800 border-none mx-auto mt-10 pl-none" size="lg">
                <div class="flex">
                    <img src="icons/file-solid.svg" alt="" class="bg-white p-10 mr-8 mt-auto w-[10vw] h-[10vw] rounded max-w-30 max-h-30" />
                    <div class="flex flex-col">
                        <div class="flex-col mb-auto">
                            <h1 class="text-white font-black text-2xl">{titles[i]}</h1>
                            <p class="mt-2 whitespace-pre text-wrap">{notes[i]}</p>
                        </div>
                        <div class="flex">
                            <Button class="mr-4">Open</Button>
                            <Button class="">
                                <TrashBinSolid/>
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        {/each}
        <Card class="bg-neutral-800 border-none mx-auto mt-10 pl-none mb-8 w-[50vw]" size="lg">
            <div class="flex mb-4">
                <h1 class="text-white text-lg font-bold mr-auto">
                    Add document
                </h1>
                <Button class="mr-4">
                    <FileCirclePlusSolid/>
                </Button>
                <Button>Save</Button>
            </div>
            <Input placeholder="Title"  class="bg-neutral-700 text-white mb-4"/>
            <Textarea placeholder="Note" class="bg-neutral-700 text-white h-36"/>
        </Card>
        <CourseSettings
            entry={entry}
            isOwner={isOwner}
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
