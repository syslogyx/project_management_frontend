app.controller('feedCtrl', function ($scope, services, $routeParams, $http, $location, menuService, $rootScope, breadcrumbs) {
    $scope.breadcrumbs = breadcrumbs;
    var fdcc = this;
    fdcc.project_id = $routeParams.id || "Unknown";

    //Suvrat Issue#3291
    fdcc.user_id = null;
    //////////////////

    fdcc.init = function () {
        id = fdcc.project_id;
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
                    project_menu[j].projectId = fdcc.project_id;
                    if (project_menu[j].menu_name == 'Feeds') {
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
        // for (var i = 0; i <menu.length; i++) {
        //     menu[i].projectId=fdcc.project_id;
        //     if(menu[i].menu_name=='Feeds'){
        //         menu[i].active='active';
        //     }else{
        //         menu[i].active='deactive';
        //     }
        // }
        menuService.setMenu(menu);
        //this if section is for displaying project name in header
        if (fdcc.project_id > 0) {
            //         var promise = services.getProject(fdcc.project_id);
            //         promise.success(function (response) {
            //             Utility.stopAnimation();

            //             var projectName = response.data.name;
            //             fdcc.projectName =  response.data.name;
            // //             $scope.$root.$broadcast("myEvent", {projectName: projectName});
            // //             $scope.$root.$broadcast("myIdEvent", {projectId:  fdcc.project_id});

            // // menuService.setProjectInfo({projectName:projectName,projectId:fdcc.project_id});
            // // $scope.projectInfo= menuService.getProjectInfo();
            // // $rootScope.$emit("menuCtrlMethod",$scope.projectInfo);

            //         }, function myError(r) {
            //             toastr.error(r.data.message, 'Sorry!');
            //             Utility.stopAnimation();

            //         });

            //Suvrat Issue#3291
            var user_id = services.getIdentity();
            fdcc.user_id = user_id.identity.name;
            //////////////////////////////

            var promise = services.projectFeedsList({ "project_id": fdcc.project_id });
            promise.success(function (response) {
                //Suvrat Issue#3166
                var word = response.data[0].message;
                word = word.match(/<b>(.*?)<\/b>/g).map(function (val) {
                    return val.replace(/<\/?b>/g, '');
                });
                word = word.toString();
                $rootScope.project_name = word;
                Utility.stopAnimation();
                fdcc.projectFeedList = response.data;
                //Suvrat Issue#3291 Personalised feeds per user
                for (var i = fdcc.projectFeedList.length - 1; i >= 0; i--) {
                    var temp = fdcc.projectFeedList[i].message;
                    const reg = new RegExp(fdcc.user_id);
                    var username = temp.match(reg);
                    if (username != null) {
                        fdcc.projectFeedList[i] = fdcc.projectFeedList[i];
                    } else if (username == null) {
                        fdcc.projectFeedList.splice(fdcc.projectFeedList.indexOf(fdcc.projectFeedList[i]), 1);
                    }
                }
                //////////////////////////
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });

            var promise = services.getMilestoneListByProject({ "project_id": fdcc.project_id });
            promise.success(function (response) {
                Utility.stopAnimation();
                fdcc.milestoneList = response.data.data;
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    fdcc.init();

    fdcc.searchMilestone = function (id) {
        var req = {
            "milestone_id": id,
            "project_id": fdcc.project_id
        };

        var promise = services.searchListOfTask(req);
        promise.then(function mySuccess(response) {
            Utility.stopAnimation();
            try {
                if (id != null) {
                    toastr.success('Search successful.');
                }
                fdcc.searchTaskList = response.data.data.data;
            } catch (e) {
                toastr.error("No Record Found");
                Raven.captureException(e)
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    };

    fdcc.getActivityLogsFilter = function () {
        var start_date = null;
        var due_date = null;
        var milestone_id = null;
        if (fdcc.dateRange != undefined) {
            var datearr = fdcc.dateRange.split('-');
            start_date = Utility.formatDate(datearr[0], "Y/m/d");
            due_date = Utility.formatDate(datearr[1], "Y/m/d");
            // if(start_date == due_date) {
            //     start_date = null;
            //     due_date = null;
            // }
        }

        if (fdcc.milestoneId != undefined) {
            milestone_id = fdcc.milestoneId;
        }

        var req = {
            "project_id": fdcc.project_id,
            "milestone_id": milestone_id,
            "task_id": 0,
            "start_date": start_date,
            "due_date": due_date
        };

        var promise = services.projectFeedsList(req);
        promise.success(function (response) {
            Utility.stopAnimation();
            fdcc.projectFeedList = response.data;
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    fdcc.refreshfilter = function () {
        fdcc.milestoneId = null;
        fdcc.dateRange = null;
        fdcc.init();
        // var currentDate = Utility.formatDate(new Date());
        // $('#datepicker').daterangepicker({ startDate: currentDate, endDate: '' }).val('');
    }

});
