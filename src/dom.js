var bmoor = require('./core.js'),
	regex = {};

function getReg( className ){
	var reg = regex[className];

	if ( !reg ){
		reg = new RegExp('(?:^|\\s)'+className+'(?!\\S)');
		regex[className] = reg;
	}

	return reg;
}

function getBoundryBox( element ){
	return element.getBoundingClientRect();
}

function centerOn( element, target, doc ){
	var el = getBoundryBox(element),
		targ = getBoundryBox( target );

	if ( !doc ){
		doc = document;
	}

	element.style.top = targ.top + targ.height/2 - el.height / 2;
	element.style.left = targ.left + targ.width/2 - el.width / 2;
	element.style.position = 'absolute';

	doc.body.appendChild( element );
}

function massage( elements ){
	if ( !bmoor.isArrayLike(elements) ){
		elements = [elements];
	}

	return elements;
}

function getDomCollection( elements, doc ){
	var i, c,
		j, co,
		el,
		selection,
		els = [];

	if ( !doc ){
		doc = document;
	}

	elements = massage(elements);

	for( i = 0, c = elements.length; i < c; i++ ){
		el = elements[i];
		if ( bmoor.isString(el) ){
			selection = doc.querySelectorAll(el);
			for( j = 0, co = selection.length; j < co; j++ ){
				els.push( selection[j] );
			}
		}else{
			els.push( el );
		}
	}

	return els;
}

function addClass( elements, className ){
	var i, c,
		node,
		baseClass,
		reg = getReg( className );

	elements = massage( elements );
	
	for( i = 0, c = elements.length; i < c; i++ ){
		node = elements[i];
		baseClass = node.getAttribute('class') || '';

		if ( !baseClass.match(reg) ){
			node.setAttribute( 'class', baseClass+' '+className );
		}
	}
}

function removeClass( elements, className ){
	var i, c,
		node,
		reg = getReg( className );

	elements = massage( elements );
	
	for( i = 0, c = elements.length; i < c; i++ ){
		node = elements[i];
		node.setAttribute( 'class', (node.getAttribute('class')||'').replace(reg,'') );
	}
}

function triggerEvent( elements, eventName, eventData ){
	var i, c,
		doc,
		node,
		event,
		EventClass;

	elements = massage( elements );
	
	for( i = 0, c = elements.length; i < c; i++ ){
		node = elements[i];
		
		// Make sure we use the ownerDocument from the provided node to avoid cross-window problems
		if (node.ownerDocument){
			doc = node.ownerDocument;
		}else if (node.nodeType === 9){
			// the node may be the document itself, nodeType 9 = DOCUMENT_NODE
			doc = node;
		}else if ( typeof document !== 'undefined' ){
			doc = document;
		}else{
			throw new Error('Invalid node passed to fireEvent: ' + node.id);
		}

		if ( node.dispatchEvent ){
			try{
				// modern, except for IE still? https://developer.mozilla.org/en-US/docs/Web/API/Event
				// I ain't doing them all
				// slightly older style, give some backwards compatibility
				switch (eventName) {
					case 'click':
					case 'mousedown':
					case 'mouseup':
						EventClass = MouseEvent;
						break;

					case 'focus':
					case 'blur':
						EventClass = FocusEvent; // jshint ignore:line
						break;

					case 'change':
					case 'select':
						EventClass = UIEvent; // jshint ignore:line
						break;

					default:
						EventClass = CustomEvent;
				}

				if ( !eventData ){
					eventData = { 'view': window, 'bubbles': true, 'cancelable': true };
				}else{
					if ( eventData.bubbles === undefined ){
						eventData.bubbles = true;
					}
					if ( eventData.cancelable === undefined ){
						eventData.cancelable = true;
					}
				}

				event = new EventClass( eventName, eventData );
			}catch( ex ){
				// slightly older style, give some backwards compatibility
				switch (eventName) {
					case 'click':
					case 'mousedown':
					case 'mouseup':
						EventClass = 'MouseEvents';
						break;

					case 'focus':
					case 'change':
					case 'blur':
					case 'select':
						EventClass = 'HTMLEvents';
						break;

					default:
						EventClass = 'CustomEvent';
				}
				event = doc.createEvent(EventClass);
				event.initEvent(eventName, true, true); 
			}

			event.$synthetic = true; // allow detection of synthetic events
			
			node.dispatchEvent(event);
		}else if (node.fireEvent){
			// IE-old school style
			event = doc.createEventObject();
			event.$synthetic = true; // allow detection of synthetic events
			node.fireEvent('on' + eventName, event);
		}
	}
}

function bringForward( elements ){
	var i, c,
		node;

	elements = massage( elements );

	for( i = 0, c = elements.length; i < c; i++ ){
		node = elements[i];

		if ( node.parentNode ){
			node.parentNode.appendChild( node );
		}
	}
}

module.exports = {
	getBoundryBox: getBoundryBox,
	getDomCollection: getDomCollection,
	centerOn: centerOn,
	addClass: addClass,
	removeClass: removeClass,
	triggerEvent: triggerEvent,
	bringForward: bringForward
};