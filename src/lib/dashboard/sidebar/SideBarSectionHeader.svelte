<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    /**
     * @param {MouseEvent} event
     */
    function onClick(event) {
        dispatch('click', event);
    }
</script>
<li>
    <button on:click={onClick} class="w-full py-2 px-10 text-left text-white">
        <slot></slot>
    </button>
</li>