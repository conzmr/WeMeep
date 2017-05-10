angular.module('musementApp')
    .directive('contentItem', function($compile, TemplateService) {
        var getTemplate = function(contentType) {
            var template = '';
            switch (contentType) {
                case 'scale':
                    template = '/static/views/templates/testScale.html';
                case 'check':
                    template = '/static/views/templates/testCheck.html';
            }
            return template;
        };

        var linker = function(scope, element, attrs) {
            scope.rootDirectory = 'images/';

            TemplateService.getTemplates().then(function(response) {

                element.html(getTemplate(scope.content.content_type));

                $compile(element.contents())(scope);
            });
        };

        return {
            restrict: 'E',
            link: linker,
            scope: {
                content: '='
            }
        };
    });
