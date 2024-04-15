<script>
    /**
     * @type {String | null}
     */
    export let error;
</script>
{#if error !== null}
    <div class="text-red-500">
        {error}
    </div>
{/if}