/**
 * @author		Jim Martens
 * @copyright	2011-2014 Jim Martens
 * @license		http://www.gnu.org/licenses/lgpl-3.0 GNU Lesser General Public License, version 3
 * @link		https://github.com/frmwrk123/de.plugins-zum-selberbauen.ultimate/blob/master/src/js/ULTIMATE.js
 * 
 * edited by	Florian Gail
 */

if (!WCF) WCF = {};

if (!WCF) WCF.ACP = {};

WCF.ACP.MultipleLanguageWYSIWYG = WCF.MultipleLanguageInput.extend({
	/**
	 * target textarea element
	 * @var	jQuery
	 */
	_element: null,

	/**
	 * target wysiwyg box
	 * @var jQuery
	 */
	_box: null,

	/**
	 * Checks if disable has been called.
	 * @var Boolean
	 */
	_disableCalled: false,
	
	/**
	 * Initializes multiple language ability for given element id.
	 *
	 * @param {String}	elementID
	 * @param {Boolean}	forceSelection
	 * @param {Object}	values
	 * @param {Object}	availableLanguages
	 */
	init: function(elementID, forceSelection, values, availableLanguages) {
		this._element = $('#' + $.wcfEscapeID(elementID));
		this._box = this._element.redactor('core.getBox');
		
		this._super(elementID, forceSelection, values, availableLanguages);
	},
	
	/**
	 * Builds language handler.
	 *
	 * @param {Boolean} enableOnInit
	 */
	_prepareElement: function(enableOnInit) {
		this._box.wrap('<div class="dropdown preInput" />');
		var $wrapper = this._box.parent();
		this._button = $('<p class="button dropdownToggle"><span>' + WCF.Language.get('wcf.global.button.disabledI18n') + '</span></p>').prependTo($wrapper);
		
		// insert list
		this._list = $('<ul class="dropdownMenu"></ul>').insertAfter(this._button);
		
		// add a special class if next item is a textarea
		this._button.addClass('dropdownCaptionTextarea');
		
		// insert available languages
		for (var $languageID in this._availableLanguages) {
			$('<li><span>' + this._availableLanguages[$languageID] + '</span></li>').data('languageID', $languageID).click($.proxy(this._changeLanguage, this)).appendTo(this._list);
		}
		
		// disable language input
		if (!this._forceSelection) {
			$('<li class="dropdownDivider" />').appendTo(this._list);
			$('<li><span>' + WCF.Language.get('wcf.global.button.disabledI18n') + '</span></li>').click($.proxy(this._disable, this)).appendTo(this._list);
		}
		
		WCF.Dropdown.initDropdown(this._button, enableOnInit);
		
		if (enableOnInit || this._forceSelection) {
			this._isEnabled = true;
			
			// pre-select current language
			this._list.children('li').each($.proxy(function(index, listItem) {
				var $listItem = $(listItem);
				if ($listItem.data('languageID') == this._languageID) {
					$listItem.trigger('click');
				}
			}, this));
		}
		
		WCF.Dropdown.registerCallback($wrapper.wcfIdentify(), $.proxy(this._handleAction, this));
	},
	
	/**
	 * Changes the currently active language.
	 *
	 * @param {Object} event
	 */
	_changeLanguage: function(event) {
		var $button = $(event.currentTarget);
		this._insertedDataAfterInit = true;
		
		if (this._disableCalled) {
			this._disableCalled = false;
		}
		
		// save current value
		if (this._didInit) {
			this._values[this._languageID] = this._element.redactor('wutil.getText');
		}
		
		// set new language
		this._languageID = $button.data('languageID');
		if (this._values[this._languageID]) {
			this._element.val(this._values[this._languageID]);
			this._element.redactor('code.set', this._values[this._languageID]);
		} else {
			this._element.val('');
			this._element.redactor('code.set', '');
		}
		
		// update marking
		this._list.children('li').removeClass('active');
		$button.addClass('active');
		
		// update label
		this._button.children('span').addClass('active').text(this._availableLanguages[this._languageID]);
	},
	
	/**
	 * Disables language selection for current element.
	 *
	 * @param {Object} event
	 */
	_disable: function(event) {
		if (event === undefined && this._insertedDataAfterInit) {
			event = null;
		}
		
		if (this._forceSelection || !this._list || event === null || this._disableCalled) {
			return;
		}
		
		this._disableCalled = true;
		// remove active marking
		this._button.children('span').removeClass('active').text(WCF.Language.get('wcf.global.button.disabledI18n'));
		
	   // update element value
		if (this._values[window.LANGUAGE_ID]) {
			this._element.redactor('code.set', this._values[window.LANGUAGE_ID]);
		} else {
			this._element.redactor('code.set', '');
		}
		this._languageID = window.LANGUAGE_ID;
		
		if (event) {
			this._list.children('li').removeClass('active');
			$(event.currentTarget).addClass('active');
		}
		
		this._insertedDataAfterInit = false;
		this._isEnabled = false;
		this._values = { };
	},
	
	/**
	 * Prepares language variables on before submit.
	 */
	_submit: function() {
		// insert hidden form elements on before submit
		if (!this._isEnabled) {
			return 0xDEADBEEF;
		}
		
		// fetch active value
		if (this._languageID) {
			this._values[this._languageID] = this._element.redactor('wutil.getText');
		}
		
		var $form = $(this._element.parents('form')[0]);
		var $elementID = this._element.wcfIdentify();
		
		for (var $languageID in this._availableLanguages) {
			if (this._availableLanguages.hasOwnProperty($languageID) && this._values[$languageID] === undefined) {
				this._values[$languageID] = '';
			}
			
			$('<input type="hidden" name="' + $elementID + '_i18n[' + $languageID + ']" value="' + WCF.String.escapeHTML(this._values[$languageID]) + '" />').appendTo($form);
		}
		
		// remove name attribute to prevent conflict with i18n values
		this._element.removeAttr('name');
	}
});
