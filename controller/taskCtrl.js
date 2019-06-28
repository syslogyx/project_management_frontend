app.controller('taskCtrl', function ($window, $scope, $rootScope, AclService, $routeParams, RESOURCES, $http, $filter, pagination, services, $location, menuService, sidebarFactory, $cookieStore, $q, $sce, breadcrumbs) {

    $scope.breadcrumbs = breadcrumbs;
    var tsk = this;
    $scope.can = AclService.can;
    tsk.title = 'Add New Task';
    tsk.id = null;
    tsk.taskName = "";
    tsk.taskDescription = "";
    tsk.projectName = "";
    tsk.taskList = "";
    tsk.priority = "";
    tsk.startDate = "";
    tsk.endDate = "";
    tsk.projectManager = "";
    tsk.technicalSupport = "";
    tsk.taskStatusData = "Assigned";
    tsk.milestoneData = "";
    tsk.parentData = "";
    tsk.searchTaskList = [];
    tsk.assigned_to = [];
    tsk.technical_support = [];
    tsk.pageno = 0;
    tsk.limit = 0;
    tsk.milestone_id = 0;
    tsk.milestone_id_status = false;
    tsk.hgt = Math.round($window.innerHeight / 2.2);
    tsk.task_cat = true;
    tsk.isAuthorised = false;
    tsk.taskOptionSelected = "new";
    tsk.milestoneIdForTask = "";
    tsk.ipAddress = "";

    tsk.roleStatus = false;
    tsk.taskStatusName = "";
    tsk.taskUserId = null;

    tsk.taskEstimationInHr = null;
    tsk.taskEstimationInMin = null;
    tsk.task_estimation = null;
    tsk.extensionTime = null;
    tsk.extensionTimeInSec = null;

    // Namrata : constant to use for Time Estimation Button condition
    tsk.fourHrsInSec = 14400;

    tsk.totalEntries = null;
    tsk.fromValue = null;
    tsk.toValue = null;

    tsk.pauseReasonList = [
        { id: 1, name: "Break" },
        { id: 2, name: "Switch to another task" },
        { id: 3, name: "EOD" },
        { id: 4, name: "Other" }
    ];
    tsk.field_name = [
        { value: 'title', name: "Title" },
        { value: 'description', name: "Description" },
        { value: 'status', name: "Status" },
        { value: 'priority', name: "Priority" },
        { value: 'assigned', name: "User" }
    ];

    tsk.project_id = $routeParams.id || "Unknown";

    var loggedInUser = services.getIdentity();
    tsk.userId = loggedInUser.id;

    tsk.priorities = [
        { id: 1, name: "High" },
        { id: 2, name: "Medium" },
        { id: 3, name: "Low" }
    ];

    tsk.changeStatusTo = [
        { id: "1", name: "New" },
        { id: "2", name: "Acknowledged" },
        { id: "3", name: "Confirmed" },
        { id: "4", name: "Assigned" },
        { id: "5", name: "Resolved" },
        { id: "6", name: "Closed" }
    ];

    // tsk.limit = $('#table_length').val();

    /* Getting all status and displaying in status dropdown*/
    var promise = services.getAllStatus("task");
    promise.success(function (result) {
        // Utility.stopAnimation();
        tsk.taskStatus = result.data;
    });

    /* Getting all status and displaying in status dropdown*/
    var promise = services.getMilestoneListByProject({ "project_id": tsk.project_id });
    promise.success(function (result) {
        // Utility.stopAnimation();
        tsk.milestoneList = result.data.data;
        //Suvrat Issue#3166
        $rootScope.project_name = tsk.milestoneList[0].project.name;
    });

    /* Getting all users and displaying in task assign_to dropdown*/
    var promise = services.getAllUsers();
    promise.success(function (response) {
        if (response.data) {
            tsk.technical_support = response.data.data;
        }
        //Utility.stopAnimation();
    }, function myError(r) {
        toastr.error(r.data.message, 'Sorry!');
        Utility.stopAnimation();
    });

    var promise = services.getAllUsersOfParticularProject({ "project_id": tsk.project_id });
    promise.success(function (response) {
        if (response.data) {
            tsk.assigned_to = response.data.data;
            for (var i = 0; i < tsk.assigned_to.length; i++) {
                if (tsk.assigned_to[i].domain_id == 1) {
                    tsk.assigned_to[i].domain.name = tsk.assigned_to[i].role;
                }
            }
        }
        Utility.stopAnimation();
    }, function myError(r) {
        toastr.error(r.data.message, 'Sorry!');
        Utility.stopAnimation();
    });

    /* Getting all status and displaying in status dropdown*/
    /* $id = 5;
    var promise = services.getTaskByMilestoneId($id);
    promise.success(function (result) {
        Utility.stopAnimation();
        tsk.parentList = result.tasks;
    });*/

    tsk.selectedItemChanged = function (selectedItem) {
        // console.log(selectedItem);
    };

    tsk.getTaskListByMilestoneID = function (id) {
        $("#milestoneLists").on("select2:close", function (e) {
            $(this).valid();
        });

        var promise = services.getTaskByMilestoneId(id);
        promise.success(function (response) {
            if (response.tasks) {
                tsk.taskListOfMilestone = response.tasks;
                applySelect2();
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

    // var projectName = '';
    // $scope.$root.$broadcast("myEvent", {projectName: projectName});
    // $scope.$root.$broadcast("myIdEvent", {projectId: tsk.project_id});
    // menuService.setProjectInfo({projectName:projectName,projectId:tsk.project_id});
    // $scope.projectInfo= menuService.getProjectInfo();

    id = tsk.project_id;
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
                project_menu[j].projectId = tsk.project_id;
                if (project_menu[j].menu_name == 'Tasks') {
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
    //     menu[i].projectId=tsk.project_id;
    //     if(menu[i].menu_name=='Tasks'){
    //         menu[i].active='active';
    //     }else{
    //         menu[i].active='deactive';
    //     }
    // }

    menuService.setMenu(menu);

    //Sonal::compatibility for firefox and chrome
    function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
        var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var pc = new myPeerConnection({
            iceServers: []
        }),
            noop = function () { },
            localIPs = {},
            ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
            key;

        function iterateIP(ip) {
            if (!localIPs[ip]) onNewIP(ip);
            localIPs[ip] = true;
        }

        //create a bogus data channel
        pc.createDataChannel("");
        // create offer and set local description
        pc.createOffer(function (sdp) {
            sdp.sdp.split("\n").forEach(function (line) {
                if (line.indexOf("candidate") < 0) return;
                line.match(ipRegex).forEach(iterateIP);
            });
            pc.setLocalDescription(sdp, noop, noop);
        }, noop);
        //listen for candidate events
        pc.onicecandidate = function (ice) {
            if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
            ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
        };
    }

    //Sonal: Get IP address 
    getUserIP(function (ip) {
        tsk.ipAddress = ip;
    });

    tsk.goBack = function () {
        $location.path('/task');
    };

    tsk.activateSelect2 = function () {
        applySelect2();
    };

    tsk.addNewTask = function () {
        tsk.resetAddTaskModal();
        $("#taskOptionModal").modal("show");
        setTimeout(function () {
            applySelect2();
            setCSS();
        }, 500);
    };

    //Suvrat Issue#3177
    tsk.addNewMilestone = function () {
        Utility.startAnimation();

        var promise = services.getProject(tsk.project_id);
        promise.then(function mySuccess(response) {
            Utility.stopAnimation();
            var projectName = response.data.data.name;
            tsk.projectStartDate = Utility.formatDate(response.data.data.start_date);
            tsk.projectEndDate = Utility.formatDate(response.data.data.due_date);
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        var promise = services.getAllStatus("project");
        promise.success(function (result) {
            Utility.stopAnimation();
            tsk.status = result.data;
            tsk.milestoneStatus = result.data[0].name;
        });

        tsk.resetMilestModal();

        $('#addMilestModal').modal('show');
    };

    tsk.resetMilestModal = function () {
        $("#milestdescription").val(null);
        // $("input[type='text']").val(null);
        tsk.milestdescription = null;

        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
        applySelect2();
    };
    ///////////////////////////////

    // Suvrat Issue#3177
    tsk.saveMilestone = function () {
        if ($("#milestoneForm").valid()) {
            var startDate = Utility.formatDate(tsk.milestoneStartDate, "Y/m/d");
            var endDate = Utility.formatDate(tsk.milestoneEndDate, "Y/m/d");
            var desc = CKEDITOR.instances.milestdescription.getData();

            var promise = services.getMilestoneIndex(tsk.project_id);
            promise.then(function mySuccess(response) {
                Utility.startAnimation();
                tsk.version = response.data.trim();

                tsk.version = Number(tsk.version) + 1;

                var req = {
                    "title": tsk.milestoneName,
                    "description": desc,
                    "revised_date": startDate,
                    "start_date": startDate,
                    "due_date": endDate,
                    "project_id": tsk.project_id,
                    "milestone_index": tsk.version,
                    "status_id": tsk.milestoneStatus,
                    "created_by": loggedInUser.id,
                    "updated_by": loggedInUser.id,
                };

                var promise = services.saveMilestone(req);

                promise.then(function mySuccess(response) {
                    try {
                        toastr.success('Milestone created successfully..');
                        tsk.milestoneList = [];
                        var promise = services.getMilestoneListByProject({ "project_id": tsk.project_id });
                        promise.success(function (result) {
                            tsk.milestoneList = result.data.data;
                        });
                    } catch (e) {
                        toastr.error("Unable to save milestone.");
                        Raven.captureException(e);
                    }
                });
            });

            Utility.stopAnimation();

            $(".modal-body input").val("");

            $(".modal-body textarea").val("");

            $('#addMilestModal').modal('hide');
        }
    }
    /////////////////////////////////////////////

    tsk.saveSelectedOption = function () {
        if ($("#taskOptionForm").valid()) {
            if (tsk.taskOptionSelected == "new") {
                $window.location.href = '/project/task/add/' + tsk.project_id;
            }
            if (tsk.taskOptionSelected == "copy_from_existing") {
                if (tsk.taskListId > 0) {
                    URL = '/project/task/add/' + tsk.project_id + '?copy=' + tsk.taskListId;
                    $window.location.href = URL;
                }
            }
            if (tsk.taskOptionSelected == "copy_from_default") {
                if (tsk.taskListId > 0) {
                    URL = '/project/task/add/' + tsk.project_id + '?copy=' + tsk.taskListId;
                    $window.location.href = URL;
                }
            }
            // Suvrat Issue#3175
            if (tsk.taskOptionSelected == "copy_from_project") {
                if (tsk.taskLst > 0) {
                    URL = '/project/task/add/' + tsk.project_id + '?copy=' + tsk.taskLst;
                    $window.location.href = URL;
                }
            }
            //////////////////////
            // Suvrat Issue#3175
            // $("#taskOptionModal").modal("hide");
            //////////////////////////////////////
            // $location.path('/project/task/add/'+tsk.project_id);
        }
    };

    tsk.id = $location.search()["id"];
    tsk.init = function () {
        if (tsk.id > 0) {
            if ($cookieStore.get('giveReasonModal')) {
                $("#giveReasonModal").modal("toggle");
                setTimeout(function () {
                    setCSS();
                }, 500);
            }

            var url = $location.path();
            parts = url.split('/');
            parts.pop();
            url = parts.join('/');

            if (url == '/project/task/view') {
                tsk.title = 'View Task';
            } else {
                tsk.title = 'Update Task';
            }
            var promise = services.getTask({ id: tsk.id });
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                tsk.taskName = response.data.data.task.title;
                tsk.taskDescription = response.data.data.task.description;
                tsk.milestoneData = response.data.data.task.milestone_id;
                tsk.milestoneName = response.data.data.task.milestones.title;
                tsk.priority = response.data.data.task.priority_id;
                tsk.assignedToData = response.data.data.task.assigned_to;
                tsk.assignedToName = response.data.data.task.project_resource.user.name;
                tsk.assignedToID = response.data.data.task.project_resource.user.id;
                tsk.technicalSupport = response.data.data.task.technical_support;
                tsk.extensionTime = Utility.convertTimeInRequiredFormat(response.data.data.task.extension_time);
                tsk.extensionTimeInSec = Utility.convertTimeIntoSeconds(tsk.extensionTime, ':');
                tsk.isApproved = response.data.data.task.is_approved;
                tsk.remark = response.data.data.task.remark;
                if (tsk.technicalSupport.length > 0) {
                    tsk.technicalSupportName = response.data.data.task.technical_support[0].user.name;
                    tsk.technicalSupportId = response.data.data.task.technical_support[0].user.id;
                }
                tsk.taskStatusData = response.data.data.task.status_id;
                tsk.task_estimation = response.data.data.task.estimated_time;

                // Namrata : store estimated time in seconds
                tsk.timeEstimationInSec = Utility.convertTimeIntoSeconds(tsk.task_estimation, '.');

                tsk.task_estimationhh = tsk.task_estimation.split(".")[0];
                tsk.task_estimationmm = tsk.task_estimation.split(".")[1];
                if (tsk.task_estimationmm == "" || tsk.task_estimationmm == null) {
                    tsk.task_estimationmm = 00;
                }
                tsk.task_estimation = tsk.task_estimationhh + ':' + tsk.task_estimationmm;  //Suvrat Issue#3170

                tsk.comment_list = response.data.data.comment_list;
                tsk.spent_time = response.data.data.task.spent_time;
                //This will check if spent_time is null or not and make it as 00:00:00//Suvrat
                if (tsk.spent_time == null || tsk.spent_time == '') {
                    tsk.spent_time = "00:00:00";
                }
                tsk.todays_spent_time = response.data.data.task.todays_spent_time;
                tsk.break_time = response.data.data.task.break_time;
                tsk.start_date = response.data.data.task.start_date;

                if (url == '/project/task/view') {
                    if (tsk.taskStatusData == "Start") {
                        //Suvrat Issue#3169//This gets the current date and time from the internet to prevent using client's local time//Change this from a web api to local server api for time
                        var promise = services.getServerTime();
                        promise.then(function mySuccess(response) {
                            var serverDate = response.data.data;
                            serverDate = new Date(serverDate);
                            var stDt = tsk.start_date;
                            stDt = new Date(stDt);

                            stDt = stDt.getTime();

                            var spTm = tsk.spent_time;
                            spTm = spTm.split(':');

                            var curTime = serverDate;

                            curTime = curTime.getTime();

                            var persistTime = curTime - stDt;

                            var phours = Math.floor(persistTime / 36e5),
                                pminutes = Math.floor(persistTime % 36e5 / 60000),
                                pseconds = Math.floor(persistTime % 60000 / 1000);

                            var actTime = [phours, pminutes, pseconds];

                            var realTime = [0, 0, 0];

                            for (var i = 0; i < realTime.length; i++) {
                                spTm[i] = isNaN(parseInt(spTm[i])) ? 0 : parseInt(spTm[i]);
                                actTime[i] = isNaN(parseInt(actTime[i])) ? 0 : parseInt(actTime[i]);
                            }

                            for (var d = 0; d < realTime.length; d++) {
                                realTime[d] = spTm[d] + actTime[d];
                            }

                            var hours = realTime[0];
                            var minutes = realTime[1];
                            var seconds = realTime[2];

                            if (seconds >= 60) {
                                var m = (seconds / 60) << 0;
                                minutes += m;
                                seconds -= 60 * m;
                            }

                            if (minutes >= 60) {
                                var h = (minutes / 60) << 0;
                                hours += h;
                                minutes -= 60 * h;
                            }

                            var theTime = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
                            // Suvrat Issue#3189 Show timer in respective places
                            var today_time = tsk.todays_spent_time;
                            today_time = today_time.split(':');

                            var todPhours = Math.floor(persistTime / 36e5),
                                todPminutes = Math.floor(persistTime % 36e5 / 60000),
                                todPseconds = Math.floor(persistTime % 60000 / 1000);

                            var todActTime = [todPhours, todPminutes, todPseconds];

                            var todRealTime = [0, 0, 0];

                            for (var f = 0; f < todRealTime.length; f++) {
                                today_time[f] = isNaN(parseInt(today_time[f])) ? 0 : parseInt(today_time[f]);
                                todActTime[f] = isNaN(parseInt(todActTime[f])) ? 0 : parseInt(todActTime[f]);
                            }

                            for (var k = 0; k < todRealTime.length; k++) {
                                todRealTime[k] = today_time[k] + todActTime[k];
                            }

                            var todHours = todRealTime[0];
                            var todMinutes = todRealTime[1];
                            var todSeconds = todRealTime[2];

                            if (todSeconds >= 60) {
                                var tmp = (todSeconds / 60) << 0;
                                todMinutes += tmp;
                                todSeconds -= 60 * tmp;
                            }

                            if (todMinutes >= 60) {
                                var tmp2 = (todMinutes / 60) << 0;
                                todHours += tmp2;
                                todMinutes -= 60 * tmp2;
                            }

                            var todTime = ('0' + todHours).slice(-2) + ':' + ('0' + todMinutes).slice(-2) + ':' + ('0' + todSeconds).slice(-2);
                            tsk.taskCounter(theTime, todTime);
                        });
                    }
                    if (tsk.assignedToID == tsk.userId) {
                        tsk.isAuthorised = true;
                    } else {
                        tsk.isAuthorised = false;
                    }
                    for (var role = 0; role < loggedInUser.identity.role.length; role++) {
                        if (loggedInUser.identity.role[role].name == 'Super Admin' || loggedInUser.identity.role[role].name == 'Admin' || loggedInUser.identity.role[role].name == 'Manager') {
                            tsk.isAuthorised = false;
                        }
                    }
                }
                tsk.getActivityLog();
                applySelect2();
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();

            });
        }
        if ($location.search().copy) {
            tsk.taskListId = $location.search().copy;
            tsk.title = 'Add Task';
            var promise = services.getTask({ id: tsk.taskListId });
            promise.then(function mySuccess(response) {
                tsk.taskName = response.data.data.task.title;
                tsk.taskDescription = response.data.data.task.description;
                tsk.milestoneData = response.data.data.task.milestone_id;
                tsk.milestoneName = response.data.data.task.milestones.title;
                tsk.priority = response.data.data.task.priority_id;
                tsk.assignedToData = '';
                tsk.assignedToName = '';
                tsk.assignedToID = '';
                tsk.technicalSupport = response.data.data.task.technical_support;
                if (tsk.technicalSupport.length > 0) {
                    tsk.technicalSupportName = response.data.data.task.technical_support[0].user.name;
                    tsk.technicalSupportId = response.data.data.task.technical_support[0].user.id;
                }
                tsk.taskStatusData = "Assigned";
                tsk.task_estimation = '';
                tsk.task_estimationhh = '';
                tsk.task_estimationmm = '';
                tsk.comment_list = '';
                tsk.spent_time = '';
                tsk.break_time = '';
                applySelect2();
                tsk.taskListId = '';
                Utility.stopAnimation();
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    };

    tsk.init();

    tsk.viewTask = function (task) {
        tsk.title = 'View Task';
        /*Sonal:Get Login user Data */
        var promise = services.getUserById(tsk.userId);
        promise.success(function (result) {
            tsk.loginUSerHRMSID = result.data.user_id;
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        /*Sonal:Get HRMS break stop Reason List */
        var promise = services.getHRMsBreakReasonList();
        promise.success(function (response) {
            if (response.status_code == 200) {
                tsk.HRMSBreakReasonList = response.data;
            }
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    };

    tsk.saveTask = function (task) {
        if ($("#taskForm").valid()) {
            // tsk.submitClicked = true;
            var startDate = Utility.formatDate(tsk.startDate, "Y/m/d");
            var endDate = Utility.formatDate(tsk.endDate, "Y/m/d");
            var desc = CKEDITOR.instances.description.getData();

            // var req = {
            //     "project_resource_id": tsk.projectManager.id,
            //     "milestone_id": 1,
            //     "status_id": 2,
            //     "technical_support_id": tsk.technicalSupport.id,
            //     "completion_date": endDate,
            //     "title": tsk.taskName,
            //     "description": desc,
            //     "parent_id": 1,
            //     "estimated_hours": 0,
            //     "comment": "added hard coded",
            //     "original_task_id": 1,
            //     "start_date": startDate,
            //     "task_list_id": 1,
            //     "priority_id": 1
            // };
            tsk.task_estimation = tsk.task_estimationhh + '.' + tsk.task_estimationmm;

            var req = {
                "title": tsk.taskName,
                "description": desc,
                "milestone_id": tsk.milestoneData,
                "status_id": tsk.taskStatusData,
                "assigned_to": tsk.assignedToData,
                "estimated_time": tsk.task_estimation,
                "comment": " ",
                "priority_id": tsk.priority,
                "created_by": tsk.userId,
                "updated_by": tsk.userId,
                "project_id": tsk.project_id,
                "technical_support": tsk.technicalSupportId
            };

            if (tsk.id) {
                req.id = tsk.id;
                delete req["project_id"];
                var promise = services.updateTask(req);
                var operationMessage = " updated ";
            } else {
                var promise = services.saveTask(req);
                var operationMessage = " created ";
            }

            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    $window.location.href = '/project/task/' + tsk.project_id;
                    toastr.success('Task' + operationMessage + 'successfully.');

                } catch (e) {
                    toastr.error("Task not saved successfully..");
                    Raven.captureException(e);
                }
                /*swal({
                    title: 'Task' + operationMessage + 'successfully',
                    text: "",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Ok'
                }).then(function () {
                    window.location.href = "/task";

                })*/
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
    };

    $scope.resetForm = function () {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });

        CKEDITOR.instances.description.setData('', function () {
            $("div.form-group").each(function () {
                $(this).removeClass('has-error');
                $('span.help-block-error').remove();
                $('#cke_1_top,#cke_1_bottom').css('border-color', '');
            });
        });

        $scope.user = angular.copy($scope.tsk);
        $("#taskForm")[0].reset();
        applySelect2();
        // $("#changeTaskStatusForm")[0].reset();
    };

    $scope.resetChangeStatusForm = function () {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });

        $scope.user = angular.copy($scope.tsk);
        // $("#taskForm")[0].reset();
        $("#changeTaskStatusForm")[0].reset();
        tsk.changeStatusTo = "";
        // $("#changeStatusTo").select2("val", "");
        $("#changeStatusTo").val('');
        applySelect2();
        setTimeout(function () {
            setCSS();
        }, 500);
    };

    tsk.searchMilestone = function (id, page) {
        // tsk.milestoneId = "";
        // tsk.limit = pagination.getpaginationLimit();
        // tsk.limit = $('#table_length').val();
        tsk.milestone_id = id;
        tsk.milestoneId = id;
        if (id != null) {
            tsk.milestone_id_status = true;
            // tsk.task_cat = true;
        } else {
            tsk.milestone_id = '';
            tsk.milestoneId = '';
            tsk.taskStatusName = '';
            tsk.taskUserId = null;
        }
        applySelect2();
        tsk.fetchList(page);
    };

    setTimeout(function () {
        $('#table_length').on('change', function () {
            tsk.fetchList(-1);
        });
    }, 100);

    tsk.fetchList = function (page) {
        tsk.limit = $('#table_length').val();
        if (tsk.limit == undefined) {
            tsk.limit = -1;
        }

        if (page == -1) {
            tsk.pageno = 1;
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        } else {
            tsk.pageno = page;
        }

        var loggedInUser = services.getIdentity();
        var req = {
            "milestone_id": tsk.milestone_id,
            "project_id": tsk.project_id,
            "user_id": tsk.taskUserId != null ? tsk.taskUserId : loggedInUser.id,
            // "user_id":loggedInUser.id,
            "task_cat": tsk.task_cat,
            "status_id": tsk.taskStatusName
        };
        for (var role = 0; role < loggedInUser.identity.role.length; role++) {
            if (loggedInUser.identity.role[role].name == 'Super Admin' || loggedInUser.identity.role[role].name == 'Admin' || loggedInUser.identity.role[role].name == 'Manager') {
                tsk.roleStatus = true;
                if (tsk.taskUserId == null) {
                    req.user_id = null;
                }
                delete (req.task_cat);
                break;
            }
        }

        var requestParam = {
            page: tsk.pageno,
            limit: tsk.limit,
        };

        var promise = services.searchListOfTask(req, requestParam);
        promise.then(function mySuccess(response) {
            Utility.stopAnimation();
            if (response.data.data.data.length != 0) {
                try {
                    if (tsk.milestone_id_status) {
                        toastr.success('Search successful.');
                        // tsk.milestone_id = null;
                        tsk.milestone_id_status = false;
                    }
                    tsk.searchTaskList = response.data.data.data;
                    tsk.totalEntries = response.data.data.total;
                    tsk.fromValue = response.data.data.from;
                    tsk.toValue = response.data.data.to;
                    // Suvrat Issue#3170
                    var len = tsk.searchTaskList.length;
                    for (var i = 0; i < len; i++) {
                        var temp = 0;
                        temp = tsk.searchTaskList[i].estimated_time;
                        temp = temp.split('.');
                        if (isNaN(temp[1])) {
                            temp[1] = "00";
                        }
                        temp = temp[0] + ":" + temp[1];
                        tsk.searchTaskList[i].estimated_time = temp;
                    }

                    var projectName = response.data.data.data[0].milestones.project.name;
                    tsk.project_id = response.data.data.data[0].milestones.project.id;
                    // $scope.$root.$broadcast("myEvent", {projectName: projectName});
                    // $scope.$root.$broadcast("myIdEvent", {projectId: tsk.project_id});
                    // menuService.setProjectInfo({projectName:projectName,projectId:tsk.project_id});
                    // $scope.projectInfo= menuService.getProjectInfo();
                    // $rootScope.$emit("menuCtrlMethod",$scope.projectInfo);

                    pagination.applyPagination(response.data.data, tsk);
                } catch (e) {
                    // toastr.error("No Record Found");
                    Raven.captureException(e);
                }
            } else {
                tsk.searchTaskList = [];
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    };

    // tsk.searchMilestone($id = null, $page = -1);
    tsk.updateTaskStatus = function (status) {
        var req = {
            "id": tsk.id,
            "status_id": status,
            "updated_by": tsk.userId,
        };

        if (status == "Paused") {
            tsk.resetPauseModal();
            $("#giveReasonForPauseModal").modal("show");
            setTimeout(function () {
                setCSS();
            }, 500);
        } else {
            /*Sonal:Check HRMS Break Status  */
            var promise = services.checkUserHRMSBreakStatus(tsk.loginUSerHRMSID);
            promise.success(function (response) {
                if (response.status_code == 200) {
                    if (response.data.status == 1) {
                        tsk.HrmsUserBreakID = response.data.id;
                        $("#endHRMSBreakModal").modal("show");
                        setTimeout(function () {
                            setCSS();
                        }, 500);
                    } else {
                        tsk.updateStartTaskStatus(req);
                        // Suvrat Issue#3361
                        localStorage.removeItem("taskStarted");
                        //////////////////////
                    }
                } else if (response.status_code == 404) {
                    tsk.updateStartTaskStatus(req);
                    // Suvrat Issue#3361
                    localStorage.setItem("taskStarted", 1);
                    ////////////////////////
                }
                Utility.stopAnimation();
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    };

    tsk.closeHRMSBreakModal = function () {
        if ($("#endHRMSBreakForm").valid()) {
            $("#endHRMSBreakModal").modal("hide");
            if ((tsk.loginUSerHRMSID != null || tsk.loginUSerHRMSID != undefined) && (tsk.HrmsUserBreakID != null || tsk.HrmsUserBreakID != undefined)) {
                var req = {
                    "id": tsk.loginUSerHRMSID,
                    "status": 2,
                    "type": "endTime",
                    "reason": tsk.endBreakReason,
                    "ipaddress": tsk.ipAddress,
                    "dataId": tsk.HrmsUserBreakID
                }

                var promise = services.startOrStopHRMSBreak(req);
                promise.success(function (response) {
                    Utility.stopAnimation();
                    if (response.status_code == 200) {
                        var request = {
                            "id": tsk.id,
                            "status_id": "Start",
                            "updated_by": tsk.userId,
                        };
                        tsk.updateStartTaskStatus(request);
                        $window.location.href = '/';
                    }
                }, function myError(r) {
                    toastr.error(r.data.message, 'Sorry!');
                    Utility.stopAnimation();
                });
            }
        }
    }

    tsk.updateStartTaskStatus = function (req) {
        var promise = services.updateTaskStatus(req);
        promise.then(function mySuccess(response) {
            Utility.stopAnimation();
            try {
                if (response.data.status_code == 201) {
                    // toastr.warning(response.data.message);
                    swal({
                        // title: "",
                        text: "You already have task in progress. Please take action on that first.",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        cancelButtonText: "Cancel",
                        confirmButtonText: "Ok",
                    }).then(function () {
                        $window.location.href = '/project/task/view/' + response.data.data[0].milestones.project_id + '?id=' + response.data.data[0].id;
                    }, function (dismiss) {
                    });
                } else {
                    toastr.success(response.data.message);
                    tsk.init();
                }
            } catch (e) {
                toastr.error(response.data.message);
                Raven.captureException(e);
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    tsk.updateTaskStatusForPause = function () {
        if ($("#giveReasonForPauseForm").valid()) {
            var req = {
                "id": tsk.id,
                "status_id": "Paused",
                "updated_by": tsk.userId,
            };
            var promise = services.updateTaskStatus(req);
            promise.then(function mySuccess(response) {
                try {
                    $("#giveReasonForPauseModal").modal("hide");
                    //Sonal:get Break from HRMS
                    if (tsk.pause_reason == 1) {
                        if (tsk.loginUSerHRMSID != null || tsk.loginUSerHRMSID != undefined) {
                            var req = {
                                "id": tsk.loginUSerHRMSID,
                                "status": 1,
                                "type": "startTime",
                                "reason": tsk.remark,
                                "ipaddress": tsk.ipAddress,
                                "dataId": ""
                            }

                            var promise = services.startOrStopHRMSBreak(req);
                            promise.success(function (response) {
                                // Suvrat Issue#3361
                                localStorage.removeItem("taskStarted");
                                //////////////////////
                                Utility.stopAnimation();
                                if (response.status_code == 200) {
                                    $window.location.href = '/';
                                }
                            }, function myError(r) {
                                toastr.error(r.data.message, 'Sorry!');
                                Utility.stopAnimation();
                            });
                        }
                    }
                    if (tsk.pause_reason == 2) {
                        $window.location.href = '/#task_sec';
                    }
                    if (tsk.pause_reason == 3) {
                        $window.location.href = '/eod/send';
                    }
                    if (tsk.pause_reason == 4) {
                        $window.location.href = '/';
                    }
                    toastr.success(response.data.message);
                    Utility.stopAnimation();
                } catch (e) {
                    toastr.error(response.data.message);
                    Raven.captureException(e);
                }
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    };

    tsk.updateTask = function (identifier) {
        // tsk.id = $location.search()["id"];
        if (identifier == "task") {
            tsk.init();
        }
        if (tsk.id == undefined) {
            tsk.id = $location.search()["id"];
        }
        if ($("#changeTaskStatusForm").valid()) {
            if (tsk.id > 0) {
                var req = {
                    "id": tsk.id,
                    "status_id": tsk.changeStatusTo,
                    "comment": tsk.status_comment,
                    "updated_by": tsk.userId,
                    "milestone_id": tsk.milestoneData,
                };
                // Suvrat Issue#3361
                var isTaskStarted = localStorage.getItem("taskStarted");
                var taskStatus = req.status_id;
                if ((isTaskStarted != 1 || taskStatus != "Start") && (isTaskStarted != 1 || taskStatus != "In-progress")) {
                    ////////////////////////////////////
                    var promise = services.updateTask(req);
                    promise.then(function mySuccess(response) {
                        // Suvrat Issue#3361
                        if (taskStatus == "Start" || taskStatus == "In-progress")
                            localStorage.setItem("taskStarted", 1);
                        else
                            localStorage.removeItem("taskStarted");
                        /////////////////////
                        $('#time').css('display', 'none');   //Suvrat to stop displaying time after task completion
                        Utility.stopAnimation();
                        try {
                            toastr.success(response.data.message);
                            $("#changeStatusModal").modal("toggle");
                            tsk.init();
                            tsk.searchMilestone($id = null, $page = -1);
                            setTimeout(function () {
                                if (tsk.spent_time != null) {
                                    if (tsk.changeStatusTo == "Resolved") {
                                        var splitTime = tsk.spent_time.split(":");
                                        var spent_time = splitTime[0] + "." + splitTime[1] + splitTime[2];
                                        //sonal
                                        var splitEstTime = tsk.task_estimation.split(":");
                                        var estTime = splitEstTime[0] + "." + splitEstTime[1];

                                        // if( parseFloat(spent_time)  > parseFloat(tsk.task_estimation) ){
                                        if (parseFloat(spent_time) > parseFloat(estTime)) {
                                            $scope.resetChangeStatusForm();
                                            $("#giveReasonModal").modal("toggle");
                                            $cookieStore.put('giveReasonModal', true);
                                        }
                                    }
                                }
                            }, 1000);

                        } catch (e) {
                            toastr.error(response.data.message);
                            Raven.captureException(e);
                        }
                    }, function myError(r) {
                        toastr.error(r.data.message, 'Sorry!');
                        Utility.stopAnimation();
                    });
                    // Suvrat Issue#3361
                } else toastr.error("Another task is already in Progress");
                ////////////////////////
            }
        }
    };

    tsk.updateTaskForReason = function () {
        if ($("#giveReasonForm").valid()) {
            var req = {
                "id": tsk.id,
                "reason": tsk.status_reason,
                "updated_by": tsk.userId
            };
            var promise = services.updateTask(req);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    toastr.success(response.data.message);
                    $("#giveReasonModal").modal("toggle");
                    $cookieStore.remove('giveReasonModal');
                } catch (e) {
                    toastr.error(response.data.message);
                    Raven.captureException(e);
                }
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    };

    tsk.clearForm = function (taskID, milestoneID) {
        tsk.id = taskID;
        tsk.milestoneData = milestoneID;
    };

    tsk.getActivityLog = function () {
        var req = {
            "project_id": tsk.project_id,
            "milestone_id": tsk.milestoneData,
            "task_id": tsk.id
        };
        var promise = services.projectFeedsList(req);
        promise.success(function (response) {
            Utility.stopAnimation();
            tsk.ActivityLogList = response.data;
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();

        });
    };

    //method for tagging user to particular task in comment section
    $scope.searchPeople = function (term) {
        var peopleList = [];
        var promise = services.getAllUsers();
        promise.success(function (response) {
            angular.forEach(response.data.data, function (item) {
                if (item.name.toUpperCase().indexOf(term.toUpperCase()) >= 0) {
                    peopleList.push(item);
                }
            });
            $scope.people = peopleList;
            Utility.stopAnimation();
            return $q.when(peopleList);
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    };

    tsk.peopleList = [];

    $scope.getPeopleText = function (item) {
        tsk.peopleList.push(item);
        // note item.label is sent when the typedText wasn't found
        // return '[~<i>' + (item.name || item.label) + '</i>]';
        return '<a href="/user/info/' + item.id + '">' + (item.name || item.label) + '</a>';
    };

    $scope.getPeopleTextRaw = function (item) {
        return '@' + item.name;
    };

    // $rootScope.$on('$routeChangeSuccess', function (event, current) {
    //     // $scope.resetDemo();
    // });

    tsk.showMessageBox = true;
    tsk.showCommentBox = function () {
        if ($("#commentTab").hasClass("active")) {
            tsk.showMessageBox = true;
        } else {
            tsk.showMessageBox = false;
        }
    };

    tsk.addComments = function () {
        if ($('#htmlContent').text().trim() != "") {
            var req = {
                "text": tsk.htmlContent,
                "identifier": "TASK",
                "identifier_id": tsk.id,
                "commented_by": tsk.userId
            };

            if (tsk.peopleList.length > 0) {
                var arr = [];
                for (var i = 0; i < tsk.peopleList.length; i++) {
                    var obj = {
                        "user_id": tsk.peopleList[i].id,
                        "status_id": "Active"
                    };
                    arr.push(obj);
                }
                req["tagged_user"] = arr;
            }
            var promise = services.addComments(req);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    toastr.success(response.data.message);
                    tsk.htmlContent = "";
                    tsk.peopleList = [];
                    tsk.init();
                } catch (e) {
                    toastr.error(response.data.message);
                    Raven.captureException(e);
                }
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        } else {
            toastr.error('Please enter the comment', 'Sorry!');
        }
    };

    tsk.refreshfilter = function () {
        tsk.filedName = null;
        tsk.dateRange = null;
        applySelect2();
        tsk.getActivityLog();
        // var currentDate = Utility.formatDate(new Date());
        //  $('#datepicker').daterangepicker({ startDate: currentDate, endDate: currentDate });
    };

    tsk.resetPauseModal = function () {
        tsk.pause_reason = null;
        tsk.remark = null;
        $("#giveReasonForPauseForm")[0].reset();
        $("#requestTimeExtension")[0].reset();

        var validator = $("#requestTimeExtension").validate();
        validator.resetForm();

        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
        applySelect2();
    };
    tsk.resetAddTaskModal = function () {
        tsk.taskOptionSelected = "new";
        tsk.milestoneIdForTask = null;
        tsk.taskListId = null;
        // Suvrat Issue#3175
        tsk.milestoneTask = null;
        tsk.taskLst = null;
        tsk.projectIdForMilestone = null;
        //////////////////////////////////
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
        applySelect2();
    };

    tsk.getActivityLogsFilter = function () {
        var start_date = null;
        var due_date = null;
        var field_name = null;
        if (tsk.dateRange != undefined) {
            var datearr = tsk.dateRange.split('-');
            start_date = Utility.formatDate(datearr[0], "Y/m/d");
            due_date = Utility.formatDate(datearr[1], "Y/m/d");
        }

        if (tsk.filedName != undefined) {
            field_name = tsk.filedName;
        }

        var req = {
            "project_id": tsk.project_id,
            "milestone_id": tsk.milestoneData,
            "task_id": tsk.id,
            "field_name": field_name,
            "start_date": start_date,
            "due_date": due_date
        };

        var promise = services.projectFeedsList(req);
        promise.success(function (response) {
            Utility.stopAnimation();
            tsk.ActivityLogList = response.data;
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    };

    tsk.taskCounter = function (theTime, todTime) {  // This function starts the timer on the view task page//
        var tottim = theTime;
        tottim = tottim.split(':');
        var hours = tottim[0];
        var minutes = tottim[1];
        var seconds = tottim[2];
        //Suvrat Issue#3189 Show the timer at respective locations
        var todtim = todTime;
        todtim = todtim.split(':');
        var todhours = todtim[0];
        var todminutes = todtim[1];
        var todseconds = todtim[2];

        setInterval(function () {
            seconds++;
            if (seconds > 59) {
                seconds = 0;
                minutes++;
            }
            if (minutes > 59) {
                minutes = 0;
                hours++;
            }
            $('#time').html(('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2));
            // Suvrat Issue#3189 Show the timer at respective locations
            $('#sub_time_tot').html(('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2));
        }, 1000);
        // Suvrat Issue#3189 Show the timer at respective locations
        setInterval(function () {
            todseconds++;
            if (todseconds > 59) {
                todseconds = 0;
                todminutes++;
            }
            if (todminutes > 59) {
                todminutes = 0;
                todhours++;
            }
            $('#sub_time_tod').html(('0' + todhours).slice(-2) + ':' + ('0' + todminutes).slice(-2) + ':' + ('0' + todseconds).slice(-2));
        }, 1000);
    };

    tsk.getAssignedUserList = function (milestoneId) {
        var promise = services.getResourcesListofMilestone(milestoneId);
        promise.success(function (result) {
            tsk.milestoneAssignedUserList = result.data;
            applySelect2();
            Utility.stopAnimation();
        });
    }
    // Suvrat Issue#3175
    tsk.getProjectList = function () {
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
                tsk.projectList = result.data.data;
            }
            $("#projectLists").on("select2:close", function (e) {
                $(this).valid();
            });
        }, function myError(r) {
            toastr.error(r.message, 'Sorry!');
            Utility.stopAnimation();
        });
    };

    tsk.getMilestoneForProject = function (project) {
        $("#milestoneLst").on("select2:close", function (e) {
            $(this).valid();
        });
        var promise = services.getMilestoneListByProject({ "project_id": project });
        promise.success(function (result) {
            tsk.projectMilestone = result.data.data;
            applySelect2();
            $("#milestoneLst").on("select2:close", function (e) {
                $(this).valid();
            });
        });
        Utility.stopAnimation();
    };

    tsk.getTaskForMilestone = function (milestone) {
        $("#taskLst").on("select2:close", function (e) {
            $(this).valid();
        });
        var promise = services.getTaskByMilestoneId(milestone);
        promise.success(function (response) {
            if (response.tasks) {
                tsk.milestoneTaskL = response.tasks;
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

    /**
    * Namrata : Function for Prepare Request Body and API call to request Time Estimation Extension
    */
    tsk.requestTimeExtension = function () {
        if ($("#requestTimeExtension").valid()) {

            var req = {
                "task_id": tsk.id,
                "extension_time": (tsk.taskEstimationInHr != null && tsk.taskEstimationInMin != null) ? tsk.taskEstimationInHr + '.' + tsk.taskEstimationInMin : ((tsk.taskEstimationInHr != null && tsk.taskEstimationInMin == null) ? tsk.taskEstimationInHr : null),
                "updated_by": tsk.userId
            };

            if (verifyExtensionTime(req.extension_time)) {
                var promise = services.updateTimeExtension(req);
                promise.then(function mySuccess(response) {
                    Utility.stopAnimation();
                    try {
                        toastr.success(response.data.message);
                        $("#timeExtensionModal").modal("toggle");
                        tsk.init();

                    } catch (e) {
                        toastr.error(response.data.message);
                        Raven.captureException(e);
                    }
                }, function myError(r) {
                    toastr.error(r.data.message, 'Sorry!');
                    Utility.stopAnimation();
                });
            } else
                toastr.error('Extension Time should not be greater than the Estimation Time');
        }
    }

    /**
    *  Namrata : Compare the Provided Extended time with Estimated Time
    */
    function verifyExtensionTime(extensionTime) {
        var extensionTimeInSec = Utility.convertTimeIntoSeconds(extensionTime, '.');

        var estimationTimeInSec = Utility.convertTimeIntoSeconds(tsk.task_estimation, ':');

        if (extensionTimeInSec > estimationTimeInSec)
            return false;

        return true;
    }

});