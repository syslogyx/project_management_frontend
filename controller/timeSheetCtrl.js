app.controller('timeSheetCtrl', function ($scope, services, $routeParams, $http, $location, menuService, $rootScope, breadcrumbs) {
    $scope.breadcrumbs = breadcrumbs;
    var tmc = this;
    tmc.project_id = $routeParams.id || "Unknown";

    var menu = menuService.getDashboardMenu();
    for (var i = 0; i < menu.length; i++) {
        if (menu[i].menu_name == 'Projects') {
            menu[i].url = '/project/';
            menu[i].child = [];
        }
        if (menu[i].menu_name == 'Timesheet') {
            menu[i].active = 'active';
        } else {
            menu[i].active = 'deactive';
        }
    }
    menuService.setMenu(menu);

    // var menu=menuService.getProjectMenu();
    //   for (var i = 0; i <menu.length; i++) {
    //       menu[i].projectId=tmc.project_id;
    //       if(menu[i].menu_name=='Timesheet'){
    //           menu[i].active='active';
    //       }else{
    //           menu[i].active='deactive';
    //       }
    //   }
    // menuService.setMenu(menu);

    tmc.init = function () {
        //this if section is for displaying project name in header
        // if (tmc.project_id > 0) {
        //     var promise = services.getProject(tmc.project_id);
        //     promise.success(function (response) {
        //         Utility.stopAnimation();
        //         var projectName = response.data.name;
        //         $scope.$root.$broadcast("myEvent", {projectName: projectName});
        //         $scope.$root.$broadcast("myIdEvent", {projectId:  tmc.project_id});
        // menuService.setProjectInfo({projectName:projectName,projectId:tmc.project_id});
        // $scope.projectInfo= menuService.getProjectInfo();
        // $rootScope.$emit("menuCtrlMethod",$scope.projectInfo);
        //     }, function myError(r) {
        //         toastr.error(r.data.message, 'Sorry!');
        //         Utility.stopAnimation();
        //     });
        // }
    }

    tmc.init();

});
