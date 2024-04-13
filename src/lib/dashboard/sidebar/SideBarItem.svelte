<script>
    import { createEventDispatcher } from 'svelte';

    /**
     * @type {String}
     */
    export let title;
    /**
     * @type {boolean}
    */
    export let isSelected;

    const dispatch = createEventDispatcher();

    function onSelect() {
        dispatch('sidebar-select', title);
    }
</script>
<li>
    {#if isSelected}
        <button on:click={onSelect} class="bg-neutral-300 text-gray-700 w-full py-2 px-10 text-left">{title}</button>
    {:else}
        <button on:click={onSelect} class="w-full py-2 px-10 text-left text-white">{title}</button>
    {/if}
</li>