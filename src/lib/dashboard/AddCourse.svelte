<script>
    import { CourseController } from '$lib/CourseController';
    import { createEventDispatcher } from 'svelte';
    import { Card, Button, Input } from 'flowbite-svelte';
    import InputError from '$lib/ui/InputError.svelte';

    let dispatch = createEventDispatcher();
    
    let courseCode = "";
    let courseName = "";

    /**
     * @type {String | null}
     */
    let courseCodeError = null;
    /**
     * @type {String | null}
     */
    let courseNameError = null;

    function onAddCourse() {
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
            // courseCtrl.addCourseAsTeacher(courseCode, courseName);
            dispatch("addCourse", {courseCode, courseName});
        }
    }
</script>
<div class="flex flex-col w-[50vw]">
    <Card class="bg-neutral-800 border-none mx-auto mt-8" size="lg">
        <div>Course code</div>
        <div class="flex mt-2">
            <Input
                class="bg-neutral-700 text-white"
                bind:value={courseCode}
            />
            <InputError error={courseCodeError}/>
        </div>
        <div class="mt-2">Course name</div>
        <div class="flex mt-2">
            <Input
                class="bg-neutral-700 text-white"
                bind:value={courseName}
            />
            <InputError error={courseNameError}/>
        </div>
        <Button class="flex mt-4" on:click={onAddCourse}>Add</Button>
    </Card>
</div>

