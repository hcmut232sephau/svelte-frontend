<script>
    import { createEventDispatcher } from 'svelte';

    /**
     * @param {"student" | "teacher"} type
     */
    function formatAccountType(type) {
        switch (type) {
            case "student": return "Student";
            case "teacher": return "Teacher";
        }
    }

    /**
     * @type {String}
     */
    export let pageName;
    /**
     * @type {"student" | "teacher"}
     */
    export let accountType;

    $: formattedAccountType = formatAccountType(accountType);

    const dispatch = createEventDispatcher();

    function onLogout() {
        dispatch('logout', {});
    }
</script>
<aside class="h-screen fixed">
    <div class="h-full flex flex-col bg-neutral-800 size-96">
        <h1 class="p-10 font-bold text-2xl">{pageName}</h1>
        <ul class="flex-1 w-full">
            <slot></slot>
        </ul>
        <div class="flex px-10 py-3">
            <div class="bg-white p-4 rounded-full">
                <img
                    src="/user-solid.svg"
                    class="w-5 h-5 rounded-md"
                    alt = ""
                />
            </div>
            <div class="flex px-6 justify-between items-center">
                <div class="leading-6">
                    <h4 class="font-bold">Username</h4>
                    <span class="text-xz text-gray-500">{formattedAccountType}</span>
                </div>
            </div>
            <button class="btn ml-auto PrimaryButton" on:click={onLogout}>Log out</button>
        </div>
    </div>
</aside>