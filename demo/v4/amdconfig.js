var dojoConfig = (function (appRoot, lrsGPRoot) {
    return {
        paths: {
            "appRoot": appRoot
        },
        packages: [
            {
                name: "LrsGP",
                location: lrsGPRoot,
                main: "LrsGP"
            }
        ]
    }
} (location.href.replace(/(?:index.html)?$/, ""), location.href.replace(/demo\/v4\/(?:index.html)?$/, "")));