<script>
    import { createEventDispatcher } from 'svelte';

    // /**
    //  * @type {String}
    //  */
    // export let pageName;

    const dispatch = createEventDispatcher();

    function onLogout() {
        dispatch('logout', {});
    }
</script>
<div>
    <button class="logout-button" on:click={onLogout}>Log out</button>
</div>