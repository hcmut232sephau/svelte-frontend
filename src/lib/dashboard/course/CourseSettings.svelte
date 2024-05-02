<script>
    import { createEventDispatcher } from 'svelte';
    import { Card, Button, Input } from 'flowbite-svelte';
    import InputError from '$lib/ui/InputError.svelte';
    import { CourseData } from '$lib/CourseController';

    let dispatch = createEventDispatcher();

    /**
     * @type {CourseData}
     */
    export let courseData;
    /**
     * @type {boolean}
     */
    export let isTeacher;
    
    $: courseCode = courseData.courseCode;
    $: courseName = courseData.courseName;

    /**
     * @type {String | null}
     */
    let courseCodeError = null;
    /**
     * @type {String | null}
     */
    let courseNameError = null;

    function onUpdateCourseIdentity() {
        courseCodeError = null;
        courseNameError = null;

        let isInputValid = true;

        if (courseCode == "") {
            isInputValid = false;
            courseCodeError = "Cannot leave this empty";
        }

        if (courseCode.length > 10) {
            isInputValid = false;
            courseNameError = "Cannot use more than 10 characters";
        }

        if (courseName == "") {
            isInputValid = false;
            courseNameError = "Cannot leave this empty";
        }

        if (courseName.length > 72) {
            isInputValid = false;
            courseNameError = "Cannot use more than 72 characters";
        }

        if (isInputValid) {
            dispatch("updateCourseIdentity", {
                id: courseData.id,
                courseCode: courseCode,
                courseName: courseName
            });
        }
    }

    function onDeleteCourse() {
        dispatch("deleteCourse", courseData.id);
    }

    function onLeaveCourse() {
        dispatch("leaveCourse", courseData.id);
    }
</script>
{#if isTeacher}
    <Card class="bg-neutral-800 border-none mx-auto mt-8" size="lg">
        <h1 class="text-white text-lg font-bold">
            Course settings
        </h1>
        <div class="flex mt-2">Course code</div>
        <div class="flex mt-2">
            <Input
                class="bg-neutral-700 text-white"
                placeholder="Course code"
                value={courseCode}
                on:input={e => {
                    if (e.target != null) {
                        // @ts-ignore
                        courseCode = e.target.value;
                    }
                }}
            />
        </div>
        <div>
            <InputError error={courseCodeError}/>
        </div>
        <div class="mt-2">Course name</div>
        <div class="flex mt-2">
            <Input
                class="bg-neutral-700 text-white"
                placeholder="Course name"
                value={courseName}
                on:input={e => {
                    if (e.target != null) {
                        // @ts-ignore
                        courseName = e.target.value;
                    }
                }}
            />
        </div>
        <div>
            <InputError error={courseNameError}/>
        </div>
        <Button 
            class="mt-4"
            on:click={onUpdateCourseIdentity}
        >
            Save
        </Button>
    </Card>
    <Card class="bg-neutral-800 border-none mx-auto mt-8" size="lg">
        <h1 class="text-white text-lg font-bold">
            Course management
        </h1>
        <Button class="mt-4 bg-red-800" on:click={onDeleteCourse}>
            Delete course
        </Button>
    </Card>
{:else}
    <Card class="bg-neutral-800 border-none mx-auto mt-8" size="lg">
        <Button class="bg-red-800" on:click={onLeaveCourse}>
            Leave course
        </Button>
    </Card>
{/if}