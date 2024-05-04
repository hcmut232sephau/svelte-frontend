<script>
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { createEventDispatcher } from 'svelte';
    import { Card, Button, Input, Textarea } from 'flowbite-svelte';
    import InputError from "$lib/ui/InputError.svelte";

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
    let degree = userData.degree;

    /**
     * @type {String | null}
     */
    let usernameError = null;
    /**
     * @type {String | null}
     */
    let bioError = null;
    /**
     * @type {String | null}
     */
    let degreeError = null;

    function onSaveUserData() {
        usernameError = null;
        bioError = null;
        degreeError = null;

        let isInputValid = true;

        if (username == "") {
            isInputValid = false;
            usernameError = "Cannot leave this empty";
        }

        if (username.length > 72) {
            isInputValid = false;
            usernameError = "Cannot use more than 72 characters";
        }

        if (bio.length > 2048) {
            isInputValid = false;
            bioError = "Cannot use more than 144 characters";
        }

        if (degree.length > 2048) {
            isInputValid = false;
            bioError = "Cannot use more than 144 characters";
        }

        if (isInputValid) {
            authCtrl.setUserData(userData.withUsername(username).withBio(bio).withDegree(degree))
                .catch(err => {
                    const code = err.code;
                    usernameError = "Error. Check your input and try again later. (error code " + code + ")";
                });
        }
    }
</script>
<div class="flex flex-col w-[50vw]">
    <Card class="bg-neutral-800 border-none mt-16 mx-auto" size="lg">
        <div>Username</div>
        <Input
            class="bg-neutral-700 text-white mt-2"
            placeholder="Username"
            bind:value={username}
        />
        <InputError error={usernameError}/>
        <div class="mt-2">Bio</div>
        <Textarea
            class="bg-neutral-700 text-white mt-2"
            placeholder="Bio"
            bind:value={bio}
        />
        <InputError error={bioError}/>
        {#if userData.accountType == "teacher"}
            <div class="mt-2">Degree</div>
            <Input
                class="bg-neutral-700 text-white mt-2"
                placeholder="Degree"
                bind:value={degree}
            />
            <InputError error={degreeError}/>
        {/if}
        <Button 
            class="mt-4"
            on:click={onSaveUserData}
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
