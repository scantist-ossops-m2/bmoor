;(function( $, global, undefined ){

bMoor.constructor.define({
	name : 'Node',
	namespace : ['bmoor','snap'],
	require : [ ['bmoor','lib','Bootstrap'] ],
	construct: function( element, template, data ){
		this._element( element );
		this._template( template );
		this._data( data );
		
		if ( !this.prepared ){
			this._finalize();
		}
		
		this._binding();
	},
	properties: {
		baseClass : 'snap-node',
		_element : function( element ){
			this.$ = $( element );
			this.element = element;
			this.$.data( 'node', this );
			
			this.variable = element.hasAttribute('snap-variable') ? element.getAttribute('snap-variable') : null;
			
			element.className += ' '+this.baseClass;
		},
		_data : function( data ){
			this.data = data;
		},
		_template : function( template ){
			this.prepared = template 
				? bMoor.template.getDefaultTemplator().prepare( bMoor.resource.loadTemplate(template,null) )
				: null;
				
			if ( this.prepared ){
				this._makeContent();
			}
		},
		_binding : function(){
			var dis = this;
			
			if ( this.data && this.data._bind ){
				this.data._bind( function(){
					dis._mapUpdate( this );
				});
			}
		},
		_makeContent : function(){
			this.element.innerHTML = bMoor.template.getDefaultTemplator().run( this.prepared, this.data );
			bmoor.templating.Builder.setContext( this.element, this.data );
			this._finalize();
			
		},
		_mapUpdate : function( map ){
			if ( this.prepared ){
				this._makeContent();
			}else if ( this.variable ){
				this.element.innerHTML = this.data[ this.variable ];
			}
		},
		_finalize : function(){},
		_getVariable : function( variable ){
			return eval( 'global.' + variable );
		}
	}
});

}( jQuery, this ));