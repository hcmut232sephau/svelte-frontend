<script>
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { createEventDispatcher } from 'svelte';
    import { Card, Button, Input, Textarea } from 'flowbite-svelte';

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
    let bio = userData.bio;
</script>
<div class="flex flex-col w-[50vw]">
    <Card class="bg-neutral-800 border-none mt-16 mx-auto" size="lg">
        <div>Username</div>
        <Input
            class="bg-neutral-700 text-white mt-2"
            placeholder="Username"
            bind:value={username}
        />
        <div class="mt-2">Bio</div>
        <Textarea
            class="bg-neutral-700 text-white mt-2"
            placeholder="Bio"
            bind:value={bio}
        />
        <Button 
            class="mt-4"
            on:click={() => {
                authCtrl.setUserData(userData.withUsername(username).withBio(bio));
                // TODO: input verification
            }}
        >
            Save
        </Button>
    </Card>
    <Card class="bg-neutral-800 border-none mt-16 mx-auto" size="lg">
        {#if userData.accountType != "student"}
            <Button 
                class=""
                on:click={() => {
                    authCtrl.setUserData(userData.withType("student"));
                }}
            >
                Become a student
            </Button>
        {/if}
        {#if userData.accountType != "teacher"}
            <Button 
                class=""
                on:click={() => {
                    authCtrl.setUserData(userData.withType("teacher"));
                }}
            >
                Become a teacher
            </Button>
        {/if}
        <Button class="bg-red-800 mt-2" on:click={onLogout}>
            Log out
        </Button>
    </Card>
</div>

