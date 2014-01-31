(function(){
	var XHR = window.XMLHttpRequest || function() {
			/* global ActiveXObject */
			try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
			try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
			try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
			throw 'error' /* TODO : error */;
		};

	bMoor.define({
		name : 'bmoor.comm.Http',
		construct : function( options ){
			var dis = this,
				xhr = this.makeXHR( 
					options.method.toUpperCase(), 
					options.url, 
					(options.async === undefined ? true : options.async),
					options.user,
					options.password
				);

			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if( dis.status !== -2 ) {
						dis.status = xhr.status;
					}

					dis.resolve(
						xhr.responseType ? xhr.response : xhr.responseText,
						xhr.getAllResponseHeaders()
					);
				}
			};

			bMoor.forEach( options.headers, function( value, key ){
				xhr.setRequestHeader(key, value);
			});

			if ( options.mimeType ) {
				xhr.overrideMimeType( options.mimeType );
			}

			if ( options.responseType ) {
				xhr.responseType = options.responseType;
			}

			this.url = bMoor.urlResolve(options.url);
			this.status = null;
			this.connection = xhr;
			this.$defer = new bmoor.defer.Basic();

			xhr.send(options.data || null);
		},
		properties : { // 7900
			makeXHR : function( method, url, async, user, password ){
				var xhr = new XHR();

				if ( "withCredentials" in xhr ){
					// doop
				}else if ( typeof XDomainRequest != "undefined") {
					// Otherwise, check if XDomainRequest.
					// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
					xhr = new XDomainRequest();
				} else {
					// Otherwise, CORS is not supported by the browser.
					xhr = null;
				}

				xhr.open( method, url, async, user, password );

				return xhr;
			},
			abort : function(){
				// TODO : this status should ideally be from somewhere?
				if ( this.status === null ){
					this.status = -2;
					if ( this.connection ){
						this.connection.abort();
					}
				}
			},
			resolve : function( response, headers ){
				var action,
					status = this.status,
					protocol = this.url.protocol;

				this.connection = null;

				// fix status code for file protocol (it's always 0)
				status = (protocol == 'file' && status === 0) ? (response ? 200 : 404) : status;

				// normalize IE bug (http://bugs.jquery.com/ticket/1450)
				status = status == 1223 ? 204 : status;

				action = ( 200 <= status && status < 300 ) ? 'resolve' : 'reject';

				this.$defer[action]({
					data : response,
					status : status,
					headers : headers
				});
			}
		} 
	});
}());