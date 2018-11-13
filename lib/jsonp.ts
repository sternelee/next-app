function jsonp(opts) {
    let script = document.createElement('script')
    let head = document.getElementsByTagName('head')[0]
    let callbackName = 'jsonp' + (new Date).getTime()
    let sid: any = null
    let url = opts.url
    const callbackParamName = opts.callbackParamName || 'callback'
    const timeout = opts.timeout || 5000

    url += '&'+callbackParamName+'='+callbackName

    window[callbackName] = function( data ) {
        opts.success(data)
        sid && clearTimeout(sid)
        // https://github.com/keen/keen-js/issues/195
        // IE 8 delete window[callbackName] error
        // delete window[callbackName]
        try{
            delete window[callbackName]
        }catch(e) {}
        head.removeChild(script)
    }

    if(timeout > 0) {
        sid = setTimeout(function() {
            // 请求超时
            opts.success({code: 408, err: 'Request Timeout'})
        }, timeout)
    }
    script.onerror = function() {
        opts.success({code: 404, err: 'Not Found'})
    }

    script.async = true;
    script.src = url;
    head.insertBefore(script, head.firstChild)
}

export default jsonp