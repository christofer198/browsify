function browsify(api_key){
    let apikey = api_key
    let campaignAction = (userNew, api_key=apikey) =>{
      fetch(`http://localhost:1337/api/v1/campaign/${api_key}`,{
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then( resp => resp.json())
      .then( resp => {
        if(resp.response.data[0].style == "Conversion" && userNew == true){
          eval(resp.response.data[0].NewUserAction)
        } else if (resp.response.data[0].style == "Conversion" && userNew == false) {
          eval(resp.response.data[0].OldUserAction)
        }
      })
    }


    var canvas = document.createElement('canvas')
    var gl;
    var debugInfo;
    var vendor;
    var renderer;

    try {
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) {
    }

    if (gl) {
      debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).replace(/angle|Direct3D11 vs_5_0 ps_5_0|[()]/gi, '').trim()
    }

    var offset = new Date().getTimezoneOffset();
    if(!localStorage.getItem('browsifyToken')){
      fetch('https://api.ipify.org?format=json').then(res => res.json()).then(res => {
        let pluginsArray = []
        for(i=0; i < navigator.plugins.length; i++) { pluginsArray.push(navigator.plugins[i].name)}
        let data = {
          'plugins': pluginsArray,
          'ip': res.ip,
          'timezone': offset,
          'gpu': renderer,
          'resolution': `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`,
          'userAgent': window.navigator.userAgent
        }
        return data
      })
      .then((data) => {
        fetch(`http://localhost:1337/api/v1/fingerprint/${api_key}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(resp => resp.json())
        .then(resp => {
          localStorage.setItem("browsifyToken", resp.id)
          if(resp.newUser){
            campaignAction(true)
          } else {
            campaignAction(false)
          }
        })
      })
    } else {
      campaignAction(false)
    }

}
