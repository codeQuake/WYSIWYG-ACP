<style>
	woltlab-mention {
		background-color: rgb(240, 248, 255);
		border: 1px solid rgb(52, 152, 219);
		display: inline-block;
		margin: 0 3px;
		padding: 0 2px;
	}
</style>
<script data-relocate="true">
(function() {
	var buttons = ['format', 'wcfSeparator', 'bold', 'italic', 'underline', 'deleted', 'wcfSeparator', 'lists', 'image', 'link'];
	
	var elementId = '{if $wysiwygSelector|isset}{$wysiwygSelector|encodeJS}{else}text{/if}';
	var callbackIdentifier = 'Redactor2_' + elementId;
	
	WCF.System.Dependency.Manager.setup(callbackIdentifier, function() {
		// TODO: Should the media stuff be here?
		{include file='mediaJavaScript'}
		
		var element = elById(elementId);
		var autosave = elData(element, 'autosave') || '';
		if (autosave) {
			element.removeAttribute('data-autosave');
		}
		
		var config = {
			buttons: buttons,
			minHeight: 200,
			plugins: ['WoltLabButton', 'WoltLabColor', 'WoltLabDropdown', 'WoltLabEvent', 'WoltLabLink', 'WoltLabQuote'],
			woltlab: {
				autosave: autosave
			}
		};
		
		// user mentions
		if (elDataBool(element, 'support-mention')) {
			config.plugins.push('WoltLabMention');
		}
		
		// media
		{if $__wcf->session->getPermission('admin.content.cms.canUseMedia')}
			config.plugins.push('WoltLabMedia');
		{/if}
		
		$(element).redactor(config);
	});
		
	head.load([
		'{@$__wcf->getPath()}js/3rdParty/redactor2/redactor.js?v={@LAST_UPDATE_TIME}',
		
		{* WoltLab *}
		'{@$__wcf->getPath()}js/3rdParty/redactor2/plugins/WoltLabButton.js?v={@LAST_UPDATE_TIME}',
		'{@$__wcf->getPath()}js/3rdParty/redactor2/plugins/WoltLabColor.js?v={@LAST_UPDATE_TIME}',
		'{@$__wcf->getPath()}js/3rdParty/redactor2/plugins/WoltLabDropdown.js?v={@LAST_UPDATE_TIME}', 
		'{@$__wcf->getPath()}js/3rdParty/redactor2/plugins/WoltLabEvent.js?v={@LAST_UPDATE_TIME}',
		'{@$__wcf->getPath()}js/3rdParty/redactor2/plugins/WoltLabLink.js?v={@LAST_UPDATE_TIME}',
		{if $__wcf->session->getPermission('admin.content.cms.canUseMedia')}'{@$__wcf->getPath()}js/3rdParty/redactor2/plugins/WoltLabMedia.js?v={@LAST_UPDATE_TIME}',{/if}
		'{@$__wcf->getPath()}js/3rdParty/redactor2/plugins/WoltLabMention.js?v={@LAST_UPDATE_TIME}',
		'{@$__wcf->getPath()}js/3rdParty/redactor2/plugins/WoltLabQuote.js?v={@LAST_UPDATE_TIME}'
		
		], function() {
			WCF.System.Dependency.Manager.invoke(callbackIdentifier);
		}
	);
})();
</script>
