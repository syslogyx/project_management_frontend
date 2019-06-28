app.controller("momCtrl", function ($window, $scope, services, $http, $location, menuService, $q, $sce, $rootScope, AclService, $routeParams, pagination, breadcrumbs) {
    $scope.breadcrumbs = breadcrumbs;
    $scope.project_id = $location.path().split("/")[1] || "Unknown";
    $scope.can = AclService.can;
    $scope.title = "Add New MoM";
    $scope.momVenue = "";
    $scope.momDate = "";
    $scope.momStartTime = "";
    $scope.momEndTime = "";
    $scope.attendees = [];
    $scope.taskDesc = "";
    $scope.momKeyword = "";
    $scope.taskStatus = "";
    $scope.skip = true;
    $scope.momName = [];
    $scope.momClient = [];
    $scope.attendeesList = [];
    $scope.errMessage2 = '';
    $scope.timeDuration = "";
    $scope.highlightcolor2 = " ";

    $scope.totalEntries = null;
    $scope.fromValue = null;
    $scope.toValue = null;

    $scope.hgt = Math.round($window.innerHeight / 3.2);
    $scope.tasks = [{
        taskName: "",
        taskDesc: "",
        taskType: "",
        taskUser: "",
        taskStatus: "",
        taskStartDate: "",
        taskEndDate: ""
    }];
    $scope.momViewTitle = "";
    $scope.momViewDescription = "";
    $scope.momViewkeyword = "";
    $scope.momViewStatus = "";
    $scope.momViewMeeting_venue = "";
    $scope.momViewDate = "";
    $scope.momViewStartTime = "";
    $scope.momViewEndTime = "";

    var loggedInUser = services.getIdentity();

    var menu = menuService.getDashboardMenu();
    for (var i = 0; i < menu.length; i++) {
        if (menu[i].menu_name == 'Projects') {
            menu[i].url = '/project/';
            menu[i].child = [];
        }
        if (menu[i].menu_name == 'MoM') {
            menu[i].active = 'active';
        } else {
            menu[i].active = 'deactive';
        }
    }
    menuService.setMenu(menu);

    $scope.macros = {
        '(smile)': '<img src="http://a248.e.akamai.net/assets.github.com/images/icons/emoji/smile.png"' +
            ' height="20" width="20">'
    };

    $scope.addNewMoM = function () {
        $location.path('/mom/add');
    }

    $scope.cancleMoM = function () {
        $location.path('/mom/mom-list');
    }

    setTimeout(function () {
        $('#table_length').on('change', function () {
            $scope.fetchList(-1);
            // if($scope.momNameFilter !='' || $scope.momClientFilter !='' || $scope.momStatusFilter !='' || ($scope.momFilterFromDate != undefined && $scope.momFilterFromDate != '') || ($scope.momFilterToDate != undefined && $scope.momFilterToDate != '') ){
            //     $scope.findWithFilter(-1);
            // }else{
            //    $scope.fetchList(-1); 
            // }
        });
    }, 100);

    $scope.fetchList = function (page) {
        $scope.limit = $('#table_length').val();
        if ($scope.limit == undefined) {
            $scope.limit = -1;
        }
        if (page == -1) {
            $scope.pageno = 1;
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else {
            $scope.pageno = page;
        }
        var requestParam = {
            page: $scope.pageno,
            // limit:pagination.getpaginationLimit(),
            limit: $scope.limit,
        }

        var promise = services.getMoMList(requestParam);
        promise.success(function (response) {
            Utility.stopAnimation();
            if (response.data.data) {
                $scope.MoMList = response.data.data;
                $scope.totalEntries = response.data.total;
                $scope.fromValue = response.data.from;
                $scope.toValue = response.data.to;
                for ($i = 0; $i < response.data.data.length; $i++) {
                    var date = response.data.data[$i].date;
                    $scope.MoMList[$i]["taskDate"] = Utility.formatDate(date);
                    var startTime = response.data.data[$i].start_time;
                    var endTime = response.data.data[$i].end_time;
                    var taskListDuration = $scope.calculateMeetingTimeDuration($scope.MoMList[$i]["taskDate"], startTime, endTime);
                    $scope.MoMList[$i]["duration"] = taskListDuration;
                }
                pagination.applyPagination(response.data, $scope);
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    $scope.getMoMList = function () {
        $scope.fetchList(-1);
    }

    $scope.init = function () {
        /* Getting all projects and displaying in projects dropdown*/
        var promise = services.getAllProjects();
        promise.success(function (response) {
            if (response.data) {
                $scope.projectList = response.data.data;
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        /* Getting all users and displaying in users dropdown*/
        var promise = services.getAllUsers();
        promise.success(function (response) {
            if (response.data) {
                $scope.userList = response.data.data;
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        /* Getting all clients and displaying in clients dropdown*/
        var promise = services.getAllClients();
        promise.success(function (response) {
            if (response.data) {
                $scope.clientList = response.data.data;
                var promise = services.getAllClientsOfMoM();
                promise.success(function (r) {
                    if (r.data) {
                        $scope.clientList_new = [];
                        $scope.clientList_mom = r.data.data;
                        for (i = 0; i < $scope.clientList_mom.length; i++) {
                            $scope.clientList.push($scope.clientList_mom[i]);
                        }
                        // angular.merge($scope.clientList,$scope.clientList_new);
                        Utility.stopAnimation();
                    }
                }, function myError(r) {
                    toastr.error(r.data.message, 'Sorry!');
                    Utility.stopAnimation();
                });
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        /* Getting all status and displaying in status dropdown*/
        var promise = services.getAllStatus();
        promise.success(function (result) {
            if (result.data) {
                $scope.statusList = result.data;
            }
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        $scope.MOMId = $location.search()["id"];
        if ($scope.MOMId != undefined) {
            $scope.editMoM($scope.MOMId);
            $scope.viewMoMTaskList($scope.MOMId);
        }
        Utility.stopAnimation();
    }

    // FUNCTION TO CALCULATE TIME DURATION
    $scope.calculateMeetingTimeDuration = function (momDate, momStartTime, momEndTime) {
        $scope.errMessage2 = '';
        $scope.timeDuration = "";
        $scope.highlightcolor2 = " ";
        //create date format   
        if (momStartTime != "" && momEndTime != "") {
            var timeStart = moment(momDate + ' ' + momStartTime, 'DD/MM/YYYY HH:mm');
            var timeEnd = moment(momDate + ' ' + momEndTime, 'DD/MM/YYYY HH:mm');
            var duration = moment.duration(timeEnd.diff(timeStart));
            if (duration >= 0) {
                var totalDiffMinutes = duration.asMinutes();
                var diffHours = Math.floor(totalDiffMinutes / 60);
                var diffmin = Math.floor(totalDiffMinutes % 60);
                $scope.timeDuration = diffHours + " Hrs " + diffmin + " minutes ";
                return $scope.timeDuration;
            } else {
                $scope.errMessage2 = 'End Time should be greater than start time';
                $scope.highlightcolor2 = "#dd4b39";
            }
        }
    }

    $scope.taskArray = [];
    $scope.taskUserArray = [];
    $scope.taskForm = {};
    $scope.addMoMTask = function () {
        if ($("#momAddTaskForm").valid()) {
            var userName = $("#taskUser option:selected").text();
            var tasksCurrentStatus = $("#taskStatus option:selected").text();
            var taskstartDate = Utility.formatDate($scope.taskForm.taskStartDate, "Y/m/d");
            var taskdueDate = Utility.formatDate($scope.taskForm.taskEndDate, "Y/m/d");
            var req = {
                "name": $scope.taskForm.taskName,
                "description": $scope.taskForm.taskDesc,
                "type": $scope.taskForm.taskType,
                "user_name": userName,
                "user_id": $scope.taskForm.taskUser,
                // "status": tasksCurrentStatus,
                "status": 'Pending',
                "start_date": taskstartDate,
                "due_date": taskdueDate,
                "created_by": loggedInUser.id,
                "updated_by": loggedInUser.id
            };

            $scope.taskArray.push(req);
            $('#momAddTaskForm').trigger("reset");
            $scope.taskForm = {};
            $('#taskStartDate').datepicker('setDate', '');
            $('#taskEndDate').datepicker('setDate', '');
            $scope.resetEditModalForm();
            applySelect2();
            // setTimeout(function(){
            //     $scope.resetEditModalForm();
            // },10);

            // $('#taskStartDate').valid();
            // $("#taskStatus").val('');

            // var promise = services.createMoMTask(req);
            // promise.then(function mySuccess(response) {
            //     Utility.stopAnimation();
            //     try {
            //         toastr.success('MoM task created successfully..');
            //         $location.url('/mom/add');
            //     } catch (e) {
            //         toastr.error("MoM task not saved successfully..");
            //         Raven.captureException(e)
            //     }
            // }, function myError(r) {
            //     toastr.error(r.data.message, 'Sorry!');
            //     Utility.stopAnimation();
            // });  
        }
    }

    $scope.deleteTask = function (taskId) {
        $scope.taskArray.splice(taskId, 1);
        toastr.success("Deleted Successfully...!!");
    }

    $scope.momArray = [];
    $scope.saveMoM = function () {
        // if ($scope.taskArray.length <= 0) {
        //     $("#momAddTaskForm").valid();
        // }
        // if ($("#momAddForm").valid() && $scope.taskArray.length > 0) {
        if ($("#momAddForm").valid()) {
            for (var i = 0; i < $scope.taskArray.length; i++) {
                delete $scope.taskArray[i]["user_name"];
            }
            var momSDate = Utility.formatDate($scope.momDate, "Y/m/d");
            var attendeesIdArray = [];
            var momattendeesArray = $scope.attendees;
            for (i = 0; i < momattendeesArray.length; i++) {
                users = JSON.parse(momattendeesArray[i]);
                user_id = users["id"];
                attendeesIdArray.push(user_id);
            }
            $scope.attendees = attendeesIdArray;

            var req = {
                "title": $scope.momTitle,
                "meeting_venue": $scope.momVenue,
                "date": momSDate,
                "start_time": $scope.momStartTime,
                "end_time": $scope.momEndTime,
                "user_id": $scope.momUser,
                "description": $scope.momDesc,
                "keyword": $scope.momKeyword,
                "status": $scope.momStatus,
                "project_id": $scope.momName,
                "users": $scope.attendees,
                "client_names": $scope.momClient,
                "tasks": $scope.taskArray,
                "created_by": loggedInUser.id,
                "updated_by": loggedInUser.id
            };
            $scope.momArray.push(req);
            var promise = services.createMoM(req);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    toastr.success('MoM created successfully..');
                    $location.url('/mom/mom-list');
                } catch (e) {
                    toastr.error("MoM not saved successfully..");
                    Raven.captureException(e)
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
    }

    $scope.getListOfAttendees = function (attendees) {
        $scope.attendeesList = [];
        if (attendees.length > 0) {
            for (var i = 0; i < attendees.length; i++) {
                $scope.attendeesList.push(JSON.parse(attendees[i]));
            }
        }
    }

    $scope.getListOfAttendeesForEdit = function (attendees) {
        $scope.attendeesList = [];
        for (var i = 0; i < attendees.length; i++) {
            $scope.attendeesList.push(JSON.stringify(attendees[i]));
        }
        return $scope.attendeesList;
    }

    $scope.viewTask = function (data, status) {
        setTimeout(function () { setCSS(); }, 500);
        $("#showTaskModal").modal("toggle");
        $scope.taskForm.taskNamee = data.name;
        $scope.taskForm.taskDesce = data.description;
        $scope.taskForm.taskTypee = data.type;
        // $scope.taskForm.userNamee = data.user_name;
        $scope.taskForm.taskUsere = data.user_id;
        $scope.taskForm.taskStatuse = data.status;
        if (status == 'add') {
            $scope.taskForm.userNamee = data.user_name;
            $scope.taskForm.taskStartDatee = Utility.formatDate(data.start_date);
            $scope.taskForm.taskEndDatee = Utility.formatDate(data.due_date);
        } else {
            $scope.taskForm.userNamee = data.user.name;
            $scope.taskForm.taskStartDatee = data.start_date;
            $scope.taskForm.taskEndDatee = data.due_date;
        }
    }

    $scope.editTask = function (data, index) {
        $scope.task_index = index;
        setTimeout(function () { setCSS(); }, 500);
        $("#editTaskModal").modal("show");
        $scope.taskForm.taskNamee = data.name;
        $scope.taskForm.taskDesce = data.description;
        $scope.taskForm.taskTypee = data.type;
        $scope.taskForm.userNamee = data.user_name;
        $scope.taskForm.taskUsere = parseInt(data.user_id);
        $scope.taskForm.taskStatuse = data.status;
        $scope.taskForm.taskStartDatee = Utility.formatDate(data.start_date);
        $("#editTaskStartDate").datepicker('setDate', $scope.taskForm.taskStartDatee);
        $scope.taskForm.taskEndDatee = Utility.formatDate(data.due_date);
        $("#editTaskEndDate").datepicker('setDate', $scope.taskForm.taskEndDatee);
        applySelect2();
        // $scope.attendeesList = data.user;
    }

    $scope.saveTask = function () {
        if ($("#momAddTaskForm").valid()) {
            var userName = $("#taskUser option:selected").text();
            var tasksCurrentStatus = $("#taskStatus option:selected").text();
            var taskstartDate = Utility.formatDate($scope.taskForm.taskStartDate, "Y/m/d");
            var taskdueDate = Utility.formatDate($scope.taskForm.taskEndDate, "Y/m/d");
            var req = {
                "name": $scope.taskForm.taskName,
                "description": $scope.taskForm.taskDesc,
                "type": $scope.taskForm.taskType,
                "user_name": userName,
                "user_id": $scope.taskForm.taskUser,
                // "status": tasksCurrentStatus,
                "status": 'Pending',
                "start_date": taskstartDate,
                "due_date": taskdueDate,
                "created_by": loggedInUser.id,
                "updated_by": loggedInUser.id
            };

            $scope.taskArray[$scope.task_index] = req;
            $scope.taskForm = {};
            $("#editTaskModal").modal("hide");
            toastr.success("Saved Successfully...!!");
        }
    }

    $scope.resetEditModalForm = function () {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
    }

    $scope.saveModalTask = function () {
        if ($("#momModalAddTaskForm").valid()) {
            var userName = $("#taskUsere option:selected").html();
            var tasksCurrentStatus = $("#taskStatus option:selected").text();
            var taskstartDate = Utility.formatDate($scope.taskForm.taskStartDatee, "Y/m/d");
            var taskdueDate = Utility.formatDate($scope.taskForm.taskEndDatee, "Y/m/d");
            var req = {
                "name": $scope.taskForm.taskNamee,
                "description": $scope.taskForm.taskDesce,
                "type": $scope.taskForm.taskTypee,
                "user_name": userName,
                "user_id": $scope.taskForm.taskUsere,
                // "status": tasksCurrentStatus,
                "status": 'Pending',
                "start_date": taskstartDate,
                "due_date": taskdueDate,
                "created_by": loggedInUser.id,
                "updated_by": loggedInUser.id
            };

            $scope.taskArray[$scope.task_index] = req;
            $("#editTaskModal").modal("hide");
            // $scope.taskForm = {};
            // $("#taskName").focus();
            // setTimeout(function(){$("#taskName").focus();},50);
            toastr.success("Saved Successfully...!!");
        }
    }

    $scope.editMoM = function (id) {
        var promise = services.viewMoM(id);
        promise.success(function (response) {
            if (response.data) {
                $scope.title = "Edit MoM";
                $scope.momTitle = response.data.title;
                $scope.momVenue = response.data.meeting_venue;
                $scope.momDate = Utility.formatDate(response.data.date);
                $scope.momStartTime = response.data.start_time;
                $scope.momEndTime = response.data.end_time;
                $scope.calculateMeetingTimeDuration($scope.momDate, $scope.momStartTime, $scope.momEndTime);
                $scope.momUser = response.data.user_id;
                $scope.momDesc = response.data.description;
                $scope.momKeyword = response.data.keyword;
                $scope.momStatus = response.data.status;

                // For MOMtopic name
                var momProjectArray = response.data.projects;
                var projectArr = [];
                if (momProjectArray) {
                    for ($i = 0; $i < momProjectArray.length; $i++) {
                        if (momProjectArray[$i]['id']) {
                            projectArr.push(momProjectArray[$i]['id']);
                        }
                    }
                }
                $scope.momName = projectArr;

                // For MOMAttendees name
                $scope.momattendeesArray = response.data.attendees;
                var attendeesArr = [];
                if ($scope.momattendeesArray) {
                    for ($i = 0; $i < $scope.momattendeesArray.length; $i++) {
                        if ($scope.momattendeesArray[$i]['id']) {
                            // attendeesArr.push(momattendeesArray[$i]['id']);
                            attendeesArr.push($scope.momattendeesArray[$i]['id']);
                        }
                    }
                }
                // setTimeout(function(){$scope.attendees = attendeesArr;},10000);

                $scope.attendees = attendeesArr;
                // $scope.attendees = response.data.attendees;

                /* For MOMAttendees name
                    var momattendeesArray=response.data.attendees;
                    var attendeesArr = [];
                    if (momattendeesArray) {
                        for ($i = 0; $i < momattendeesArray.length; $i++) {
                            if (momattendeesArray[$i]) {
                                delete momattendeesArray[$i]["pivot"];                                 
                                attendeesArr.push(JSON.stringify(momattendeesArray[$i]));
                            }
                        }
                    }

                    // $scope.attendees=JSON.stringify(momattendeesArray);
                    $scope.attendees=attendeesArr;
                */

                // For MOMClients name
                var momClientArray = response.data.clients;
                var clientsArr = [];
                if (momClientArray) {
                    for ($i = 0; $i < momClientArray.length; $i++) {
                        if (momClientArray[$i]['name']) {
                            clientsArr.push(momClientArray[$i]['name']);
                        }
                    }
                }
                $scope.momClient = clientsArr;

                // For MoM task array start date and due date
                var momTaskArrayList = response.data.tasks;
                if (momTaskArrayList) {
                    for ($i = 0; $i < momTaskArrayList.length; $i++) {
                        if (momTaskArrayList[$i]['start_date'] && momTaskArrayList[$i]['due_date']) {
                            momTaskArrayList[$i]['start_date'] = Utility.formatDate(momTaskArrayList[$i]['start_date']);
                            momTaskArrayList[$i]['due_date'] = Utility.formatDate(momTaskArrayList[$i]['due_date']);
                        }
                    }
                }
                $scope.taskArray = momTaskArrayList;
                applySelect2();
            }
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    $scope.updateSavedMoM = function (id) {
        if ($("#momEditForm").valid()) {
            var req = {
                "id": $scope.MOMId,
                "title": $scope.momTitle,
                "meeting_venue": $scope.momVenue,
                "date": Utility.formatDate($scope.momDate, "Y/m/d"),
                "start_time": $scope.momStartTime,
                "end_time": $scope.momEndTime,
                "user_id": $scope.momUser,
                "description": $scope.momDesc,
                "keyword": $scope.momKeyword,
                "status": $scope.momStatus,
                "project_id": $scope.momName,
                "users": $scope.attendees,
                "client_names": $scope.momClient,
                // "tasks": $scope.taskArray
            };
            var promise = services.updateMoM(req);
            promise.success(function (response) {
                if (response.data) {
                    $scope.momList = response.data.data;
                    $location.path('/mom/mom-list');
                }
                Utility.stopAnimation();
                toastr.success("Updated successfully...");
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    $scope.taskForm = {};
    $scope.updateSavedTask = function (id) {
        if ($("#momAddTaskForm").valid()) {
            var req = {
                "name": $scope.taskForm.taskName,
                "description": $scope.taskForm.taskDesc,
                "type": $scope.taskForm.taskType,
                "user_name": userName,
                "user_id": $scope.taskForm.taskUser,
                "status": $scope.taskForm.taskStatus,
                "start_date": Utility.formatDate($scope.taskForm.taskStartDate, "Y/m/d"),
                "due_date": Utility.formatDate($scope.taskForm.taskEndDate, "Y/m/d"),
                "created_by": loggedInUser.id,
                "updated_by": loggedInUser.id
            };

            var promise = services.createMoMTask(req);
            promise.success(function (response) {
                if (response.data) {
                    $scope.momTaskList = response.data.data;
                }
                Utility.stopAnimation();
                toastr.success("Updated successfully...");
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    $scope.viewMoMTaskList = function (id) {
        var promise = services.viewMoM(id);
        promise.success(function (response) {
            $scope.momViewDate = Utility.formatDate(response.data.date);
            $scope.momViewTitle = response.data.title;
            $scope.momViewStatus = response.data.status;
            $scope.momViewkeyword = response.data.keyword;
            $scope.momViewEndTime = response.data.end_time;
            $scope.momViewClients = response.data.clients;
            $scope.momViewProjects = response.data.projects;
            $scope.momViewCalledBy = response.data.user.name;
            $scope.momViewStartTime = response.data.start_time;
            $scope.momViewAttendees = response.data.attendees;
            $scope.momViewDescription = response.data.description;
            $scope.momViewMeetingVenue = response.data.meeting_venue;
            if (response.data.tasks) {
                $scope.TaskListofMoM = response.data.tasks;
                for ($i = 0; $i < response.data.tasks.length; $i++) {
                    $scope.taskStartDateofMom = Utility.formatDate(response.data.tasks[$i].start_date);
                    $scope.taskEndDateofMom = Utility.formatDate(response.data.tasks[$i].due_date);
                }
            }
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    $scope.deleteMoM = function (id) {
        swal({
            title: "Sure?",
            text: "Delete this MoM?",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonText: "Yes",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: '#d33',
            cancelButtonText: "No",
            animation: false,
            customClass: 'animated tada'
        }).then(function () {
            var promise = services.deleteMoMById(id);
            promise.then(function mySuccess(response) {
                // Utility.stopAnimation();
                if (response.data.message == "MoM Deleted Successfull...!!") {
                    toastr.success(response.data.message);
                    setTimeout(function () {
                        $scope.init();
                        $scope.getMoMList();
                    }, 100);
                    //$scope.init();
                } else {
                    toastr.error(response.data.message);
                }
            }, function myError(response) {
                //$scope.init();
                Utility.stopAnimation();
                toastr.error(response.data.message);
            });
        }).catch(swal.noop);
    }

    $scope.init();

    //method for saving changed status comment
    $scope.changeStatus = function () {
        if ($("#changeMoMStatusForm").valid()) {
            var req = {
                // "mom_id":$scope.momNameFilter,
                "task_id": $scope.selectedTaskId,
                "status": $scope.taskStatus
            }
            var promise = services.changeStatusMomTask(req);
            promise.success(function (response) {
                if (response.data) {
                    $scope.MOMId = $routeParams.id || "Unknown";
                    $scope.viewMoMTaskList($scope.MOMId);
                }
                Utility.stopAnimation();
                // toastr.success("Successfully...");
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
            $("#changeMoMStatusModal").modal("toggle");
        }
    }

    $scope.openChangeStatusModal = function (task_id) {
        setTimeout(function () { setCSS(); }, 500);
        $("#changeMoMStatusModal").modal("toggle");
        $scope.selectedTaskId = task_id;
    }

    $scope.resetChangeStatusModal = function () {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
        $scope.taskStatus = '';
        $scope.status_comment = '';
    }

    $scope.openaddCommentModal = function () {
        setTimeout(function () { setCSS(); }, 500);
        $scope.htmlContent = "";
        // $("#addCommentToTaskForm")[0].reset();
        $("#addCommentToTaskModale").modal("toggle");
    }

    //method for adding comment to particular task
    $scope.addCommentToTask = function () {
        if ($("#addCommentToTaskForm").valid()) {
            $("#addCommentToTaskModale").modal("toggle");
        }
    }

    $scope.openViewTaskModal = function (taskData) {
        $scope.viewTaskName = taskData.name;
        $scope.viewTaskType = taskData.type;
        $scope.viewTaskUserName = taskData.user.name;
        $scope.viewTaskDesc = taskData.description;
        $scope.viewTaskStatus = taskData.status;
        $scope.viewTaskStartDate = Utility.formatDate(taskData.start_date);
        $scope.viewTaskEndDatee = Utility.formatDate(taskData.due_date);
        $("#viewTaskModal").modal("toggle");
    }

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

    $scope.getPeopleText = function (item) {
        // note item.label is sent when the typedText wasn't found
        // return '[~<i>' + (item.name || item.label) + '</i>]';
        return '<a href="/user/info/' + item.id + '">' + (item.name || item.label) + '</a>';
    };

    $scope.getPeopleTextRaw = function (item) {
        return '@' + item.name;
    };

    $scope.resetForm = function () {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
        $("#momAddTaskForm").trigger("reset");
        $("#momAddForm").trigger("reset");
        $scope.taskForm = {};
        $scope.taskArray = [];
        // $('#momStartTime').timepicker('setTime', new Date());
        // $('#momEndTime').timepicker('setTime', new Date());
        $('#momStartTime').timepicker('update', new Date());
        $('#momEndTime').timepicker('update', new Date());
        // $scope.timeDuration = '0 Hrs 0 minutes' ;
        // $scope.calculateMeetingTimeDuration(momDate, momStartTime, momEndTime);
        applySelect2();
    };

    $scope.refreshfilter = function () {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
        $(".error").hide();
        $('#filterDataForm')[0].reset();
        $scope.momNameFilter = '';
        $scope.momClientFilter = '';
        $scope.momStatusFilter = '';
        $scope.momFilterFromDate = '';
        $scope.momFilterToDate = '';
        $('#momFilterFromDate').datepicker('setDate', '');
        $('#momFilterToDate').datepicker('setDate', '');
        applySelect2();
        // $scope.findWithFilter();
        $scope.fetchList(-1);
    };

    $scope.findWithFilter = function (page) {
        $scope.limit = $('#table_length').val();
        if ($scope.limit == undefined) {
            $scope.limit = -1;
        }
        if (page == -1) {
            $scope.pageno = 1;
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else {
            $scope.pageno = page;
        }
        var requestParam = {
            page: $scope.pageno,
            // limit:pagination.getpaginationLimit(),
            limit: $scope.limit,
        }
        var from_date = '';
        var to_date = '';
        if ($scope.momFilterFromDate != undefined && $scope.momFilterFromDate != '') {
            from_date = Utility.formatDate($scope.momFilterFromDate, "Y/m/d");
        }
        if ($scope.momFilterToDate != undefined && $scope.momFilterToDate != '') {
            to_date = Utility.formatDate($scope.momFilterToDate, "Y/m/d");
        }
        var req = {
            "project_id": $scope.momNameFilter,
            "client_name": $scope.momClientFilter,
            "status": $scope.momStatusFilter,
            "from_date": from_date,
            "to_date": to_date
        }

        var promise = services.filterMom(req, requestParam);
        promise.success(function (response) {
            Utility.stopAnimation();
            try {
                if (response.data) {
                    $scope.MoMList = response.data.data;
                    for ($i = 0; $i < response.data.data.length; $i++) {
                        var date = response.data.data[$i].date;
                        $scope.MoMList[$i]["taskDate"] = Utility.formatDate(date);
                        var startTime = response.data.data[$i].start_time;
                        var endTime = response.data.data[$i].end_time;
                        var taskListDuration = $scope.calculateMeetingTimeDuration($scope.MoMList[$i]["taskDate"], startTime, endTime);
                        $scope.MoMList[$i]["duration"] = taskListDuration;
                    }
                    $scope.applyPagination(response.data);
                }
            } catch (e) {
                toastr.error("No matching results found.", 'Sorry!');
                Raven.captureException(e)
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    $scope.applyPagination = function (pageData) {
        $('#pagination-sec').twbsPagination({
            totalPages: pageData.last_page,
            visiblePages: 5,
            first: '',
            last: '',
            onPageClick: function (event, page) {
                if ($scope.momNameFilter == undefined && $scope.momClientFilter == undefined && $scope.momStatusFilter == undefined && $scope.momFilterFromDate == undefined && $scope.momFilterToDate == undefined && page == 1) {
                    toastr.error("Please select atleast one field.");
                }
                else if ($scope.momNameFilter == undefined && $scope.momClientFilter == undefined && $scope.momStatusFilter == undefined && $scope.momFilterFromDate == undefined && $scope.momFilterToDate == undefined) {
                    // toastr.error("Please, Select atleast one field.");
                }
                else {
                    toastr.success('Filtered successfully.');
                }
                if ($scope.skip) {
                    $scope.skip = false;
                    return;
                }
                $scope.findWithFilter(page);
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }
        });
    }
});