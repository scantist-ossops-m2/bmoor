(function(){

	bMoor.request('bmoor.build.Compiler').then(function( Compiler ){
		Compiler.$instance.addModule( 5, 'bmoor.build.ModFactory', ['-factory', function( factory ){

			var obj = this;

			if ( factory ){
				obj.$make = function(){
					var args = arguments;
					args.$arguments = true;
					return new obj( args );
				};
			}
		}]);
	});

}());