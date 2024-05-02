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
    import { FileLinesSolid, TrashBinSolid } from "flowbite-svelte-icons"
    import InlineCourseTeacherView from "./InlineCourseTeacherView.svelte";
    import { CourseNote, CourseSchedule, SingleCourseController } from "$lib/SingleCourseController";
    import Schedules from "./Schedules.svelte"
    import Notes from "./Notes.svelte";
    import { get } from "svelte/store";

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
    /**
     * @type {SingleCourseController | null}
     */
    let singleCourseCtrl = null;
    /**
     * @type {CourseSchedule[] | null}
     */
     let schedules = null;
    /**
     * @type {CourseNote[] | null}
     */
    let notes = null;
    /**
     * @type {import("svelte/store").Unsubscriber | null}
     */
    let unsubscribeCourseSchedules = null;
    /**
     * @type {import("svelte/store").Unsubscriber | null}
     */
    let unsubscribeCourseNotes = null;

    const unsubscribeUser = authCtrl.user.subscribe(val => {
        user = val;
    });
    const unsubscribeUserData = authCtrl.userData.subscribe(val => {
        userData = val;
    });
    const unsubscribeCourseData = courseCtrl.courses.subscribe(val => {
        courseState = val?.find(e => e.data.id == entry.course.id) ?? null;
        let nextCtrl = (courseState === null) ? null : new SingleCourseController(authCtrl, courseState.data);
        if (nextCtrl !== null) {
            if (singleCourseCtrl !== null) {
                nextCtrl.schedules.set(get(singleCourseCtrl.schedules));
                nextCtrl.notes.set(get(singleCourseCtrl.notes));
                singleCourseCtrl.destroy();
                if (unsubscribeCourseSchedules !== null) {
                    unsubscribeCourseSchedules();
                }
                if (unsubscribeCourseNotes !== null) {
                    unsubscribeCourseNotes();
                }
            }
            unsubscribeCourseSchedules = nextCtrl.schedules.subscribe(e => {
                schedules = e;
            });
            unsubscribeCourseNotes = nextCtrl.notes.subscribe(e => {
                notes = e;
            });
        }
        singleCourseCtrl = nextCtrl;
    });

    $: isTeacher = userData?.accountType == "teacher" && user !== null && user != "loggedOut";

    onDestroy(() => {
        unsubscribeUser();
        unsubscribeUserData();
        unsubscribeCourseData();
        if (singleCourseCtrl !== null) {
            singleCourseCtrl.destroy();
        }
        if (unsubscribeCourseSchedules !== null) {
            unsubscribeCourseSchedules();
        }
        if (unsubscribeCourseNotes !== null) {
            unsubscribeCourseNotes();
        }
    });

    /**
     * @type {string | null}
     */
    let userView = null;
</script>
{#if courseState !== null && singleCourseCtrl !== null}
    <Card class="bg-neutral-800 border-none mx-auto mt-8" size="lg">
        <InlineCourseTeacherView
            userId={courseState.data.teacher}
            userDataCacheCtrl={userDataCacheCtrl}
            on:openUserView={event => {
                userView = event.detail;
            }}
        />
    </Card>
    <Schedules
        singleCourseCtrl={singleCourseCtrl}
        isTeacher={isTeacher}
    />
    <Notes
        singleCourseCtrl={singleCourseCtrl}
        isTeacher={isTeacher}
    />
    <CourseSettings
        entry={entry}
        isTeacher={isTeacher}
        on:updateCourseIdentity
        on:deleteCourse
        on:leaveCourse
    />
{:else if userView !== null}
    <UserView
        userId={userView}
        userDataCacheCtrl={userDataCacheCtrl}
        on:closeUserView={() => {
            userView = null;
        }}
    />
{/if}
