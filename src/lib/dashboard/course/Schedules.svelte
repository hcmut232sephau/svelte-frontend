<script>
    import { CourseSchedule, SingleCourseController } from "$lib/SingleCourseController";
    import InputError from '$lib/ui/InputError.svelte';
    import { Button, Card, Input, Textarea } from "flowbite-svelte";
    import { AngleDownOutline, AngleRightOutline, CalendarWeekSolid, TrashBinSolid } from "flowbite-svelte-icons";
    import { onDestroy } from "svelte";

    /**
     * @param {string} url
     */
    function openInNewTab(url) {
        window.open(url, '_blank')?.focus();
    }

    /**
     * @type {SingleCourseController}
     */
    export let singleCourseCtrl;
    /**
     * @type {boolean}
     */
    export let isTeacher;

    /**
     * @type {CourseSchedule[] | null}
     */
    let schedules = null;
    let unsubscribeSchedules = singleCourseCtrl.schedules.subscribe(e => {
        schedules = e;
    });

    let showAdd = false;

    let title = "";
    let description = "";
    let link = "";

    /**
     * @type {String | null}
     */
    let titleError = null;
    /**
     * @type {String | null}
     */
    let descriptionError = null;
    /**
     * @type {String | null}
     */
    let linkError = null;

    function onAddSchedule() {
        titleError = null;
        descriptionError = null;
        linkError = null;
        
        let isInputValid = true;

        if (title == "") {
            isInputValid = false;
            titleError = "Cannot leave this empty";
        }

        if (title.length > 144) {
            isInputValid = false;
            titleError = "Cannot use more than 144 characters";
        }

        if (description.length > 2048) {
            isInputValid = false;
            descriptionError = "Cannot use more than 2048 characters";
        }


        if (link.length > 2048) {
            isInputValid = false;
            linkError = "Cannot use more than 2048 characters";
        }

        if (isInputValid) {
            singleCourseCtrl.addScheduleAsTeacher(title, description, link);
        }
    }

    onDestroy(() => {
        unsubscribeSchedules();
    });
</script>
<Card class="bg-neutral-800 border-none mx-auto mt-8" size="lg">
    {#if schedules === null}
        <h1 class="text-white text-lg font-bold mr-auto">
            Loading schedules...
        </h1>
    {:else}
        <h1 class="text-white text-lg font-bold mr-auto">
            {#if schedules.length == 0}
                No schedules
            {:else}
                Schedules
            {/if}
        </h1>
        {#each schedules as schedule}
            <Card class="bg-neutral-700 border-none mx-auto mt-2" size="lg">
                <h1 class="flex items-center text-gray-200 text-l font-bold mr-auto">
                    <CalendarWeekSolid class="mr-2"/> {schedule.title}
                </h1>
                <p class="mt-2 text-gray-300 whitespace-pre-wrap text-sm break-words">{schedule.description}</p>
                {#if schedule.link != ""}
                    <p class="mt-2 text-gray-300 whitespace-pre-wrap text-sm break-words">Link: {schedule.link}</p>
                {/if}
                <div class="flex mt-4">
                    {#if schedule.link != ""}
                        <Button class="mr-2" on:click={() => {
                            openInNewTab(schedule.link);
                        }}>
                            Open link
                        </Button>
                    {/if}
                    <Button class="px-3 bg-red-700" on:click={() => {
                        singleCourseCtrl.deleteScheduleAsTeacher(schedule.id);
                    }}>
                        <TrashBinSolid class="mr-2"/> Delete
                    </Button>
                </div>
            </Card>
        {/each}
    {/if}
    {#if isTeacher}
        <Card class="bg-lime-900/50 border-none mx-auto mt-4" size="lg">
            <button class="div flex text-white" on:click={() => {
                showAdd = !showAdd
            }}>
                <span class="text-base font-bold">
                    Add schedule
                </span>
                {#if showAdd}
                    <AngleDownOutline class="ml-auto"/>
                {:else}
                    <AngleRightOutline class="ml-auto"/>
                {/if}
            </button>
            {#if showAdd}
                <div class="flex mt-2 text-neutral-400">Title</div>
                <div class="text-sm text-neutral-400 italic">Include day of week and/or date.</div>
                <Input placeholder="Title" class="bg-inherit text-white mt-2" bind:value={title}/>
                <InputError error={titleError}/>
                <div class="flex mt-2 text-neutral-400">Description</div>
                <div class="text-sm text-neutral-400 italic">Specify a room/building/location, or "Online" for online meetings.</div>
                <Textarea placeholder="Description" class="bg-inherit text-white mt-2" bind:value={description}/>
                <InputError error={descriptionError}/>
                <div class="flex mt-2 text-neutral-400">Link</div>
                <div class="text-sm text-neutral-400 italic">An optional link for online meetings.</div>
                <Input placeholder="Link" class="bg-inherit text-white mt-2" bind:value={link}/>
                <InputError error={linkError}/>
                <Button class="mt-4" on:click={onAddSchedule}
                >
                    Add
                </Button>
            {/if}
        </Card>
    {/if}
</Card>