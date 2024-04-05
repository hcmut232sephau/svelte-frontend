<script>
    import { createEventDispatcher } from 'svelte';

    /**
     * @type {String}
     */
    export let title;
    /**
     * @type {String}
     */
    export let value;
    /**
     * @type {String | null}
     */
    export let error;

    const dispatch = createEventDispatcher();
</script>
<div class="smart-text-field w-full ">
    <input type="text" placeholder={title} bind:value={value} class="input input-bordered rounded-md w-full bg-neutral-700">

    {#if error !== null}
        <div class="text-red-500">
            {error}
        </div>
    {/if}
</div>