<script>
    import { AuthenticationController, UserData } from "$lib/AuthenticationController";
    import { createEventDispatcher } from 'svelte';
    import SmartTextField from '$lib/ui/SmartTextField.svelte';
    import SmartTextArea from '$lib/ui/SmartTextArea.svelte';
    import { get } from "svelte/store";

    /**
     * @type {string}
     */
    export let pageName;
    /**
     * @type {AuthenticationController}
     */
    export let authCtrl;
    /**
     * @type {UserData}
     */
    export let userData;

    let name = userData.username ?? "";
    let bio = userData.bio ?? "";

    /**
     * @type {String | null}
     */
    let nameError = null;
    /**
     * @type {String | null}
     */
    let bioError = null;

    const dispatch = createEventDispatcher();

    function onSetUsername() {
        nameError = null;
        bioError = null;

        let isInputValid = true;

        if (name == "") {
            isInputValid = false;
            nameError = "Cannot leave this empty";
        }

        if (name.length > 72) {
            isInputValid = false;
            nameError = "Cannot use more than 72 characters";
        }

        if (bio == "") {
            isInputValid = false;
            bioError = "Cannot leave this empty";
        }

        if (bio.length > 144) {
            isInputValid = false;
            bioError = "Cannot use more than 144 characters";
        }

        if (isInputValid) {
            authCtrl.setUserData(userData.withUsername(name).withBio(bio))
                .catch(err => {
                    const code = err.code;
                    nameError = "Error. Check your input and try again later. (error code " + code + ")";
                });
        }
    }

    function onLogout() {
        dispatch('logout', {});
    }
</script>
<div class="card bg-neutral-800 w-128 rounded">
    <div class="card-body">
        <h1 class="text-lg font-bold">
            Tell us more about yourself.
        </h1>
        What should other {pageName} users call you?
        <SmartTextField
            title="Name"
            bind:value={name}
            bind:error={nameError}
        />
        <div>
            Write a short bio
            <div class="text-sm text-gray-400 italic">Optionally, include your email and DoB</div>
        </div>
        <SmartTextArea
            title="Bio"
            bind:value={bio}
            bind:error={bioError}
        />
        <div>
            <button class="PrimaryButton w-full" on:click={onSetUsername}>Continue</button>
        </div>
        <div>
            Want to <button class="text-blue-600" on:click={onLogout}>log out</button> instead?
        </div>
    </div>
</div>