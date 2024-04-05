<script>
    import { createEventDispatcher } from 'svelte';

    /**
     * @type {String}
     */
    export let title;
    /**
     * @type {String}
     */
    export let type = "text";
    /**
     * @type {String}
     */
    export let value;
    /**
     * @type {String | null}
     */
    export let error;

    const dispatch = createEventDispatcher();

    // @ts-ignore
    function handleInput(e) {
        value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
    };
</script>
<div class="w-full">
    <input
        type={type}
        placeholder={title}
        value={value}
        on:input={handleInput}

        class="input input-bordered rounded-md w-full bg-neutral-700"
    >

    {#if error !== null}
        <div class="text-red-500">
            {error}
        </div>
    {/if}
</div>