<script>
    import { CourseNote, SingleCourseController } from "$lib/SingleCourseController";
    import InputError from "$lib/ui/InputError.svelte";
    import { Button, Card, Input, Textarea } from "flowbite-svelte";
    import { AngleDownOutline, AngleRightOutline, FileLinesSolid, TrashBinSolid } from "flowbite-svelte-icons";
    import { createEventDispatcher } from "svelte";

    let dispatch = createEventDispatcher();

    /**
     * @type {CourseNote[] | null}
     */
    export let notes;
    /**
     * @type {boolean}
     */
    export let isTeacher;

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

    function onAddNote() {
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
            dispatch("addNote", {
                title: title,
                description: description,
                link: link,
            });
        }
    }

    /**
     * @param {string} id
     */
    function onDeleteNote(id) {
        dispatch("deleteNote", id);
    }

    /**
     * @param {string} url
     */
    function onOpenLink(url) {
        dispatch("openLink", url);
    }
</script>
<Card class="bg-neutral-800 border-none mx-auto mt-8" size="lg">
    {#if notes === null}
        <h1 class="text-white text-lg font-bold mr-auto">
            Loading notes...
        </h1>
    {:else}
        <h1 class="text-white text-lg font-bold mr-auto">
            {#if notes.length == 0}
                No notes
            {:else}
                Notes
            {/if}
        </h1>
        {#each notes as note}
            <Card class="bg-neutral-700 border-none mx-auto mt-2" size="lg">
                <h1 class="flex items-center text-gray-200 text-l font-bold mr-auto">
                    <FileLinesSolid class="mr-2"/> {note.title}
                </h1>
                <p class="mt-2 text-gray-300 whitespace-pre-wrap text-sm break-words">{note.description}</p>
                {#if note.link != ""}
                    <p class="mt-2 text-gray-300 whitespace-pre-wrap text-sm break-words">Link: {note.link}</p>
                {/if}
                <div class="flex mt-4">
                    {#if note.link != ""}
                        <Button class="mr-2" on:click={() => {
                            onOpenLink(note.link);
                        }}>
                            Open link
                        </Button>
                    {/if}
                    <Button class="px-3 bg-red-700" on:click={() => {
                        onDeleteNote(note.id);
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
                    Add note
                </span>
                {#if showAdd}
                    <AngleDownOutline class="ml-auto"/>
                {:else}
                    <AngleRightOutline class="ml-auto"/>
                {/if}
            </button>
            {#if showAdd}
            <div class="flex mt-2 text-neutral-400">Title</div>
            <Input placeholder="Title" class="bg-inherit text-white mt-2" bind:value={title}/>
            <InputError error={titleError}/>
            <div class="flex mt-2 text-neutral-400">Contents</div>
            <Textarea placeholder="Description" class="bg-inherit text-white mt-2" bind:value={description}/>
            <InputError error={descriptionError}/>
            <div class="flex mt-2 text-neutral-400">Optional link</div>
            <Input placeholder="Link" class="bg-inherit text-white mt-2" bind:value={link}/>
            <InputError error={linkError}/>
            <Button class="mt-4" on:click={onAddNote}
                >
                    Add
                </Button>
            {/if}
        </Card>
    {/if}
</Card>