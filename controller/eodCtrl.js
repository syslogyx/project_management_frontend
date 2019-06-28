app.controller('eodCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore, $routeParams, pagination, AclService, breadcrumbs) {

    $scope.breadcrumbs = breadcrumbs;
    var eod = this;
    $scope.can = AclService.can;
    eod.id = null;
    eod.allEODs = [];
    eod.todayTaskList = [];
    eod.pageno = 0;
    eod.limit = 0;
    eod.eod_id = $routeParams.id || "Unknown";
    eod.employee = null;
    eod.ipAddress = "";
    // eod.myEODStatus = false;
    // var globalEODID =0;
    // $rootScope.$emit("menuCtrlMethod",{});

    eod.todayTaskList = [];
    eod.todayMeetingList = [];
    eod.todayBreakList = [];
    eod.hrmsWrkgTime = '00:00:00';
    eod.taskTodaySpendTime = '00:00:00';
    eod.todayMiscellaneousTime = '00:00:00';
    eod.miscellaneousTimeReason = '';
    eod.remainingMiscTime = '00:00:00';

    eod.totalEntries = null;
    eod.fromValue = null;
    eod.toValue = null;

    eod.priorities = [
        { id: 1, name: "High" },
        { id: 2, name: "Medium" },
        { id: 3, name: "Low" }
    ];

    eod.approval_satatus = true;
    var menu = menuService.getDashboardMenu();

    for (var i = 0; i < menu.length; i++) {
        var path = $location.path().split("/")[2] == "eod_list" ? 'EOD History' : 'Send EOD';
        for (var j = 0; j < menu[i].child.length; j++) {
            if (menu[i].child[j].menu_name == path) {
                menu[i].child[j].active = 'active';
            } else {
                menu[i].child[j].active = 'deactive';
            }
        }
        if (menu[i].menu_name == 'Projects') {
            menu[i].url = '/project/';
            menu[i].child = [];
        }
        if (menu[i].menu_name == 'EOD') {
            menu[i].active = 'active';
        } else {
            menu[i].active = 'deactive';
        }
    }

    menuService.setMenu(menu);

    var loggedInUser = services.getIdentity();
    eod.loggedIn_userId = loggedInUser.id;

    eod.confirmFlag = false;
    for (var role = 0; role < loggedInUser.identity.role.length; role++) {
        if (loggedInUser.identity.role[role].name == 'Super Admin' || loggedInUser.identity.role[role].name == 'Admin' || loggedInUser.identity.role[role].name == 'Manager') {
            eod.confirmFlag = true;
            break;
        }
    }

    if (eod.confirmFlag == true) {
        var promise = services.getAllUsers();
        promise.success(function (result) {
            Utility.stopAnimation();
            eod.employeList = result.data.data;
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    } else {
        var promise = services.getAllUsersUnderLead(eod.loggedIn_userId);
        promise.success(function (result) {
            Utility.stopAnimation();
            eod.employeList = result.data;
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    setTimeout(function () {
        $('#table_length').on('change', function () {
            eod.fetchList(-1, $source = null);
        });
    }, 100);

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
        eod.ipAddress = ip;
    });

    eod.init = function ($source = null) {
        $('#sendEodButton').attr('disabled', false);
        eod.getLoginUserHRMSDataAndHRMSReasonList(eod.loggedIn_userId);
        eod.id = $location.search()["id"];
        eod.id = $routeParams.id || "Unknown";
        for (var role = 0; role < loggedInUser.identity.role.length; role++) {
            // $scope.can('user.mom.select_employee')
            if ((loggedInUser.identity.role[role].name == 'Lead' || loggedInUser.identity.role[role].name == 'Super Admin' || loggedInUser.identity.role[role].name == 'Admin' || loggedInUser.identity.role[role].name == 'Manager') && $source != 'Search1') {
                eod.eodDate = Utility.formatDate(new Date());
                $('#eodListDate').datepicker({
                    autoclose: true,
                    todayHighlight: true
                }).datepicker("setDate", new Date());
                eod.employee = '';
                break;
            } else {
                if ($source != 'Search1') {
                    eod.eodDate = '';
                }
            }
        }
        if (eod.id > 0) {
            var req = {
                "user_id": eod.loggedIn_userId,
                "id": eod.id
            };
            for (var role = 0; role < loggedInUser.identity.role.length; role++) {
                if (loggedInUser.identity.role[role].name == 'Super Admin' || loggedInUser.identity.role[role].name == 'Admin' || loggedInUser.identity.role[role].name == 'Manager') {
                    req.user_id = null;
                    break;
                }
            }
            var promise = services.viewEODDataById(req);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                // Suvrat Issue#3178
                eod.todayDate = response.data.data.date;
                /////////////////////
                eod.taskList = response.data.data.eod_task;
                eod.todayMeetingList = response.data.data.meeting_break;
                eod.todayMiscellaneousTime = response.data.data.miscellaneous_time;
                eod.todayMiscellaneousReason = response.data.data.miscellaneous_reason;
                eod.todayMiscellaneousList = response.data.data.miscellaneous_records;
                for (var i = 0; i < eod.taskList.length; i++) {
                    if (eod.taskList[i].approval_status == 1) {
                        eod.taskList[i].approval_status = true;
                    } else {
                        eod.taskList[i].approval_status = false;
                    }
                }
                // Suvrat Issue#3170
                for (i = 0; i < (eod.taskList).length; i++) {
                    if (eod.taskList[i].task.estimated_time) {
                        temp = eod.taskList[i].task.estimated_time;
                        temp = temp.split(".");
                        temp1 = temp[0];
                        temp2 = temp[1];
                        if (temp2 == undefined) {
                            temp2 = "00";
                        }
                        temp3 = temp1 + ":" + temp2;
                        eod.taskList[i].task.estimated_time = temp3;
                    }
                }
                ////////////////////////
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });

            /*Kalyani: view EOD by ID API call */
            /*
            var promise = services.viewEODById({id: eod.id});
            promise.then(function mySuccess(response) {
                console.log(response.data.data);
                Utility.stopAnimation();
                eod.taskList = response.data.data.eod_task;
                eod.todayMeetingList = response.data.data.meeting_break;
                eod.todayMiscellaneousTime = response.data.data.miscellaneous_time;
                eod.todayMiscellaneousReason = response.data.data.miscellaneous_reason;
                for(var i = 0; i< eod.taskList.length; i++){
                    if(eod.taskList[i].approval_status == 1){
                        eod.taskList[i].approval_status = true;
                    }else{
                        eod.taskList[i].approval_status = false;
                    }
                }

                // setTimeout(function(){
                //     debugger
                //    $('#toggle-two').bootstrapToggle({
                //       on: 'Yes',
                //       off: 'No'
                //     });
                //     $('#toggle-two').change(function(){
                //         if($(this).prop("checked") == true){
                //            //run code
                //         }else{
                //            $("#addCommentToTaskModalForApprovalStatus").modal("toggle");
                //            setTimeout(function(){
                //                 setCSS();
                //             },500);
                //     }
                //     });
                // },500);
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });*/
        } else {
            // eod.myEODStatus = false;
            eod.fetchList(-1, $source);
            eod.limit = $('#table_length').val();
        }
    }

    eod.getLoginUserHRMSDataAndHRMSReasonList = function (userId) {
        var promise = services.getUserById(userId);
        promise.success(function (result) {
            eod.loginUSerHRMSID = result.data.user_id;
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        /*Sonal:Get HRMS break stop Reason List */
        var promise = services.getHRMsBreakReasonList();
        promise.success(function (response) {
            if (response.status_code == 200) {
                eod.HRMSBreakReasonList = response.data;
            }
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    eod.openModalForApprovalComment = function (index) {
        if ($("#togBtn_" + index).prop("checked") == true) {
            // eod.taskList[eod.arrayIndex]["approval_status"] = 1;
        } else {
            // eod.taskList[eod.arrayIndex]["approval_status"] = 0;
            $("#addCommentToTaskModalForApprovalStatus").modal("toggle");
            setTimeout(function () {
                setCSS();
            }, 500);
        }
    }

    /*Sonal Fetch all EOD List CODE */
    eod.fetchList = function (page, $source) {
        eod.limit = $('#table_length').val();
        // if(eod.limit  == undefined){
        //     eod.limit  = -1;
        // }
        if (page == -1) {
            eod.pageno = 1;
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        } else {
            eod.pageno = page;
        }
        var requestParam = {
            page: eod.pageno,
            limit: eod.limit,
        };
        // if(eod.myEODStatus == false){
        var date = '';
        if ($scope.can('user.mom.select_employee')) {
            date = Utility.formatDateToYYMMDD(new Date());
        } else {
            if (eod.eodDate == '' || eod.eodDate == null) {
                date = '';
            } else {
                date = Utility.formatDate(eod.eodDate, "Y/m/d");
            }
        }
        // }

        var userID = eod.loggedIn_userId;

        if (eod.employee) {
            userID = eod.employee;
        }

        if (eod.eodDate) {
            date = Utility.formatDate(eod.eodDate, "Y/m/d");
        }

        var loggedInUser = services.getIdentity();
        var req = {
            "user_id": userID,
            "date": date
        };

        // if(eod.myEODStatus == false){
        for (var role = 0; role < loggedInUser.identity.role.length; role++) {
            if (loggedInUser.identity.role[role].name == 'Lead') {
                req.lead_id = eod.loggedIn_userId;
                break;
            } else {
                req.lead_id = '';
            }
        }

        if ($source == null) {
            for (var role = 0; role < loggedInUser.identity.role.length; role++) {
                if (loggedInUser.identity.role[role].name == 'Super Admin' || loggedInUser.identity.role[role].name == 'Admin' || loggedInUser.identity.role[role].name == 'Manager') {
                    req.user_id = null;
                    req.lead_id = '';
                    break;
                } else if (loggedInUser.identity.role[role].name == 'Lead') {
                    req.user_id = null;
                    break;
                }
            }
        } else {
            if (req.lead_id != '') {
                if (eod.employee == undefined || eod.employee == '' || eod.employee == null) {
                    req.user_id = null;
                }
            }

            for (var role = 0; role < loggedInUser.identity.role.length; role++) {
                if (loggedInUser.identity.role[role].name == 'Super Admin' || loggedInUser.identity.role[role].name == 'Admin' || loggedInUser.identity.role[role].name == 'Manager') {
                    if (eod.employee == undefined || eod.employee == '' || eod.employee == null) {
                        req.user_id = null;
                    }
                    break;
                } else if (loggedInUser.identity.role[role].name == 'Lead') {
                    req.token = true;
                    break;
                }
            }

            if (eod.eodDate == '' || eod.eodDate == null) {
                req.date = null;
            }
        }
        // }

        var promise = services.getAllEODs(req, requestParam);
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.data != null) {
                for (var i = 0; i < result.data.data.length; i++) {
                    result.data.data[i].date = Utility.formatDate(result.data.data[i].date);
                }
                eod.allEODs = result.data.data;
                eod.totalEntries = result.data.total;
                eod.fromValue = result.data.from;
                eod.toValue = result.data.to;
                pagination.applyPagination(result.data, eod, $source);
            } else {
                if (req.date == Utility.formatDateToYYMMDD(new Date())) {
                    eod.allEODs = result.data;
                    if (eod.allEODs == null) {
                        if ($source !== null)
                            toastr.error("No matching results found.", 'Sorry!');
                    }
                } else {
                    eod.allEODs = null;
                    if ($source !== null)
                        toastr.error("No matching results found.", 'Sorry!');
                }
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }
    eod.getMyEodList = function ($source) {
        eod.limit = $('#table_length').val();
        eod.myEODStatus = true;
        eod.eodDate = "";
        eod.fetchList(-1, $source);
    }

    eod.init();

    eod.resetFilter = function () {
        // $scope.can('user.mom.select_employee' ||
        for (var role = 0; role < loggedInUser.identity.role.length; role++) {
            if (loggedInUser.identity.role[role].name == 'Lead' || loggedInUser.identity.role[role].name == 'Super Admin' || loggedInUser.identity.role[role].name == 'Admin' || loggedInUser.identity.role[role].name == 'Manager') {
                $('#eodListDate').datepicker({
                    autoclose: true,
                    todayHighlight: true
                }).datepicker("setDate", new Date());
                eod.eodDate = Utility.formatDate(new Date());
                eod.employee = null;
                break;
            } else {
                eod.eodDate = '';
                // $('#eodListDate').datepicker("setDate", new Date());
            }
        }
        eod.init();
    }

    eod.setDataForComment = function (index) {
        eod.arrayIndex = index;
    }

    $scope.resetChangeStatusForm = function () {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
        });
        $scope.user = angular.copy($scope.eod);
        setTimeout(function () {
            setCSS();
        }, 500);
    };

    eod.getTaskInfo = function (taskId, totalSpentTime, todaysSpentTime) {
        var promise = services.getTask({ id: taskId });
        promise.then(function mySuccess(response) {
            Utility.stopAnimation();
            eod.taskName = response.data.data.task.title;
            eod.taskDescription = response.data.data.task.description;
            eod.milestoneData = response.data.data.task.milestone_id;
            eod.milestoneName = response.data.data.task.milestones.title;
            eod.priority = response.data.data.task.priority_id;
            eod.assignedToData = response.data.data.task.assigned_to;
            eod.assignedToName = response.data.data.task.project_resource.user.name;
            if (response.data.data.task.technical_support.length > 0) {
                eod.technicalSupport = response.data.data.task.technical_support[0].user.name;
            }
            eod.taskStatusData = response.data.data.task.status_id;
            eod.task_estimation = response.data.data.task.estimated_time;
            // Suvrat Issue#3170
            temp = eod.task_estimation;
            temp = temp.split(".");
            temp1 = temp[0];
            temp2 = temp[1];
            if (temp2 == undefined) {
                temp2 = "00";
            }
            temp3 = temp1 + ":" + temp2;
            eod.task_estimation = temp3;
            /////////////////////////            
            eod.task_comment_list = response.data.data.task.task_comment;
            eod.spent_time = response.data.data.task.spent_time;
            eod.spent_task_time = totalSpentTime;
            eod.todays_spent_time = response.data.data.task.todays_spent_time;
            eod.todays_spent_task_time = todaysSpentTime;
            eod.break_time = response.data.data.task.break_time;
            eod.project_name = response.data.data.task.project_resource.project.name;
            // Suvrat Issue#3179
            // for(var i = 0; i < response.data.data.task.eod_assoc.length; i++) {
            //     if(response.data.data.task.eod_assoc[i].eod_id == globalEODID) {
            //         eod.eod_total_spent_time = response.data.data.task.eod_assoc[i].total_spent_time;
            //         eod.eod_todays_spent_time = response.data.data.task.eod_assoc[i].todays_spent_time;
            //     }
            // }
            $("#viewTaskModal").modal('toggle');
            $scope.resetChangeStatusForm();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    $scope.comments = [];
    $scope.addRow = function () {
        $scope.comments.push($scope.comment);
        $scope.comment = '';
    };

    $scope.removeRow = function (index) {
        $scope.comments.splice(index, 1);
    }

    $scope.setData = function (eod_id, task_id, index) {
        $scope.eod_id = eod_id;
        $scope.task_id = task_id;
        $scope.taskCommentList = eod.taskList[index].task.task_comment;
        // eod.arrayIndex = index;
    }

    $scope.addCommentToTask = function () {
        var req = {
            "task_id": $scope.task_id,
            "eod_id": $scope.eod_id,
            "comments": $scope.comments
        };
        eod.todayTaskList[eod.arrayIndex]["task_comment"] = $scope.comments;
        eod.arrayIndex = eod.arrayIndex + 1;
        $scope.comments = [];
        $("#addCommentToTaskModale").modal("toggle");
    }

    $scope.addCommentToTaskModalForApprovalStatus = function () {
        if ($("#add_comment_form").valid()) {
            eod.taskList[eod.arrayIndex]["task_comment"] = eod.disapproval_comment;
            eod.disapproval_comment = '';
            $("#addCommentToTaskModalForApprovalStatus").modal("toggle");
        }
    }

    eod.isConfirmFlag = false;
    eod.checkTaskAndHRMSBreakStatus = function () {
        if ($("#add_miscellaneous_reason_form").valid()) {
            $('#sendEodButton').attr('disabled', true);
            for (i = 0; i < eod.todayTaskList.length; i++) {
                if (eod.todayTaskList[i].status_id == 'Start') {
                    eod.isConfirmFlag = true;
                    eod.startTaskId = eod.todayTaskList[i].id;
                    eod.taskProjectID = eod.todayTaskList[i].project_resource.project.id;
                    break;
                }
            }
            /*Sonal:To stop/ Pause task  */
            if (eod.isConfirmFlag == true) {
                swal({
                    // title: "Sure?",
                    text: "Please Stop/Pause task first.",
                    type: "warning",
                    showCancelButton: true,
                    closeOnConfirm: true,
                    confirmButtonText: "Yes",
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: '#d33',
                    cancelButtonText: "No",
                    animation: false,
                    customClass: 'animated tada'
                }).then(function (isConfirm) {
                    if (isConfirm) {
                        window.location.href = '/project/task/view/' + eod.taskProjectID + '?id=' + eod.startTaskId;
                    }
                }, function (dismiss) {
                    if (dismiss === 'cancel') {
                        // console.log('gjhgjgh');
                    }
                }).catch(swal.noop);
            } else {
                /*Sonal:Check HRMS Break Status  */
                var promise = services.checkUserHRMSBreakStatus(eod.loginUSerHRMSID);
                promise.success(function (response) {
                    if (response.status_code == 200) {
                        if (response.data.status == 1) {
                            eod.HrmsUserBreakID = response.data.id;
                            $("#endHRMSBreakModal").modal("show");
                            setTimeout(function () {
                                setCSS();
                            }, 500);
                        } else {
                            $scope.sendEOD();
                        }
                    } else if (response.status_code == 404) {
                        $scope.sendEOD();
                    }
                    Utility.stopAnimation();
                }, function myError(r) {
                    toastr.error(r.data.message, 'Sorry!');
                    Utility.stopAnimation();
                });
            }
        }
    }

    /*Sonal: SEND EOD CODE */
    // eod.isConfirmFlag=false;
    $scope.sendEOD = function () {
        // if($("#add_miscellaneous_reason_form").valid()){
        var userID = eod.loggedIn_userId;
        var taskListArr = [];
        for (i = 0; i < eod.todayTaskList.length; i++) {
            var obj = {
                "task_id": eod.todayTaskList[i].id,
                "status_id": eod.todayTaskList[i].status_id,
                "todays_spent_time": eod.todayTaskList[i].todays_spent_time,
                "comments": eod.todayTaskList[i].task_comment,
                "todays_total_spent_time": eod.todayTaskList[i].spent_time,
                "lead_id": eod.todayTaskList[i].project_resource.project.lead_id
            };
            taskListArr.push(obj);
        }

        // for(i=0;i<eod.todayTaskList.length;i++){
        //     if(eod.todayTaskList[i].status_id == 'Start'){
        //         eod.isConfirmFlag=true;
        //         eod.startTaskId= eod.todayTaskList[i].id;
        //         eod.taskProjectID = eod.todayTaskList[i].project_resource.project.id;
        //         break;
        //     }
        // }
        /*Sonal:To stop/ Pause task  */
        // if(eod.isConfirmFlag==true){
        //     swal({
        //         // title: "Sure?",
        //         text: "Please Stop/Pause task first.",
        //         type: "warning",
        //         showCancelButton: true,
        //         closeOnConfirm: true,
        //         confirmButtonText: "Yes",
        //         confirmButtonColor: "#3085d6",
        //         cancelButtonColor: '#d33',
        //         cancelButtonText: "No",
        //         animation: false,
        //         customClass: 'animated tada'
        //     }).then(function(isConfirm) {
        //         if (isConfirm) {
        //             window.location.href='/project/task/view/'+eod.taskProjectID+'?id='+eod.startTaskId;
        //          }
        //     }, function(dismiss) {
        //         if (dismiss === 'cancel') {
        //            console.log('gjhgjgh');
        //         }
        //     }).catch(swal.noop);
        // }else{

        // if(eod.eodDate){
        var date = Utility.formatDateToYYMMDD(new Date(), "Y/m/d");
        // }

        var req = {
            "user_id": userID,
            "task_list": taskListArr,
            "date": date,
            "miscellaneous_reason": eod.miscellaneousTimeReason
            // "hrms_time":''
        }
        $('#sendEodButton').attr('disabled', false);
        var promise = services.sendTodaysEOD(req);
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.status_code != 200) {
                toastr.error(result.message);
                $('#sendEodButton').attr('disabled', false);
            }
            else {
                // window.location.href = "/eod/eod_list";
                window.location.href = "https://hrms.syslogyx.com/dashboards";
            }
        }, function myError(r) {
            $('#sendEodButton').attr('disabled', false);
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
        // }
        // }
    }

    eod.closeHRMSBreakModal = function () {
        if ($("#endHRMSBreakForm").valid()) {
            $("#endHRMSBreakModal").modal("hide");
            if ((eod.loginUSerHRMSID != null || eod.loginUSerHRMSID != undefined) && (eod.HrmsUserBreakID != null || eod.HrmsUserBreakID != undefined)) {
                var req = {
                    "id": eod.loginUSerHRMSID,
                    "status": 2,
                    "type": "endTime",
                    "reason": eod.endBreakReason,
                    "ipaddress": eod.ipAddress,
                    "dataId": eod.HrmsUserBreakID
                }

                var promise = services.startOrStopHRMSBreak(req);
                promise.success(function (response) {
                    Utility.stopAnimation();
                    if (response.status_code == 200) {
                        $scope.sendEOD();
                    }
                }, function myError(r) {
                    toastr.error(r.data.message, 'Sorry!');
                    Utility.stopAnimation();
                });
            }
        }
    }

    /*Sonal: Update EOD CODE */
    $scope.updateEOD = function () {
        var userID = eod.taskList[0].task.project_resource.user_id;
        var taskListArr = [];
        for (i = 0; i < eod.taskList.length; i++) {
            if (eod.taskList[i].approval_status == true) {
                approval_status = 1;
            } else {
                approval_status = 0;
            }
            var obj = {
                "id": eod.taskList[i].id,
                "task_id": eod.taskList[i].task_id,
                "status_id": eod.taskList[i].status_id,
                "approval_status": approval_status,
                "comments": eod.taskList[i].task_comment
            };
            taskListArr.push(obj);
        }
        var req = {
            "user_id": userID,
            "status_id": "Approved",
            "task_list": taskListArr
        }
        var promise = services.updateEODofAdmin(eod.eod_id, req);
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.data == null) {
                toastr.success(result.message);
                window.location.href = "/eod/eod_list";
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    $scope.clearModelComments = function () {
        $scope.comments = [];
        eod.init();
    }

    /*Sonal: view EOD Task List Code */
    eod.viewTodaysTaskAndWorkingList = function (currentDateStatus) {
        var date = Utility.formatDateToYYMMDD(new Date());
        var userID = eod.loggedIn_userId;
        if (eod.eodDate) {
            date = Utility.formatDate(eod.eodDate, "Y/m/d");
        }
        var req = {
            "user_id": userID,
            "date": date,
        };
        var promise = services.viewEODTaskAndTimingLog(req);
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.status_code == 200) {
                if (result.data) {
                    eod.todayTaskList = result.data.tasks;
                    // Suvrat Issue#3170
                    for (i = 0; i < (eod.todayTaskList).length; i++) {
                        if (eod.todayTaskList[i].estimated_time) {
                            temp = eod.todayTaskList[i].estimated_time;
                            temp = temp.split(".");
                            temp1 = temp[0];
                            temp2 = temp[1];
                            if (temp2 == undefined) {
                                temp2 = "00";
                            }
                            temp3 = temp1 + ":" + temp2;
                            eod.todayTaskList[i].estimated_time = temp3;
                        }
                    }
                    /////////////////////////
                    eod.todayMeetingList = result.data.meeting_logs;
                    eod.todayBreakList = result.data.break_logs;
                    eod.hrmsWrkgTime = result.data.total_hrms_working_time;
                    eod.taskTodaySpendTime = result.data.task_total_spend_time;
                    eod.meetingTodaySpendTime = result.data.total_meeting_time;
                    eod.todayMiscellaneousTime = result.data.miscellaneous_time;
                    eod.todayMiscellaneousList = result.data.miscellaneous_records;
                    eod.totalMiscTime = result.data.total_updated_EOD_mis_time;
                    eod.remainingMiscTime = result.data.remaining_updated_EOD_mis_time == undefined ? '00:00:00' : result.data.remaining_updated_EOD_mis_time;
                } else {
                    eod.todayTaskList = [];
                    if (currentDateStatus == 1) {
                    } else {
                        toastr.error("No matching results found", 'Sorry!');
                    }
                }
            } else {
                eod.todayTaskList = [];
                eod.todayMeetingList = [];
                eod.todayBreakList = [];
                eod.hrmsWrkgTime = '00:00:00';
                eod.taskTodaySpendTime = '00:00:00';
                eod.meetingTodaySpendTime = '00:00:00';
                eod.todayMiscellaneousTime = '00:00:00';
                eod.remainingMiscTime = '00:00:00';
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
        var promise = services.getAllUsers();
        promise.success(function (result) {
            // Utility.stopAnimation();
            eod.employeList = result.data.data;
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    /*Kalyani Fetch all EOD List CODE */
    eod.fetchListOld = function (page, $source) {
        if (page == -1) {
            eod.pageno = 1;
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        } else {
            eod.pageno = page;
        }
        var requestParam = {
            page: eod.pageno,
            limit: pagination.getpaginationLimit(),
        };
        var date = '';
        if ($scope.can('user.mom.select_employee')) {
            date = Utility.formatDateToYYMMDD(new Date());
        } else {
            if (eod.eodDate == '' || eod.eodDate == null) {
                date = '';
            } else {
                date = Utility.formatDate(eod.eodDate, "Y/m/d");
            }
        }

        var userID = eod.loggedIn_userId;

        if (eod.employee) {
            userID = eod.employee;
        }
        if (eod.eodDate) {
            date = Utility.formatDate(eod.eodDate, "Y/m/d");
        }

        var loggedInUser = services.getIdentity();
        var req = {
            "user_id": userID,
            "date": date,
        };
        if ($source == null) {
            for (var role = 0; role < loggedInUser.identity.role.length; role++) {
                if (loggedInUser.identity.role[role].name == 'Super Admin' || loggedInUser.identity.role[role].name == 'Admin' || loggedInUser.identity.role[role].name == 'Manager') {
                    req.user_id = null;
                    break;
                }
            }
        } else {
            if (eod.employee == '' || eod.employee == null) {
                req.user_id = null;
            }
            if (eod.eodDate == '' || eod.eodDate == null) {
                req.date = null;
            }
        }

        var promise = services.getAllEODs(req, requestParam);
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.data != null) {
                for (var i = 0; i < result.data.data.length; i++) {
                    result.data.data[i].date = Utility.formatDate(result.data.data[i].date);
                }
                eod.allEODs = result.data.data;
                pagination.applyPagination(result.data, eod, $source);
            } else {
                if (req.date == Utility.formatDateToYYMMDD(new Date())) {
                    eod.allEODs = result.data;
                    if (eod.allEODs == null) {
                        if ($source !== null)
                            toastr.error("No matching results found.", 'Sorry!');
                    }
                } else {
                    eod.allEODs = null;
                    if ($source !== null)
                        toastr.error("No matching results found.", 'Sorry!');
                }

            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    /*Kalyani SEND EOD CODE */
    $scope.sendEODold = function () {
        var userID = eod.loggedIn_userId;
        var taskListArr = [];
        for (i = 0; i < eod.todayTaskList.length; i++) {
            var obj = {
                "task_id": eod.todayTaskList[i].id,
                "status_id": eod.todayTaskList[i].status_id,
                "todays_spent_time": eod.todayTaskList[i].todays_spent_time,
                "comments": eod.todayTaskList[i].task_comment
            };
            taskListArr.push(obj);
        }

        // if(eod.eodDate){
        var date = Utility.formatDateToYYMMDD(new Date(), "Y/m/d");
        // }

        var req = {
            "user_id": userID,
            "task_list": taskListArr,
            "date": date
        }

        var promise = services.sendEODofUser(req);
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.data == null) {
                toastr.error(result.message);
            }
            else {
                window.location.href = "/eod/eod_list";
            }

        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    /*Kalyani view EOD Task List Code */
    eod.viewTodaysTaskList = function (currentDateStatus) {
        var date = Utility.formatDateToYYMMDD(new Date());
        var userID = eod.loggedIn_userId;
        if (eod.eodDate) {
            date = Utility.formatDate(eod.eodDate, "Y/m/d");
        }
        var req = {
            "user_id": userID,
            "date": date,
        };
        var promise = services.viewEODTaskListss(req);
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.status_code == 200) {
                if (result.data) {
                    eod.todayTaskList = result.data;
                } else {
                    eod.todayTaskList = [];
                    if (currentDateStatus == 1) {
                    } else {
                        toastr.error("No matching results found", 'Sorry!');
                    }
                }
            } else {
                eod.todayTaskList = [];
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();

        });

        var promise = services.getAllUsers();
        promise.success(function (result) {
            Utility.stopAnimation();
            eod.employeList = result.data.data;
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

});
