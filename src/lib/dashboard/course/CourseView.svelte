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
    <div class="flex flex-col w-[50vw] mb-8 mx-auto pl-16">
        <Card class="bg-neutral-800 border-none mx-auto mt-10 " size="lg">
            {#if courseState !== null}
                <InlineCourseOwnerView
                    userId={courseState.data.owner}
                    userDataCacheCtrl={userDataCacheCtrl}
                    on:openUserView={event => {
                        userView = event.detail;
                    }}
                />
            {/if}
            <Timeline order="vertical" class="mx-4 mt-6 mb-2">
                {#each index as i}
                <TimelineItem>
                    <svelte:fragment slot="icon">
                        <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
                            <CalendarWeekSolid class="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </span>
                    </svelte:fragment>
                    <div class="flex ml-2">
                        <h1 class="text-white text-xl font-bold mr-auto">{dates[i]}</h1>
                        <Button class="bg-red-700 px-3"><TrashBinSolid/></Button>
                    </div>
                    <p class="whitespace-pre-wrap break-words ml-2">{details[i]}</p>
                </TimelineItem>
                {/each}
            </Timeline>
            <Input  placeholder="dd/mm/yy" class="bg-neutral-700 text-white my-2"/>
            <Textarea  placeholder="Detail" class="bg-neutral-700 text-white mb-2"/>
            <Button>Add</Button>
        </Card>
        {#each index as i}
            <Card class="bg-neutral-800 border-none mx-auto mt-10 pl-none" size="lg">
                <div class="flex-col mx-2">
                    <div class="flex mb-2">
                        <h1 class="text-white font-black text-xl mr-auto">{titles[i]}</h1>
                        <img src="icons/file-solid.svg" alt="" class=" invert w-8 h-8 " />
                    </div>
                    <p class="mb-8 whitespace-pre text-wrap">{notes[i]}</p>
                    <div class="flex flex-col">
                        <div class="flex-col mb-auto">
                        </div>
                        <div class="flex">
                            <Button class="mr-2">Open</Button>
                            <Button class="px-3 bg-red-700">
                                <TrashBinSolid/>
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        {/each}
        <Card class="bg-neutral-800 border-none mx-auto mt-10 pl-none mb-8 " size="lg">
            <div class="flex mb-4">
                <h1 class="text-white text-lg font-bold mr-auto">
                    Add document
                </h1>
                <Button class="mr-2 px-3">
                    <FileCirclePlusSolid/>
                </Button>
                <Button class="">Add</Button>
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
