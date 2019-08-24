describe("bmoor.object", function() {
	it("should operate explode correctly", function(){
		var t = {
				'eins.zwei': 12,
				'eins.drei': 13,
				'fier': 4
			}

		expect( bmoor.object.explode(t) ).toEqual({
			eins: {
				zwei: 12,
				drei: 13
			},
			fier: 4
		});
	});

	it("should operate makeExploder correctly", function(){
		var t = {
				'eins.zwei': 12,
				'eins.drei': 13,
				'fier': 4
			},
			explode = bmoor.object.makeExploder( Object.keys(t) );

		expect( explode(t) ).toEqual({
			eins: {
				zwei: 12,
				drei: 13
			},
			fier: 4
		});
	});

	describe(':: implode', function(){
		it("should operate correctly", function(){
			var t = {
				time: {
					start: 99,
					stop: 100
				},
				id: 'woot',
				foo: {
					bar: {
						hello: 'world'
					}
				},
				arr: [{
					eins: 1,
				}, {
					zwei: 2
				}],
				double: [
					[0]
				]
			};

			expect(bmoor.object.implode(t))
			.toEqual({
				'time.start': 99,
				'time.stop': 100,
				'id': 'woot',
				'foo.bar.hello': 'world',
				'arr[0].eins': 1,
				'arr[1].zwei': 2,
				'double[0][0]': 0
			});
		});
	});

	it("should operate implode correctly - with an ignore", function(){
		var t = {
				time: {
					start: 99,
					stop: 100
				},
				id: 'woot',
				foo: {
					bar: {
						hello: 'world'
					}
				}
			}

		expect( bmoor.object.implode(t,{time:{start:true},id:true,foo:true}) ).toEqual({
			'time.stop': 100
		});
	});

	describe('::merge', function(){
		it('should replace null correctly', function(){
			expect( bmoor.object.merge({
				foo: null,
				bar: { a: 'ok'},
				hello: {
					world: 1,
					other: 'thing',
					arr: null
				},
				arr: [1, 2],
				arr2: [8, 9]
			},{
				foo: 'bar',
				bar: null,
				hello: {
					world: null,
					arr: [1, 2]
				},
				arr: null,
				arr2: [4, 5]
			}))
			.toEqual({
				foo: 'bar',
				bar: null,
				hello: {
					world: null,
					other: 'thing',
					arr: [1, 2]
				},
				arr: null,
				arr2: [4, 5]
			})
		});
	});
});