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
    export let type = "text";
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
        value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
        dispatch("input", e);
    };
</script>
<div class="w-full">
    <input
        type={type}
        placeholder={title}
        value={value}
        on:input={handleInput}

        class="input input-bordered rounded-md w-full bg-neutral-700"
    >
    <InputError error={error}/>
</div>