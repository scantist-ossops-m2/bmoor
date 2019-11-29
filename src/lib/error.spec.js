
const {expect} = require('chai');

describe('bmoor.lib.error', function() {

	const error = require('./error.js');
	const {levels} = require('./logger.js');

	describe('::addStatus', function(){
		it('should add a ref, if not defined already', function(){
			const err = {};

			error.addStatus(err, {});

			expect(err.ref)
			.to.exist;

			const ref = err.ref;

			error.addStatus(err, {});

			expect(err.ref)
			.to.equal(ref);
		});

		it('should set type if status is defined', function(){
			const err = {};

			error.addStatus(err, {
				status: 101
			});

			expect(err.status)
			.to.equal(101);

			expect(err.type)
			.to.equal(levels.error);

			error.addStatus(err, {
				status: 200,
				type: levels.warn
			});

			expect(err.status)
			.to.equal(200);

			expect(err.type)
			.to.equal(levels.warn);
		});
	});

	describe('::addTrace', function(){
		it('should overwrite and push old code to stack', function(){
			const err = {
				code: 200
			};

			error.addTrace(err, {
				code: 300,
				context: {}
			});

			error.addTrace(err, {
				code: 400,
				context: {
					foo: 'bar'
				}
			});

			expect(err.code)
			.to.equal(400);

			expect(err.context)
			.to.deep.equal({foo: 'bar'});

			expect(err.trace)
			.to.deep.equal([{
				code: 300,
				context: {}
			}, {
				code: 200,
				context: undefined
			}]);
		});
	});

	describe('::addResponse', function(){
		it('should write if response is defined', function(){
			const err = {};

			error.addResponse(err, {
				response: 'hello',
				payload: {foo: 'bar'}
			});

			expect(err.response)
			.to.equal('hello');

			expect(err.payload)
			.to.deep.equal({foo: 'bar'});

			error.addResponse(err, {
				response: 'foobar',
				payload: {hello: 'world'}
			});

			expect(err.response)
			.to.equal('foobar');

			expect(err.payload)
			.to.deep.equal({hello: 'world'});
		});
	});

	describe('::apply', function(){
		it('should apply everything', function(){
			const err = {
				code: 200
			};

			error.apply(err, {
				status: 200,
				type: levels.warn,
				code: 301,
				context: {hello: 'world'},
				response: 'boom',
				payload: {foo: 'bar'}
			});

			expect(err.status)
			.to.equal(200);

			expect(err.type)
			.to.equal(levels.warn);

			expect(err.code)
			.to.equal(301);

			expect(err.context)
			.to.deep.equal({hello: 'world'});

			expect(err.trace)
			.to.deep.equal([{
				code: 200,
				context: undefined
			}]);

			expect(err.response)
			.to.equal('boom');

			expect(err.payload)
			.to.deep.equal({foo: 'bar'});
		});
	});
});
