        [% javascript.head_js_inline %]

        <script>
            //A global variable required to initialize Page object.
            window.page_params = { settings: [%= javascript.settings =%]};

            //Taken from.
            //http://www.html5rocks.com/en/tutorials/speed/script-loading/
            var loadscript = function(e,t,r){function n(){for(;d[0]&&"loaded"==d[0][f];)c=d.shift(),c[o]=!i.parentNode.insertBefore(c,i)}for(var s,a,c,d=[],i=e.scripts[0],o="onreadystatechange",f="readyState";s=r.shift();)a=e.createElement(t),"async"in i?(a.async=!1,e.head.appendChild(a)):i[f]?(d.push(a),a[o]=n):e.write("<"+t+' src="'+s+'" defer></'+t+">"),a.src=s};

            var scripts = [];
            [%= FOREACH js IN javascript.libs =%]
              scripts.push('[%= js =%]');
            [%= END =%]
            loadscript(document, "script", scripts);
        </script>
