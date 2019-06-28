app.controller('milestoneCtrl', function ($window, $scope, $http, $filter, AclService, $routeParams, pagination, services, $location, menuService, $rootScope, breadcrumbs) {

    $scope.breadcrumbs = breadcrumbs;
    var mst = this;
    mst.title = 'Add New Milestone';
    $scope.can = AclService.can;
    mst.id = null;
    mst.milestoneName = "";
    mst.description = "";
    mst.milestoneStartDate = "";
    mst.milestoneEndDate = "";
    mst.projectName = "";
    mst.milestoneIndex = "";
    mst.milestoneStatus = "Pending";
    mst.status = "";
    mst.project_id = $routeParams.id || "Unknown";
    mst.version = "";
    mst.pageno = 0;
    mst.limit = 0;

    mst.totalEntries = null;
    mst.fromValue = null;
    mst.toValue = null;

    mst.hgt = Math.round($window.innerHeight / 3.2);
    mst.milestonIndex = [
        { id: 1, name: "1" },
        { id: 2, name: "2" },
        { id: 3, name: "3" },
        { id: 4, name: "4" },
        { id: 5, name: "5" },
        { id: 6, name: "6" },
        { id: 7, name: "7" },
        { id: 8, name: "8" },
        { id: 9, name: "9" },
        { id: 10, name: "10" },
        { id: 11, name: "11" },
        { id: 12, name: "12" }
    ];
    mst.version = 1;

    var loggedInUser = services.getIdentity();

    mst.addNewMilestone = function () {
        // projId = $location.path().split("/")[1] || "Unknown";
        $location.path('/project/milestone/add/' + mst.project_id);
    };

    setTimeout(function () {
        $('#table_length').on('change', function () {
            mst.fetchList(-1);
        });
    }, 100);

    mst.fetchList = function (page) {
        mst.limit = $('#table_length').val();
        if (mst.limit == undefined) {
            mst.limit = -1;
        }
        if (page == -1) {
            mst.pageno = 1;
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else {
            mst.pageno = page;
        }
        var requestParam = {
            page: mst.pageno,
            // limit:pagination.getpaginationLimit(),
            limit: mst.limit,
        };

        var req = {
            "project_id": mst.project_id
        };

        var promise = services.getMilestoneListByProject(req, requestParam);
        promise.then(function mySuccess(response) {
            Utility.stopAnimation();
            if (response.data.data.data != null) {
                for (var i = 0; i < response.data.data.data.length; i++) {
                    response.data.data.data[i].start_date = Utility.formatDate(response.data.data.data[i].start_date);
                    response.data.data.data[i].due_date = Utility.formatDate(response.data.data.data[i].due_date);
                }
                mst.overallMilestone = response.data.data.data;
                mst.totalEntries = response.data.data.total;
                mst.fromValue = response.data.data.from;
                mst.toValue = response.data.data.to;
                pagination.applyPagination(response.data.data, mst);
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        /* Getting all status and displaying in status dropdown*/
        var promise = services.getAllStatus("project");
        promise.success(function (result) {
            Utility.stopAnimation();
            mst.status = result.data;
        });
    };

    mst.init = function () {
        id = mst.project_id;
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
                    project_menu[j].projectId = mst.project_id;
                    if (project_menu[j].menu_name == 'Milestones') {
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
        //     menu[i].projectId=mst.project_id;
        //     if(menu[i].menu_name=='Milestones'){
        //         menu[i].active='active';
        //     }else{
        //         menu[i].active='deactive';
        //     }
        // }
        menuService.setMenu(menu);

        if (mst.project_id > 0) {

            var promise = services.getMilestoneIndex(mst.project_id);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                mst.version = response.data;
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });

            var promise = services.getProject(mst.project_id);
            promise.then(function mySuccess(response) {
                //Suvrat Issue#3166
                $rootScope.project_name = response.data.data.name;
                Utility.stopAnimation();
                var projectName = response.data.data.name;
                mst.projectStartDate = Utility.formatDate(response.data.data.start_date);
                mst.projectEndDate = Utility.formatDate(response.data.data.due_date);
                mst.projectRevDate = Utility.formatDate(response.data.data.revised_date);
                // $scope.$root.$broadcast("myEvent", {projectName: projectName});
                // $scope.$root.$broadcast("myIdEvent", {projectId: mst.project_id});
                // menuService.setProjectInfo({projectName:projectName,projectId:mst.project_id});
                // $scope.projectInfo= menuService.getProjectInfo();
                // $rootScope.$emit("menuCtrlMethod",$scope.projectInfo);

                for (var i = 0; i < response.data.data.milestones.length; i++) {
                    response.data.data.milestones[i].start_date = Utility.formatDate(response.data.data.milestones[i].start_date);
                    response.data.data.milestones[i].due_date = Utility.formatDate(response.data.data.milestones[i].due_date);
                    response.data.data.milestones[i].revised_date = Utility.formatDate(response.data.data.milestones[i].revised_date);
                }

                // var sd = $("#sprojStartDate").val();
                // var ed = $("#sprojEndDate").val();

                var sd = mst.projectStartDate;
                var ed = mst.projectEndDate;

                setTimeout(function () {
                    var path = window.location.pathname;
                    if (path.split("/")[2] == "add") {
                        $('#startDate').datepicker().datepicker('setStartDate', sd).datepicker('setDate', sd).datepicker('setEndDate', ed);
                        $('#endDate').datepicker().datepicker('setStartDate', sd).datepicker('setDate', ed).datepicker('setEndDate', ed);
                    } else {
                        $('#startDate').datepicker().datepicker('setStartDate', sd).datepicker('setEndDate', ed);
                        $('#endDate').datepicker().datepicker('setStartDate', sd).datepicker('setEndDate', ed);
                    }
                }, 800);
                // mst.overallMilestone = response.data.data.milestones;
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });

            /* Getting all status and displaying in status dropdown*/
            var promise = services.getAllStatus("project");
            promise.success(function (result) {
                Utility.stopAnimation();
                mst.status = result.data;
            });
        }

        //get milestone list
        if (mst.project_id > 0) {
            //fetch all project list
            mst.fetchList(-1);
            // mst.limit = pagination.getpaginationLimit();
            mst.limit = $('#table_length').val();
        }

        mst.id = $location.search()["id"];
        if (mst.id > 0) {
            var promise = services.getMilestone({ id: mst.id });
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                mst.title = 'Update milestone';
                mst.milestoneName = response.data.data.title;
                mst.description = response.data.data.description;
                mst.milestoneStartDate = Utility.formatDate(response.data.data.start_date);
                mst.milestoneEndDate = Utility.formatDate(response.data.data.due_date);
                mst.version = response.data.data.milestone_index;
                mst.milestoneStatus = response.data.data.status_id;
                mst.tasks = response.data.data.task;
                setTimeout(function () {
                    // mst.description = response.data.data.description;
                    // Suvrat Use try catch block to remove unnecessary error
                    try {
                        if (mst.description) {
                            CKEDITOR.instances.description.setData(mst.description);
                        }
                    } catch (e) {
                        //Do nothing
                        // console.log();
                    }
                    ///////////////////////////////////////////////
                }, 700);
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    };

    mst.init();

    mst.saveMilestone = function () {
        if ($("#milestoneForm").valid()) {
            //mst.submitClicked= true;
            /* var startDate = services.convertDateReverse(mst.milestoneStartDate);
            var endDate = services.convertDateReverse(mst.milestoneEndDate);*/

            var startDate = Utility.formatDate(mst.milestoneStartDate, "Y/m/d");
            var endDate = Utility.formatDate(mst.milestoneEndDate, "Y/m/d");
            var desc = CKEDITOR.instances.description.getData();

            var req = {
                "title": mst.milestoneName,
                "description": desc,
                "revised_date": startDate,
                "start_date": startDate,
                "due_date": endDate,
                "project_id": mst.project_id,
                "milestone_index": mst.version,
                "status_id": mst.milestoneStatus,
                "created_by": loggedInUser.id,
                "updated_by": loggedInUser.id,
            };

            if (mst.id) {
                req.id = mst.id;
                mst.title = 'Update milestone';
                var operationMessage = " updated ";
                var forToasterTemp = false;
                var promise = services.updateMilestone(req);
            } else {
                mst.version = Number(mst.version) + 1;
                req.milestone_index = mst.version;
                var promise = services.saveMilestone(req);
                var forToasterTemp = true;
                var operationMessage = " created ";
            }

            // Suvrat Issue#3172
            var promise2 = services.getMilestoneListByProject({ "project_id": req.project_id });
            promise2.success(function (result) {
                mst.milestoneList = result.data.data;
            });

            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    if (forToasterTemp) {
                        swal({
                            title: 'Milestone' + operationMessage + 'successfully',
                            text: "Do you want to set task now?",
                            type: 'success',
                            showCancelButton: true,
                            cancelButtonText: 'Not Now',
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yes',
                            animation: false,
                            customClass: 'animated tada'
                            // }).then(function () {
                            //     window.location.href = "/project/task/add/"+mst.project_id;
                            // Suvrat Issue#3172
                        }).then(() => {
                            mst.addNewTask()
                            //////////////////// 
                        }, function (dismiss) {
                            window.location.href = "/project/milestone/" + mst.project_id;
                        });
                    } else {
                        toastr.success('Milestone updated successfully..');
                        $location.url("/project/milestone/" + mst.project_id);
                    }
                } catch (e) {
                    toastr.error("Unable to save milestone.");
                    Raven.captureException(e);
                }
            }, function myError(r) {
                if (r.data.errors) {
                    if (r.data.errors.title) {
                        toastr.error(r.data.errors.title);
                    }
                } else {
                    toastr.error(r.data.message, 'Sorry!');
                }
                // toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }

        //Suvrat Issue#3172
        mst.addNewTask = function () {
            mst.resetAddTaskModal();
            $("#taskOptionModal").modal("show");
        };

        //Suvrat Issue#3172
        mst.cancelTaskAdd = function () {
            window.location.href = "/project/milestone/" + mst.project_id;
        };

        // Suvrat Issue#3172
        mst.resetAddTaskModal = function () {
            mst.taskOptionSelected = "new";
            mst.milestoneIdForTask = null;
            mst.taskListId = null;
            // Suvrat Issue#3175
            mst.milestoneTask = null;
            mst.taskLst = null;
            mst.projectIdForMilestone = null;
            //////////////////////////////////
            $("div.form-group").each(function () {
                $(this).removeClass('has-error');
                $('span.help-block-error').remove();
            });
        };

        mst.getTaskListByMilestoneID = function (id) {
            $("#milestoneLists").on("select2:close", function (e) {
                $(this).valid();
            });

            var promise = services.getTaskByMilestoneId(id);
            promise.success(function (response) {
                if (response.tasks) {
                    mst.taskListOfMilestone = response.tasks;
                    // applySelect2();
                    $("#taskList").on("select2:close", function (e) {
                        $(this).valid();
                    });
                }
                Utility.stopAnimation();
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        };

        //Suvrat Issue#3172
        mst.saveSelectedOption = function () {
            if ($("#taskOptionForm").valid()) {
                if (mst.taskOptionSelected == "new") {
                    $window.location.href = '/project/task/add/' + mst.project_id;
                }
                if (mst.taskOptionSelected == "copy_from_existing") {
                    if (mst.taskListId > 0) {
                        URL = '/project/task/add/' + mst.project_id + '?copy=' + mst.taskListId;
                        $window.location.href = URL;
                    }
                }
                if (mst.taskOptionSelected == "copy_from_default") {
                    if (mst.taskListId > 0) {
                        URL = '/project/task/add/' + mst.project_id + '?copy=' + mst.taskListId;
                        $window.location.href = URL;
                    }
                }
                // Suvrat Issue#3175
                if (mst.taskOptionSelected == "copy_from_project") {
                    if (mst.taskLst > 0) {
                        URL = '/project/task/add/' + mst.project_id + '?copy=' + mst.taskLst;
                        $window.location.href = URL;
                    }
                }
                //////////////////////
                // Suvrat Issue#3175
                // $("#taskOptionModal").modal("hide");
                ////////////////////////
                // $location.path('/project/task/add/'+mst.project_id);
            }
        };
    };

    // Redirect on success pop up of project
    mst.redirectMilestoneCancel = function () {
        window.location.href = "/milestone";
        mst.refresh();
    };

    mst.openChangeStatusModal = function (id) {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });

        $scope.user = angular.copy($scope.tsk);
        // $("#taskForm")[0].reset();
        $("#changeMilestoneStatusForm")[0].reset();
        mst.milestoneStatus = "";
        // $("#changeStatusTo").select2("val", "");
        $("#milestoneStatusChange").val('');
        applySelect2();
        setTimeout(function () { setCSS(); }, 500);
        $("#changeMilestoneStatusModal").modal("show");
        mst.id = id;
    };

    //method for saving changed status comment
    mst.changeStatus = function (id) {
        if ($("#changeMilestoneStatusForm").valid()) {
            var req = {
                "id": mst.id,
                "status_id": mst.milestoneStatus,
                "comment": mst.status_comment,
                "updated_by": loggedInUser.id,
                "project_id": mst.project_id
            };
            var promise = services.updateStatusOfMilestoneAndTask(req, "milestone");
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                $("#changeMilestoneStatusModal").modal("toggle");
                toastr.success('Milestone status updated successfully', 'Congratulations!');
                mst.init();
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    };

    $scope.resetForm = function () {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
        $scope.user = angular.copy($scope.tsk);
    };

    // Suvrat Issue#3175
    mst.getProjectList = function () {
        $("#projectLists").on("select2:close", function (e) {
            $(this).valid();
        });
        var requestParam = {
            page: 1,
            limit: -1
        };
        var promise = services.getAllProjects(requestParam);
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.data != null) {
                for (var i = 0; i < result.data.data.length; i++) {
                    result.data.data[i].start_date = Utility.formatDate(result.data.data[i].start_date);
                    result.data.data[i].due_date = Utility.formatDate(result.data.data[i].due_date);
                }
                mst.projectList = result.data.data;
            }
            $("#projectLists").on("select2:close", function (e) {
                $(this).valid();
            });
        }, function myError(r) {
            toastr.error(r.message, 'Sorry!');
            Utility.stopAnimation();
        });
    };

    mst.getMilestoneForProject = function (project) {
        $("#milestoneLst").on("select2:close", function (e) {
            $(this).valid();
        });
        var promise = services.getMilestoneListByProject({ "project_id": project });
        promise.success(function (result) {
            mst.projectMilestone = result.data.data;
            applySelect2();
            $("#milestoneLst").on("select2:close", function (e) {
                $(this).valid();
            });
        });
        Utility.stopAnimation();
    };

    mst.getTaskForMilestone = function (milestone) {
        $("#taskLst").on("select2:close", function (e) {
            $(this).valid();
        });
        var promise = services.getTaskByMilestoneId(milestone);
        promise.success(function (response) {
            if (response.tasks) {
                mst.milestoneTaskL = response.tasks;
                applySelect2();
                $("#taskLst").on("select2:close", function (e) {
                    $(this).valid();
                });
            }
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    };
    ////////////////////
});
