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
<div class="smart-text-field">
    <input type="text" placeholder={title} bind:value={value}>

    {#if error !== null}
        {error}
    {/if}
</div>