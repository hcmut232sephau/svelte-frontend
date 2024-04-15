<script>
    import { AuthenticationController } from '$lib/Controllers'
    import SmartTextField from '$lib/ui/SmartTextField.svelte';
    import { createEventDispatcher } from 'svelte';

    /**
     * @type {String}
     */
    export let pageName;
    /**
     * @type {AuthenticationController}
     */
    export let authCtrl;

    let name = "";

    /**
     * @type {String | null}
     */
    let error = null;

    const dispatch = createEventDispatcher();

    function onSetUsername() {
        error = null;

        let isInputValid = true;

        if (name == "") {
            isInputValid = false;
            error = "Cannot leave this empty";
        }

        if (name.length > 72) {
            isInputValid = false;
            error = "Cannot use more than 72 characters";
        }

        if (isInputValid) {
            authCtrl.setUsername(name)
                .catch(err => {
                    const code = err.code;
                    error = "Error. Check your input and try again later. (error code " + code + ")";
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
            What should other {pageName} users call you?
        </h1>
        <SmartTextField
            title="Name"
            type="text"
            bind:value={name}
            bind:error={error}
        />
        <div>
            <button class="PrimaryButton w-full" on:click={onSetUsername}>Set name</button>
        </div>
        <div>
            Want to <button class="text-blue-600" on:click={onLogout}>log out</button> instead?
        </div>
    </div>
</div>