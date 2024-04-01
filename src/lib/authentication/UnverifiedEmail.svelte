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
<h1>
    Your email is not verified yet.
</h1>
<div>
    <button class="logout-button" on:click={onLogout}>Log out</button>
</div>