<script>
    import { onDestroy } from "svelte";
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { CourseController, CourseData, CourseState } from "$lib/CourseController";
    import { createEventDispatcher } from 'svelte';
    import { Card } from 'flowbite-svelte';
    import CourseSettings from "./CourseSettings.svelte";
    import { UserDataCacheController } from "$lib/UserDataCacheController";
    import UserView from "./UserView.svelte";
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
     * @type {string}
     */
    export let courseId;

    /**
     * @type {string | null}
     */
    let previousCourseId = null;

    /**
     * @type {CourseState | null}
     */
    let courseState = null;

    let unsubscribeCourseState = courseCtrl.courses.subscribe(e => {
        courseState = e?.find(f => f.data.id == courseId) ?? null;
    });

    /**
     * @type {import("firebase/auth").User | "loggedOut" | null}
     */
    let user = null;
    /**
     * @type {UserData | null}
     */
    let userData = null;
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

    $: {
        if (courseId != previousCourseId) {
            previousCourseId = courseId;
            courseState = get(courseCtrl.courses)?.find(f => f.data.id == courseId) ?? null;
            let nextCtrl = (courseState === null) ? null : new SingleCourseController(authCtrl, courseState.data);
            if (nextCtrl !== null) {
                if (singleCourseCtrl !== null) {
                    if (unsubscribeCourseSchedules !== null) {
                        unsubscribeCourseSchedules();
                    }
                    if (unsubscribeCourseNotes !== null) {
                        unsubscribeCourseNotes();
                    }
                }
            }
            singleCourseCtrl = nextCtrl;
            if (singleCourseCtrl !== null) {
                unsubscribeCourseSchedules = singleCourseCtrl.schedules.subscribe(e => {
                    schedules = e;
                });
                unsubscribeCourseNotes = singleCourseCtrl.notes.subscribe(e => {
                    notes = e;
                });
            }
        }
    }

    const unsubscribeUser = authCtrl.user.subscribe(val => {
        user = val;
    });
    const unsubscribeUserData = authCtrl.userData.subscribe(val => {
        userData = val;
    });

    $: isTeacher = userData?.accountType == "teacher" && user !== null && user != "loggedOut";

    onDestroy(() => {
        unsubscribeUser();
        unsubscribeUserData();
        unsubscribeCourseState();
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

    /**
     * @param {CustomEvent} event
     */
    function onAddSchedule(event) {
        singleCourseCtrl?.addScheduleAsTeacher(event.detail.title, event.detail.description, event.detail.link);
    }

    /**
     * @param {CustomEvent} event
     */
    function onDeleteSchedule(event) {
        singleCourseCtrl?.deleteScheduleAsTeacher(event.detail);
    }

    /**
     * @param {CustomEvent} event
     */
    function onAddNote(event) {
        singleCourseCtrl?.addNoteAsTeacher(event.detail.title, event.detail.description, event.detail.link);
    }

    /**
     * @param {CustomEvent} event
     */
    function onDeleteNote(event) {
        singleCourseCtrl?.deleteNoteAsTeacher(event.detail);
    }

    /**
     * @param {CustomEvent} event
     */
    function onOpenLink(event) {
        /**
         * @type {string}
         */
        let url = event.detail;
        if (!url.startsWith("https://") && !url.startsWith("http://")) {
            url = "https://" + url;
        }
        window.open(url, '_blank')?.focus();
    }
</script>
{#if userView !== null}
    <UserView
        userId={userView}
        userDataCacheCtrl={userDataCacheCtrl}
        on:closeUserView={() => {
            userView = null;
        }}
    />
{:else if courseState !== null && singleCourseCtrl !== null}
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
        schedules={schedules}
        isTeacher={isTeacher}
        on:addSchedule={onAddSchedule}
        on:deleteSchedule={onDeleteSchedule}
        on:openLink={onOpenLink}
    />
    <Notes
        notes={notes}
        isTeacher={isTeacher}
        on:addNote={onAddNote}
        on:deleteNote={onDeleteNote}
        on:openLink={onOpenLink}
    />
    <CourseSettings
        courseData={courseState.data}
        isTeacher={isTeacher}
        on:updateCourseIdentity
        on:deleteCourse
        on:leaveCourse
    />
{/if}
