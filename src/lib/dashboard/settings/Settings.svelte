<script>
    import { ApplicationController, UserData } from '$lib/Controllers';
    import { Card, Button, Input } from 'flowbite-svelte';
    import { createEventDispatcher } from 'svelte';

    /**
     * @type {ApplicationController}
     */
    export let appCtrl;
    /**
     * @type {UserData}
     */
    export let userData;

    const dispatch = createEventDispatcher();

    function onLogout() {
        dispatch('logout', {});
    }

    let username = userData.username;
</script>
<div class="flex flex-col">
    <Card class="bg-neutral-800 border-none mx-auto mt-10">
        Username
            <div class="flex my-2">
            <Input
                class="bg-neutral-700 text-white"
                placeholder="Username"
                bind:value={username}
            />
            <Button 
                class="ml-2"
                on:click={() => {
                    appCtrl.setUsername(username);
                    // TODO: input verification
                }}
            >
                Save
            </Button>
        </div>
    </Card>

    <Card class="bg-neutral-800 border-none mx-auto mt-10">
        <Button 
            class="ml-2"
            on:click={onLogout}
        >
            Log out
        </Button>
    </Card>
</div>

