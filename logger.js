function errorHandle(err, main) {
    if (String(err.message).startsWith('net')) return console.log(`\n[ERROR] No Internet (${err.message})`)
    if (String(err).startsWith('TimeoutError')) {
        console.log(`\n[ERROR] Website did not load (${err.message})`)
        return main();
    }
    console.log(`\n[ERROR] Unknown Error (${err.message})`)
    main();
}

module.exports = errorHandle;