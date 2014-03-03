bMoor.define( 'bmoor.core.Map', [function(){
	return {
		traits : [
			'bmoor.core.Model'
		],
		construct : function( content ){
			this._merge( this._inflate(content) );
		},
		properties : {
			_simplify : function(){
				var key,
                    rtn = {},
                    content = this.deflate();

				for( key in content ){
					if ( content.hasOwnProperty(key) && key.charAt(0) !== '$' ){
						rtn[ key ] = content[ key ];
					}
				}

				return rtn;
			},
			toJson : function(){
				return JSON.stringify( this._simplify() );
			}
		}
	};
}]);
