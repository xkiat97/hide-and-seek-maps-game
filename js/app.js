function load(comp) {
    return resolve => { 
        fetch(`_${comp}.html`)
            .then(resp => resp.text())
            .then(text => { 
                $(document.body).append(text);
                resolve(Vue.component(comp));
            });
    };
}

Vue.directive('focus', {
    inserted(el) {
        el.focus();
    }
});

Vue.filter('number', (val, dp = 2) => {
    return parseFloat(val).toFixed(dp);
});

function hashToArray(hash, f = 'id') {
    let arr = [];
    for (let [key, obj] of Object.entries(hash)) {
        obj[f] = key;
        arr.push(obj);
    }
    return arr;
}

function resize(f, w, h = w, type = 'image/jpeg') {
    return new Promise((resolve, reject) => { 
        let img = document.createElement('img');
        
        img.onload = e => {
            URL.revokeObjectURL(img.src);
            
            // Resize algorithm -----------------------
            let ratio = w / h;

            let nw = img.naturalWidth;
            let nh = img.naturalHeight;
            let nratio = nw / nh;

            let sx, sy, sw, sh;

            if (ratio >= nratio) {
                // Retain width, calculate height
                sw = nw;
                sh = nw / ratio;
                sx = 0;
                sy = (nh - sh) / 2;
            }
            else {
                // Retain height, calculate width
                sw = nh * ratio;
                sh = nh;
                sx = (nw - sw) / 2;
                sy = 0;
            }
            // --------------------------------------------

            let can = document.createElement('canvas');
            can.width = w;
            can.height = h;

            let ctx = can.getContext('2d');
            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);

            // Resolve to blob
            can.toBlob(blob => resolve(blob), type);
        };

        img.onerror = e => {
            URL.revokeObjectURL(img.src);
            reject();
        };

        img.src = URL.createObjectURL(f);
    });
}

function resizeToDataURL(f, w, h = w, type = 'image/jpeg') {
    return new Promise((resolve, reject) => { 
        let img = document.createElement('img');
        
        img.onload = e => {
            URL.revokeObjectURL(img.src);
            
            // Resize algorithm -----------------------
            let ratio = w / h;

            let nw = img.naturalWidth;
            let nh = img.naturalHeight;
            let nratio = nw / nh;

            let sx, sy, sw, sh;

            if (ratio >= nratio) {
                // Retain width, calculate height
                sw = nw;
                sh = nw / ratio;
                sx = 0;
                sy = (nh - sh) / 2;
            }
            else {
                // Retain height, calculate width
                sw = nh * ratio;
                sh = nh;
                sx = (nw - sw) / 2;
                sy = 0;
            }
            // --------------------------------------------

            let can = document.createElement('canvas');
            can.width = w;
            can.height = h;

            let ctx = can.getContext('2d');
            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);

            // Resolve to data url
            resolve(can.toDataURL(type));
        };

        img.onerror = e => {
            URL.revokeObjectURL(img.src);
            reject();
        };

        img.src = URL.createObjectURL(f);
    });
}