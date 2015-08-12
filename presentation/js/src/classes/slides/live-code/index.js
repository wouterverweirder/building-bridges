module.exports = (function(){
	var ContentBase = require('../ContentBase');
	var Constants = require('Constants');

	var ConsoleElement = require('./ConsoleElement');
	var CodeElement = require('./CodeElement');
	var WebPreviewElement = require('./WebPreviewElement');

	function LiveCode(name) {
		ContentBase.call(this, name);

		this.slideControlEnabled = false;
		console.log("[LiveCode] init");

		//create the consoles
		this.consoleElements = {};
		$('[data-type="console"]').each((function(index, consoleEl){
			this.createConsoleElement(consoleEl);
		}).bind(this));

		//create the previews
		this.webPreviewElements = {};
		$('[data-type="web-preview"]').each((function(index, webPreviewEl){
			this.createWebPreviewElement(webPreviewEl);
		}).bind(this));

		//create the code editors
		this.codeElements = {};
		$('[data-type="code"]').each((function(index, codeEl){
			this.createCodeElement(codeEl);
		}).bind(this));

		//create run buttons
		$('[data-type="run-button"]').each((function(index, runButtonEl){
			this.createRunButton(runButtonEl);
		}).bind(this));
	}

	LiveCode.prototype = Object.create(ContentBase.prototype);

	LiveCode.prototype.layout = function() {
		//might be triggered after split pane resize or tab switch
		//codemirror instances need to be updated
		for(var key in this.codeElements)
		{
			this.codeElements[key].layout();
		}
	};

	LiveCode.prototype.createConsoleElement = function(consoleEl) {
		var consoleElement = new ConsoleElement(consoleEl);
		this.consoleElements[consoleElement.id] = consoleElement;
	};

	LiveCode.prototype.createWebPreviewElement = function(webPreviewEl) {
		var webPreviewElement = new WebPreviewElement(webPreviewEl);
		this.webPreviewElements[webPreviewElement.id] = webPreviewElement;
	};

	LiveCode.prototype.createCodeElement = function(codeEl) {
		var codeElement = new CodeElement(codeEl);
		this.codeElements[codeElement.id] = codeElement;
	};

	LiveCode.prototype.createRunButton = function(runButtonEl) {
		$(runButtonEl).on('click', (function(){
			//run code in target element
			if(this.codeElements[$(runButtonEl).data('target')]) {
				this.runCode(this.codeElements[$(runButtonEl).data('target')]);
			}
		}).bind(this));
	};

	LiveCode.prototype.runCode = function(codeElement) {
		var code = codeElement.getValue();
		//where do we run this code? nodejs or in browser?
		if(codeElement.runtime === 'node')
		{
			//run as child-app
			this.postMessage({
				action: Constants.CHILD_APP_RUN_CODE,
				code: code
			});
		}
		else
		{
			//get the web preview element which is handling this code
			var webPreviewElement = this.getWebPreviewElementForCodeElement(codeElement);
			if(webPreviewElement)
			{
				this.updateWebPreviewElement(webPreviewElement);
			}
		}
	};

	LiveCode.prototype.handleMessage = function(message) {
		var consoleElement;
		if(message.action === Constants.CHILD_APP_STDOUT_DATA)
		{
			consoleElement = this.getConsoleElement('node');
			if(consoleElement)
			{
				consoleElement.info(message.data);
			}
		}
		else if(message.action === Constants.CHILD_APP_STDERR_DATA)
		{
			consoleElement = this.getConsoleElement('node');
			if(consoleElement)
			{
				consoleElement.error(message.data);
			}
		}
	};

	LiveCode.prototype.getConsoleElement = function(runtime) {
		//<textarea id="node-code" data-type="code" data-runtime="node" data-console="node-console" data-language="javascript">
		for(var key in this.codeElements)
		{
			var codeElement = this.codeElements[key];
			if(codeElement.runtime === runtime && this.consoleElements[codeElement.console])
			{
				return this.consoleElements[codeElement.console];
			}
		}
		return false;
	};

	LiveCode.prototype.getWebPreviewElementForCodeElement = function(codeElement) {
		return this.webPreviewElements[codeElement.processor];
	};

	LiveCode.prototype.updateWebPreviewElement = function(webPreviewElement) {
		//gather all the code for this element
		var blocks = [];
		for(var key in this.codeElements)
		{
			var codeElement = this.codeElements[key];
			if(codeElement.processor === webPreviewElement.id)
			{
				var block = {
					language: codeElement.language,
					code: codeElement.getValue()
				};
				blocks.push(block);
			}
		}
		webPreviewElement.updateCode(blocks);
	};

	LiveCode.prototype.saveClickHandler = function() {
		var code = this.codeMirror.getValue();
		this.postMessage({
			action: Constants.CHILD_APP_SAVE_CODE,
			code: code,
			type: this.type
		});
		this.postMessage({
			action: Constants.OPEN_COMMAND_LINE
		});
	};

	LiveCode.prototype.runClickHandler = function() {
		var code = this.codeMirror.getValue();
		this.postMessage({
			action: Constants.CHILD_APP_RUN_CODE,
			code: code,
			type: this.type
		});
		this.postMessage({
			action: Constants.OPEN_CAMERA
		});
	};

	return LiveCode;

})();
