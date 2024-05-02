<script>
    import { createEventDispatcher } from 'svelte';
    import { SideBarEntry } from './States';

    /**
     * @type {SideBarEntry | string}
     */
    export let entry;
    /**
     * @type {boolean}
    */
    export let isSelected;

    const dispatch = createEventDispatcher();

    function onSelect() {
        dispatch('sidebarSelect', entry);
    }
</script>
<li>
    {#if isSelected}
        <button on:click={onSelect} class="bg-neutral-300 text-gray-700 w-full py-2 px-10 text-left"><slot></slot></button>
    {:else}
        <button on:click={onSelect} class="w-full py-2 px-10 text-left text-white"><slot></slot></button>
    {/if}
</li>