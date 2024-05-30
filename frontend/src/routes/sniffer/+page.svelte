<script>
    export let data;
    const { captures } = data;

    import { CodeBlock } from '@skeletonlabs/skeleton';
    import hljs from 'highlight.js/lib/core';
    import yaml from 'highlight.js/lib/languages/yaml';

    hljs.registerLanguage('yaml', yaml);

    let header = ' ';
    let body = ' ';

    const selectCapture = (capture) => {
        if (!capture) return;
        header = JSON.stringify(capture.headers);
        body = JSON.stringify(capture.body);
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
                        location.assign('/fuzzer');
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
            <CodeBlock class='h-full overflow-scroll' language='yaml' code={header}/>
        </div>
        <div class='py-1 h-[50%]'>
            <CodeBlock class='h-full overflow-scroll' language='yaml' code={body}/>
        </div>
    </div>
</div>
