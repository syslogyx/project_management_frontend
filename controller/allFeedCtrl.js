app.controller('allFeedCtrl', function ($scope, $rootScope, services, $http, $location, menuService, breadcrumbs) {
    $scope.breadcrumbs = breadcrumbs;
    var allfdc = this;
    // $scope.$root.$broadcast("myEvent", {projectName: ""});

    // $rootScope.$emit("menuCtrlMethod",{});
    var menu = menuService.getDashboardMenu();

    for (var i = 0; i < menu.length; i++) {
        if (menu[i].menu_name == 'Projects') {
            menu[i].url = '/project/';
            menu[i].child = [];
        }
        if (menu[i].menu_name == 'Feed') {
            menu[i].active = 'active';
        } else {
            menu[i].active = 'deactive';
        }
    }
    menuService.setMenu(menu);

    allfdc.init = function () { }

    allfdc.init();
});
