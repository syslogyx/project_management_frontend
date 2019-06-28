app.controller("documentCtrl", function ($scope, services, $routeParams, $http, $location, menuService, $rootScope, breadcrumbs) {

    $scope.breadcrumbs = breadcrumbs;
    var dzc = this;
    dzc.project_id = $routeParams.id || "Unknown";
    id = dzc.project_id;
    var dashboard_menu = menuService.getDashboardMenu();
    var project_menu = menuService.getProjectMenu();

    for (var i = 0; i < dashboard_menu.length; i++) {
        if (dashboard_menu[i].menu_name == 'Projects') {
            dashboard_menu[i].url = '';
            dashboard_menu[i].child = [];
            dashboard_menu[i].active = 'active';
            for (var j = 0; j < project_menu.length; j++) {
                if (project_menu[j].menu_name !== 'Project Info') {
                    // project_menu[j].url += id;
                    url_id = project_menu[j].url.split("/");
                    // url_id[((url_id.length)-1)] = id;
                    for (var k = 0; k < url_id.length; k++) {
                        if (url_id[k] == 'id' || !isNaN(url_id[k])) {
                            if (url_id[k] != '') {
                                url_id[k] = id;
                            }
                        }
                    }
                    url_id = url_id.join('/');
                    project_menu[j].url = url_id;
                }
                project_menu[j].projectId = dzc.project_id;
                if (project_menu[j].menu_name == 'Documents') {
                    project_menu[j].active = 'active';
                } else {
                    project_menu[j].active = 'deactive';
                }
                dashboard_menu[i].child.push(project_menu[j]);
            }
        }
    }
    var menu = dashboard_menu;

    // var menu=menuService.getProjectMenu();
    //   for (var i = 0; i <menu.length; i++) {
    //       menu[i].projectId=dzc.project_id;
    //       if(menu[i].menu_name=='Documents'){
    //           menu[i].active='active';
    //       }else{
    //           menu[i].active='deactive';
    //       }
    //   }
    menuService.setMenu(menu);

    //this if section is for displaying project name in header
    dzc.init = function () {
        if (dzc.project_id > 0) {
            var promise = services.getProject(dzc.project_id);
            promise.success(function (response) {
                //Suvrat Issue#3166
                $rootScope.project_name = response.data.name;
                Utility.stopAnimation();
                //var projectName = response.data.name;
                //$scope.$root.$broadcast("myEvent", {projectName: projectName});
                //$scope.$root.$broadcast("myIdEvent", {projectId:  dzc.project_id});
                //menuService.setProjectInfo({projectName:projectName,projectId:dzc.project_id});
                // $scope.projectInfo= menuService.getProjectInfo();
                // $rootScope.$emit("menuCtrlMethod",$scope.projectInfo);
                //}, function myError(r) {
                //toastr.error(r.data.message, 'Sorry!');
                //Utility.stopAnimation();
            });
        }
    }

    dzc.init();
});
