<script>    
    import {onMount} from "svelte";
    import beautify from 'json-beautify';

    export let data;
    const { capture } = data;

    // **NOTE:** Since `onMount` is only called on the client, we can just
    // make our import there. And assign to our Component's scope
    let CodeJar;
    onMount(async () => {
        ({CodeJar} = await import("@novacbn/svelte-codejar"));
    });


    import hljs from 'highlight.js/lib/core';
    import json from 'highlight.js/lib/languages/json';

    hljs.registerLanguage('json', json);

    // `highlight` takes the input code and returns the highlighted HTML markup
    const highlight = (code, syntax) => (
        hljs.highlight(code, {
            language: syntax,
        }).value
    );

    let DUMMY_WORDLISTS = [
        {name: 'test', words: 'test1\ntest2\ntest3'},
        {name: 'test', words: 'test1\ntest2\ntest3'},
        {name: 'test', words: 'test1\ntest2\ntest3'},
        {name: 'test', words: 'test1\ntest2\ntest3'},
        {name: 'test', words: 'test1\ntest2\ntest3'},
        {name: 'test', words: 'test1\ntest2\ntest3'},
        {name: 'test', words: 'test1\ntest2\ntest3'},
        {name: 'test', words: 'test1\ntest2\ntest3'},
        {name: 'test', words: 'test1\ntest2\ntest3'},
        {name: 'test', words: 'test1\ntest2\ntest3'},
    ];

    let wordslists = DUMMY_WORDLISTS;

    let header;
    let body;

    if (capture){
        header = beautify(
            capture.headers,
            null,
            2,
            80
        );
        if (capture.body.raw){
            try {
                body = beautify(
                    JSON.parse(capture.body.raw),
                    null,
                    2,
                    80
                );
            } catch {
                body = capture.body.raw;
            }
        }
        else if (capture.body.formData) {
            // Parse formdata...
        }
    }
    else {
        header = '';
        body = '';
    }

    let iterator = 1;
    let editorViewMode = 'headers';
</script>


<div class='w-full h-full grid grid-cols-2  gap-3 p-1'>
    <div class='w-full h-full flex flex-col h-[calc(100vh-75px)]'>
        <div class='btn-group variant-ghost w-full grid grid-cols-2 h-[40px] z-20'>
            <button
                class={`
                    ${editorViewMode === 'headers' ? 'variant-ghost-tertiary' : ''}
                    transition-all duration-700
                `}
                on:click={() => editorViewMode = 'headers' }
            >
                headers
            </button>
            <button
                class={`
                    ${editorViewMode === 'body' ? 'variant-ghost-tertiary' : ''}
                    transition-all duration-700
                `}
                on:click={() => editorViewMode = 'body' }
            >
                Body
            </button>
        </div>
        <div
            class={`
                ${editorViewMode === 'body' && 'hidden'}
                overflow-auto rounded-lg h-[calc(100vh-100px)]
                mt-1
                `}
        >
            {#if CodeJar}
                <CodeJar bind:value={header} class="hljs h-full p-5 text-sm" syntax="json" {highlight}/>
            {:else}
            <!--
                **NOTE:** Normally the `CodeJar` Svelte handles fall through for us, and
                renders / syntax highlights without an editor during SSR / non-JS enabled clients
            -->
                <pre class='hljs h-full p-5 text-sm'><code>{header}</code></pre>
            {/if}
        </div>
        <div
            class={`
                ${editorViewMode === 'headers' && 'hidden'}
                overflow-auto rounded-lg h-[calc(100vh-100px)]
                mt-1
                `}
        >
            {#if CodeJar}
                <CodeJar bind:value={body} class="hljs h-full p-5 text-sm" syntax="json" {highlight}/>
            {:else}
            <!--
                **NOTE:** Normally the `CodeJar` Svelte handles fall through for us, and
                renders / syntax highlights without an editor during SSR / non-JS enabled clients
            -->
                <pre class='hljs h-full p-5 text-sm'><code>{body}</code></pre>
            {/if}
        </div>
    </div>
    <div class='w-full h-full flex flex-col max-h-[calc(100vh-72px)]'>
        <div class='h-[80%] table-container'>
            <table class='table'>
                <thead class='sticky top-0'>
                    <tr>
                        <th> Name </th>
                        <th> Preview </th>
                        <button class='absolute right-3 top-3 btn btn-sm variant-filled-primary font-bold'>
                            Wordlist
                        </button>
                    </tr>
                </thead>
                <tbody>
                    {#each wordslists as wordlist}
                    <tr class='hover:cursor-pointer'>
                        <td> {wordlist.name} </td>
                        <td> {wordlist.words} </td>
                    </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <div class='w-full h-[20%] grid grid-cols-2 gap-3 p-2 tracking-widest uppercase'>
            <button 
                on:click={() => iterator += 1}
                class='
                    btn variant-soft-secondary h1 text-2xl
                    hover:scale-[0.98] active:scale-[0.95]
                '
            >
                Next: {iterator}
            </button>
            <button
                class='
                    btn variant-filled-primary h1 text-2xl
                    hover:scale-[0.98] active:scale-[0.95]
                '
            >
                Start
            </button>
        </div>
    </div>
</div>
