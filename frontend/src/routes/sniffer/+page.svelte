<script>
    let DUMMY_REQUESTS = [
        { uri: 'example.com/123', headers: 'test headers', body: 'test body' },
        { uri: 'example.com/123', headers: 'test headers', body: 'test body' },
        { uri: 'example.com/123', headers: 'test headers', body: 'test body' },
        { uri: 'example.com/123', headers: 'test headers', body: 'test body' },
        { uri: 'example.com/123', headers: 'test headers', body: 'test body' },
        { uri: 'example.com/123', headers: 'test headers', body: 'test body' },
        { uri: 'example.com/123', headers: 'test headers', body: 'test body' },
        { uri: 'example.com/123', headers: 'test headers', body: 'test body' },
        { uri: 'example.com/123', headers: 'test headers', body: 'test body' },
        { uri: 'example.com/123', headers: 'test headers', body: 'test body' },
        { uri: 'example.com/123', headers: 'test headers', body: 'test body' },
        { uri: 'example.com/123', headers: 'test headers', body: 'test body' },
    ];

    import { CodeBlock } from '@skeletonlabs/skeleton';
    import hljs from 'highlight.js/lib/core';
    import yaml from 'highlight.js/lib/languages/yaml';

    hljs.registerLanguage('yaml', yaml);

    let intercepted = DUMMY_REQUESTS;
    let header = `
    header-1:
        header=''
    `;
    let body = `
    body-1:
        body=''
    `;
</script>

<div class='w-full h-full flex gap-3 p-1'>
    <div class='table-container max-h-[calc(100vh-90px)] w-[55%]'>
        <table class='table table-hover'>
            <thead class='sticky top-0 z-10'>
                <tr>
                    <th> URI </th>
                    <th> head </th>
                    <th> </th>
                </tr>
            </thead>
            <tbody>
                {#each intercepted as req}
                <tr class='hover:cursor-pointer'>
                    <td> {req.uri} </td>
                    <td> {req.headers} </td>
                    <a
                        href='/fuzzer'
                        class='btn btn-sm variant-filled-primary font-bold
                        mt-3 z-1 rounded-lg px-5'
                    >
                        Fuzz
                    </a>
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <div class='h-full flex flex-col w-[45%]'>
        <div class='py-1 h-[50%]'>
            <CodeBlock class='h-full overflow-scroll' language='yaml' code={header}/>
        </div>
        <div class='py-1 h-[50%]'>
            <CodeBlock class='h-full overflow-scroll' language='yaml' code={body}/>
        </div>
    </div>
</div>
