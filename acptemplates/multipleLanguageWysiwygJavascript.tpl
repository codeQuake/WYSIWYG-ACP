{if $availableLanguages|count > 1}
	<script data-relocate="true" src="{@$__wcf->getPath('wcf')}acp/js/WCF.ACP.MultipleLanguageWYSIWYG.js?v={@LAST_UPDATE_TIME}"></script>
	<script data-relocate="true">
		//<![CDATA[
			var $availableLanguages = { {implode from=$availableLanguages key=languageID item=languageName}{@$languageID}: '{$languageName}'{/implode} };
			var $values = { {implode from=$i18nValues[$elementIdentifier] key=languageID item=value}'{@$languageID}': '{$value}'{/implode} };
			$(function() {
				WCF.System.Dependency.Manager.register('Redactor_' + '{@$elementIdentifier}', function() {
					new WCF.ACP.MultipleLanguageWYSIWYG('{@$elementIdentifier}', {if $forceSelection}true{else}false{/if}, $values, $availableLanguages);
				});
			});
		//]]>
	</script>
{/if}
