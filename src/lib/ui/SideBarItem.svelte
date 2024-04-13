<script>
    /**
     * @type {String}
     */
    export let title;
    /**
     * @type {boolean}
    */
    export let isSelected;
</script>
<li>
    {#if isSelected}
        <button class="bg-neutral-300 text-gray-700 w-full py-2 px-10 text-left"> {title}</button>
    {:else}
        <button class="w-full py-2 px-10 text-left text-white"> {title}</button>
    {/if}
</li>