<script>
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { createEventDispatcher } from 'svelte';
    import { Card, Button, Input } from 'flowbite-svelte';

    /**
     * @type {AuthenticationController}
     */
    export let authCtrl;
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
    <Card class="bg-neutral-800 border-none mt-10 mx-auto" size="lg">
        Username
            <div class="flex my-2">
            <Input
                class="bg-neutral-700 text-white mr-3"
                placeholder="Username"
                bind:value={username}
            />
            <Button 
                class="mr-60"
                on:click={() => {
                    authCtrl.setUsername(username);
                    // TODO: input verification
                }}
            >
                Save
            </Button>
        </div>
    </Card>
    <Card class="bg-neutral-800 border-none mx-auto mt-10" size="lg">
        <Button 
            class="ml-2"
            on:click={onLogout}
        >
            Log out
        </Button>
    </Card>
</div>

