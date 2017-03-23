if (typeof seajs !== 'undefined') {
    (function seajsSetConfig() {
        var newRootPATH = "/";
        var ctxPathjs = "../js/assets/";
        // Seajs配置信息
        var config = {
            base: '/',
            paths: {
                'assets': 'js/assets/',
                'module': 'js/module',
                'plugin': 'js/plugin'
            },
            alias: {
                'doT': 'js/assets/doT.min.js',
                'formCheck': 'js/module/formCheck.js',
            }
        };
        // no jQuery on the window
        if (typeof $ === 'undefined') {
            config.preload = ['jquery'];
        }
        seajs.config(config);
    })();
}
