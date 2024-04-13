<script>
    import SmartTextField from '$lib/ui/SmartTextField.svelte';
    import { ApplicationController } from '$lib/Controllers'
    import { createEventDispatcher } from 'svelte';

    /**
     * @type {String}
     */
    export let pageName;
    /**
     * @type {ApplicationController}
     */
    export let appCtrl;

    const dispatch = createEventDispatcher();

    function selectStudentType() {
        
    }

    function selectTeacherType() {
        
    }
</script>
<div class="card bg-neutral-800 w-128 rounded">
    <div class="card-body">
        <h1 class="text-lg font-bold">
            Select an account type
        </h1>
        <div>
            <button class="PrimaryButton w-full" on:click={selectStudentType}>Student</button>
        </div>
        <div>
            <button class="PrimaryButton w-full" on:click={selectStudentType}>Teacher</button>
        </div>
    </div>
</div>