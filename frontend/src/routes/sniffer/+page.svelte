<script>
    export let data;
    const { captures } = data;
    
    import { onMount } from 'svelte';
    import { CodeBlock } from '@skeletonlabs/skeleton';
    import hljs from 'highlight.js/lib/core';
    import json from 'highlight.js/lib/languages/json';

    hljs.registerLanguage('json', json);

    let header = ' ';
    let body = ' ';
    let beautify;

    onMount( async () => {
        let beautify_package = await import('json-beautify');
        beautify = beautify_package.default;
        console.log(beautify)
    });

    const selectCapture = (capture) => {
        if (!capture || !beautify) return;
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
    };
</script>

<div class='w-full h-full flex gap-3 p-1'>
    <div class='table-container max-h-[calc(100vh-90px)] w-[55%]'>
        <table class='table table-hover table-fixed'>
            <thead class='sticky top-0 z-10'>
                <tr>
                    <th> URL </th>
                    <th> Method </th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {#each captures as req}
                <tr class='hover:cursor-pointer' on:click={() => selectCapture(req)}>
                    <td> 
                        <p class='line-clamp-2'> {req.url} </p>
                    </td>
                    <td> {req.method} </td>
                    <td
                    on:click={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        location.assign(`/fuzzer?capture_id=${req.id}`);
                    }}
                        class='btn variant-ghost-primary w-full h-full'>
                        Fuzz
                    </td>
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <div class='h-full flex flex-col w-[45%] max-h-[calc(100vh-90px)]'>
        <div class='py-1 h-[50%]'>
            <CodeBlock class='h-full overflow-scroll' language='json' code={header}/>
        </div>
        <div class='py-1 h-[50%]'>
            <CodeBlock class='h-full overflow-scroll' language='json' code={body}/>
        </div>
    </div>
</div>
