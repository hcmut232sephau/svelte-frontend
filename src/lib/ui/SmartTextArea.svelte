<script>
    import { createEventDispatcher } from 'svelte';
    import InputError from './InputError.svelte';

    /**
     * @type {String}
     */
    export let title = "";
    /**
     * @type {String}
     */
    export let value;
    /**
     * @type {String | null}
     */
    export let error;

    const dispatch = createEventDispatcher();

    // @ts-ignore
    function handleInput(e) {
        value = e.target.value;
        dispatch("input", e);
    };
</script>
<div class="w-full">
    <textarea
        placeholder={title}
        value={value}
        rows="10"
        cols="30"
        on:input={handleInput}

        class="input input-bordered rounded-md w-full h-40 bg-neutral-700"
    />
    <InputError error={error}/>
</div>