app.controller("activityStatusCtrl", function ($scope, services, $routeParams, $rootScope, $http, $location, menuService, breadcrumbs) {
    $scope.breadcrumbs = breadcrumbs;
    var act = this;
    act.project_id = $routeParams.id || "Unknown";

    act.init = function () {
        if (act.project_id > 0) {
            var req = {
                "project_id": act.project_id,
                "activity_type": "PROJECT",
            };

            var menu = menuService.getMenu();

            for (var i = 0; i < menu.length; i++) {
                menu[i].projectId = act.project_id;

                if (menu[i].menu_name == 'Activity Status') {
                    menu[i].active = 'active';
                } else {
                    menu[i].active = 'deactive';
                }
            }
            menuService.setMenu(menu);

            var promise = services.getActivityStatusProject(req);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();

                /*var projectName = response.data.data.name;
                 $scope.$root.$broadcast("myEvent", {projectName: projectName});
                 $scope.$root.$broadcast("myIdEvent", {projectId: mst.project_id});*/
                if (response.data.project_activity_status_logs) {
                    for (var i = 0; i < response.data.project_activity_status_logs.length; i++) {
                        if (response.data.project_activity_status_logs[i]) {
                            var date = Utility.descriptiveFormatOfDate(response.data.project_activity_status_logs[i].created_at);
                            response.data.project_activity_status_logs[i].created_at = date;
                        }
                    }
                }

                /* var date = Utility.descriptiveFormatOfDate(response.data.project_activity_status_logs[0].created_at);
                 response.data.project_activity_status_logs[0].created_at = date;*/

                act.overallActivityStatus = response.data.project_activity_status_logs;
                //this section is for displaying related specific project name in header
                // var promise = services.getProject(act.project_id);
                // promise.success(function (response) {
                //     Utility.stopAnimation();
                //     var projectName = response.data.name;
                //     menuService.setProjectInfo({projectName:projectName,projectId:act.project_id});
                //     $scope.projectInfo= menuService.getProjectInfo();
                //     $rootScope.$emit("menuCtrlMethod",$scope.projectInfo);
                //     $scope.$root.$broadcast("myEvent", {projectName: projectName});
                //     $scope.$root.$broadcast("myIdEvent", {projectId: act.project_id});
                // }, function myError(r) {
                //     toastr.error(r.data.message, 'Sorry!');
                //     Utility.stopAnimation();
                // });
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    act.init();
});
