<script>
    import { UserData } from "$lib/AuthenticationController";

    /**
     * @type {String}
     */
    export let pageName;
    /**
     * @type {UserData}
     */
    export let userData;
</script>
<aside class="h-screen fixed">
    <div class="h-full flex flex-col bg-neutral-800 max-w-96 w-[30vw] min-w-64">
        <h1 class="p-10 font-bold text-2xl">{pageName}</h1>
        <ul class="flex-1 w-full overflow-auto">
            <slot></slot>
        </ul>
        <div class="flex px-10 py-10">
            <div class="bg-white p-4 rounded-full">
                <img src="/icons/user-solid.svg" class="w-5 h-5 rounded-md" alt = ""/>
            </div>
            <div class="flex px-6 justify-between items-center">
                <div class="leading-6">
                    <h4 class="font-bold">{userData.username}</h4>
                    <span class="text-xz text-gray-500">{userData.formattedAccountType()}</span>
                </div>
            </div>
        </div>
    </div>
</aside>