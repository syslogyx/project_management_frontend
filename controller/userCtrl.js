app.controller('userCtrl', function ($scope, IGNORE_LIST, $rootScope, AclService, menuService, pagination, services, $cookieStore, $location, RESOURCES, breadcrumbs) {

    $scope.breadcrumbs = breadcrumbs;
    var usc = this;
    $scope.can = AclService.can;
    usc.projectTable = true;
    usc.id = "";
    usc.checkSelect2Plugin = "";
    usc.compStartDate = "";
    usc.compEndDate = "";
    usc.mainTecAddhArrayLength = 0;
    usc.pageno = 0;
    usc.limit = 0;
    usc.userList = [];

    usc.totalEntries = null;
    usc.fromValue = null;
    usc.toValue = null;

    // $rootScope.$emit("menuCtrlMethod",{});
    var loggedInUser = services.getIdentity();

    // var menu=menuService.getResourceMatrixMenu();
    var menu = menuService.getDashboardMenu();
    for (var i = 0; i < menu.length; i++) {
        if (menu[i].menu_name == 'Projects') {
            menu[i].url = '/project/';
            menu[i].child = [];
        }
        if (menu[i].menu_name == 'Users') {
            menu[i].active = 'active';
        } else {
            menu[i].active = 'deactive';
        }
    }
    menuService.setMenu(menu);

    //Array for country options.
    usc.country = [
        { id: "1", name: "India" },
        { id: "2", name: "Pakistan" },
        { id: "3", name: "Usa" },
        { id: "4", name: "Australia" }
    ];

    //Array for language options.
    usc.language = [
        { id: "1", name: "English" },
        { id: "2", name: "Hindi" },
        { id: "3", name: "Marathi" },
        { id: "4", name: "Tamil" }
    ];

    //Array for experience in months drop down options.
    usc.experienceMonths = [
        { id: 0, name: "0 month" },
        { id: 1, name: "1 month" },
        { id: 2, name: "2 months" },
        { id: 3, name: "3 months" },
        { id: 4, name: "4 months" },
        { id: 5, name: "5 months" },
        { id: 6, name: "6 months" },
        { id: 7, name: "7 months" },
        { id: 8, name: "8 months" },
        { id: 9, name: "9 months" },
        { id: 10, name: "10 months" },
        { id: 11, name: "11 months" }
    ];

    //Array for experience in years drop down options.
    usc.experienceYears = [
        { id: 0, name: "0 year" },
        { id: 1, name: "1 year" },
        { id: 2, name: "2 years" },
        { id: 3, name: "3 years" },
        { id: 4, name: "4 years" },
        { id: 5, name: "5 years" },
        { id: 6, name: "6 years" },
        { id: 7, name: "7 years" },
        { id: 8, name: "8 years" },
        { id: 9, name: "9 years" },
        { id: 10, name: "10 years" },
        { id: 11, name: "11 years" },
        { id: 12, name: "12 years" }
    ];

    //Array for staus filter drop down options.
    usc.listStatus = [
        { id: "0", name: "All" },
        { id: "1", name: "Older" },
        { id: "2", name: "Current" }
    ];
    usc.listProjectStatus = usc.listStatus[0]['id'];
    //Array for blood group & maratial status drop down options.
    usc.bloodGroupValue = new Array('A +', 'A -', 'B +', 'B -', 'O +', 'O -', 'AB +', 'AB -');
    usc.maritalStatusValues = new Array('Unmarried', 'Married', 'Divorced', 'Widowed');

    usc.data = {
        emails: [],
        phonenos: [],
        userTechnology: []
    }

    usc.domainTechnologyExperience = [];

    setTimeout(function () {
        $('#table_length').on('change', function () {
            usc.fetchList(-1);
        });
    }, 100);

    usc.fetchList = function (page) {
        usc.limit = $('#table_length').val();
        if (usc.limit == undefined) {
            usc.limit = -1;
        }
        if (page == -1) {
            usc.pageno = 1;
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        } else {
            usc.pageno = page;
        }

        var requestParam = {
            page: usc.pageno,
            // limit:pagination.getpaginationLimit(),
            limit: usc.limit,
        }

        // Getting all the Users name and displaying in table
        var promise = services.getAllUsers(requestParam);
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.data != null) {
                usc.userList = result.data.data;
                usc.totalEntries = result.data.total;
                usc.fromValue = result.data.from;
                usc.toValue = result.data.to;
                pagination.applyPagination(result.data, usc);
            } else {
                usc.userList = [];
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    //Init function for getting data.
    usc.init = function () {
        usc.limit = $('#table_length').val();
        usc.fetchList(-1);
        // usc.limit = pagination.getpaginationLimit();
        // $scope.$root.$broadcast("myEvent", {});
        userId = $location.path().split("/")[3] || "Unknown";
        usc.userIds = userId;

        /* Getting all domains and displaying in domain dropdown*/
        var promise = services.getAllCategory();
        promise.success(function (result) {
            usc.allDomains = result.data.data;
        });

        var promise = services.userWiseDomainList({
            "id": userId
        });
        promise.success(function (result) {
            usc.domains = result.categories;
        });
        applySelect2();
    }

    usc.init();

    //Getting technologies array by passing domain id.
    usc.fetchInfo = function (data, tech) {
        usc.projectTechnologies = [];
        if (usc.projectForm.projectDomain) {
            usc.errDomainTecMessage = "";
            usc.highlightcolordomaintec = "";
        }

        var userId = $location.path().split("/")[3] || "Unknown";

        if (data.id > 0) {
            if (tech == 'Technology') {
                var req = {
                    "id": data.id
                };
                var promise = services.categoryWiseTechnologyList(req);
                promise.success(function (result) {
                    result.categories_technology_mappings = result.data.data;
                    var mainTechArray = [];
                    result.categories_technology_mappings = result.data.data;
                    if (result.categories_technology_mappings) {
                        for ($i = 0; $i < result.categories_technology_mappings.length; $i++) {
                            if (result.categories_technology_mappings[$i]['technology']['id']) {
                                var techArray = [];
                                techArray['id'] = result.categories_technology_mappings[$i]['technology']['id'];
                                techArray['name'] = result.categories_technology_mappings[$i]['technology']['name'];
                            }
                            mainTechArray.push(techArray);
                        }
                    }
                    Utility.stopAnimation();
                    usc.projectTechnologies = mainTechArray;
                }, function myError(r) {
                    toastr.error(r.data.message, 'Sorry!');
                    //Utility.stopAnimation();
                });
            } else {
                var req = {
                    "id": userId,
                    "domain_id": data.id
                };
                var promise = services.domainWiseTechnologyList(req);
                promise.success(function (result) {
                    var mainTechArray = [];
                    if (result.user_technology_mappings) {
                        for ($i = 0; $i < result.user_technology_mappings.length; $i++) {
                            if (result.user_technology_mappings[$i]['technology']['id']) {
                                var techArray = [];
                                techArray['id'] = result.user_technology_mappings[$i]['technology']['id'];
                                techArray['name'] = result.user_technology_mappings[$i]['technology']['name'];
                            }
                            mainTechArray.push(techArray);
                        }
                    }
                    Utility.stopAnimation();
                    usc.projectTechnologies = mainTechArray;
                }, function myError(r) {
                    toastr.error(r.data.message, 'Sorry!');
                    //Utility.stopAnimation();
                });
            }
        }
    }

    //getting data from technology section and pushing into array.
    usc.projectForm = {};
    usc.projectDomainTechnologyDurationArray = [];
    usc.addMoreProjectTechnologyExperirence = function () {
        usc.projectForm.removeParam = "add";
        if ((usc.projectForm.projectDomain)) {
            usc.projectDomainTechnologyDurationArray.push(usc.projectForm);
        }

        usc.projectForm = {};
        usc.projectTechnologies = {};
        usc.projectForm.duration_start_months = usc.prevCompForm.duration_S_months;
        usc.projectForm.duration_end_months = usc.prevCompForm.duration_E_months;
        //usc.addMoreProjectTechnologyExperirence();
        applySelect2();
        usc.domainTechnologyExperience = usc.projectDomainTechnologyDurationArray;
        if (usc.addEdit != 'Add') {
            if (usc.id) {
                var userId = $location.path().split("/")[3] || "Unknown";
                var domainData = usc.getDomainwithTechnologyArray(usc.projectDomainTechnologyDurationArray);
                var req = {};

                var sdate = Utility.formatDate($("#tecExpStartMY").val(), "Y/m/d");
                var edate = Utility.formatDate($("#tecExpEndMY").val(), "Y/m/d");
                req = {
                    "domain_id": domainData[0].id,
                    "technology": [{
                        "id": domainData[0].technology[0],
                        "start_date": sdate,
                        "due_date": edate
                    }],
                    "project_id": usc.id,
                    "user_id": userId,
                    "start_date": sdate,
                    "end_date": edate,
                    "type": "old"
                };

                // for (i = 0; i < domainData[0].technology.length; i++) {
                //     techArray = {}
                //     techArray.id = domainData[0].technology[i];
                //     req.technology = [];
                //     req.technology.push(techArray);
                // }
                var promise = services.saveUserDomainTechnology(req);
                promise.then(function mySuccess(response) {
                    usc.getProjectById(usc.id);
                    domainData = [];
                    usc.projectDomainTechnologyDurationArray = [];
                    usc.domainTechnologyExperience = [];

                    //$('#tecExpStartMY').val(usc.companySDate);
                    //$('#tecExpEndMY').val(usc.companyEDate);
                    //usc.projectForm.duration_start_months = sdate;
                    //usc.projectForm.duration_end_months = edate;
                    if (response.data.data) {
                        toastr.success("Added Successfully!!");
                        // usc.checkSelect2Plugin = 0;
                        usc.showAddDomainTechnologyTab();
                        // usc.projectForm = {};

                    } else {
                        toastr.error(response.data.message);
                    }
                    Utility.stopAnimation();
                }, function myError(response) {
                    Utility.stopAnimation();
                    toastr.error(response.data.message);
                });
            }
        }
        else {
        }
        usc.checkIfDomainExistOrNot();
    }

    usc.checkIfDomainExistOrNot = function () {
        var result = usc.checkDuplicationDomain(usc.domainTechnologyExperience);
        if (usc.uniqueDomain) {
            toastr.error("Domain duplication not allowed !!");
            usc.domainTechnologyExperience.splice(-1, 1);
            return false;
        } else {
            usc.checkValidation = "";
            return true;
        }
    }

    //method to check duplication for technology in domain
    usc.checkDuplication = function (values) {
        var valueArr = values.map(function (item) {
            return item.projectTechnology.id
        });
        var isDuplicate = valueArr.some(function (item, idx) {
            if (valueArr.indexOf(item) != idx) {
                usc.uniqueDomain = true;
            } else {
                usc.uniqueDomain = false;
            }
        });
    }

    //function to check duplication for domain only
    usc.checkDuplicationDomain = function (values) {
        var valueArr = values.map(function (item) {
            return item.projectDomain.id
        });
        var isDuplicate = valueArr.some(function (item, idx) {
            if (valueArr.indexOf(item) != idx) {
                usc.checkDuplication(values);
            } else {
                usc.uniqueDomain = false;
            }
        });
    }

    //Function to remove individual technology from table.
    usc.removeTableTech = function (domainId, techId) {
        if (usc.domainTechnologyExperience[domainId].projectTechnology.length < 2) {
            usc.domainTechnologyExperience = pjc.domainTechnologyExperience.splice(domainId, 1);
        } else {
            usc.domainTechnologyExperience = usc.domainTechnologyExperience[domainId].projectTechnology.splice(techId, 1);
        }
        usc.addMoreProjectTechnologyExperirence();
    }

    usc.isDataExixst = false;

    //method will be called when we click into add new user button .
    usc.addNewUser = function () {
        window.location.href = "/user/add";
    }

    //Fetching all technology for displaying dropdown of tchnology
    usc.tech = function () {
        var promise = services.getAllTechnology();
        promise.success(function (result) {
            usc.technologies = result.data.data;
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }
    usc.tech();

    //Method for synch user details from hrms database.
    usc.syncNewUsers = function () {
        var promise = services.hitSyncCall();
        promise.success(function (result) {
            usc.getUserwithId();
            Utility.stopAnimation();
            $location.url('/user', false);
            if (result.message == "Something went wrong...!!") {
                toastr.error(result.message);
            } else {
                toastr.success(result.message);
            }
            usc.fetchList(-1);
        }, function myError(r) {
            toastr.error(r.message);
            Utility.stopAnimation();
        });
    }

    //Method for synch user details by id from hrms database.
    usc.syncByUsersId = function () {
        var userId = usc.data.userInfo.user_id;
        var promise = services.hitSyncByIdCall(userId);
        promise.success(function (result) {
            usc.isDataExixst = false;
            usc.getUserwithId();
            Utility.stopAnimation();
            toastr.success(result.message);
        }, function myError(r) {
            toastr.error(r.message);
            Utility.stopAnimation();
        });
    }

    //getting data from technology section and pushing into array.
    usc.technologyForm = {};
    usc.technologyDurationArray = [];
    usc.addMoreTechnologyExperirence = function () {
        if (usc.technologyForm.technology_id) {
            usc.tempDataArray = {};
            usc.tempDataArray = {
                "domain_id": usc.technologyForm.projectDomain.id,
                "technology_id": usc.technologyForm.technology_id
            };
            usc.technologyForm.projectDomain.id = "";
            usc.technologyForm.technology_id = "";
            usc.technologyDurationArray.push(usc.tempDataArray);
            usc.technologyForm = {};
            usc.tempDataArray = {};
        }
        var req = {};
        req = {
            "user_id": usc.userId,
            "userTechnology": usc.technologyDurationArray,
        };
        var promise = services.saveUserTechnology(req);
        promise.then(function mySuccess(response) {
            usc.getUserwithId();
            Utility.stopAnimation();
            usc.init();
            if (response.data.data.updated == "true") {
                toastr.error("Domain with this technology already exists.");
            } else {
                toastr.success("Added Successfully ...");
            }
            usc.projectTechnologies = [];
            usc.technologyDurationArray = [];
        }, function myError(response) {
            usc.getUserwithId();
            Utility.stopAnimation();
            toastr.error("Unsuccessful..");
            usc.technologyDurationArray = [];
        });
    }

    //method will be called when deleting domain technology data while adding a project.
    usc.removeRowPageTableAdd = function (idx, type) {
        if (type == "add") {
            usc.domainTechnologyExperience.splice(idx, 1);
            //usc.addMoreProjectTechnologyExperirence();
        }
    };

    //method will be called when deleting domain technology data while editing a project.
    usc.removeRowPageTableEdit = function (projectId, projectCategoryId, technologyId) {
        var req = {
            "project_category_id": projectCategoryId,
            "technology_id": technologyId,
            "user_id": usc.userId
        };
        swal({
            title: "Sure?",
            text: "Delete this Domain and their associated Technologies?",
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
            var promise = services.deleteIndividualTechnology(req);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                if (response.data) {
                    if (response.data.message == "Record Deleted Successfully...!!") {
                        usc.getProjectById(projectId);
                        toastr.success(response.data.message);
                    } else {
                        toastr.error(response.data.message);
                    }
                } else {
                    toastr.error(response.data.message);
                }

            }, function myError(response) {
                Utility.stopAnimation();
                toastr.error(response.data.message);
            });
        }).catch(swal.noop);

    }

    //Method will be called when editing technology data.
    usc.editTech = function (data) {
        usc.temp = 1;
        usc.technologyForm.id = data.id;
        usc.technologyForm.user_id = data.user_id;
        usc.technologyForm.technology_id = data.technology_id;
        usc.technologyForm.duration_years = data.duration_years;
        usc.technologyForm.duration_months = data.duration_months;
        usc.editTechArray = [];
        usc.editTechArray.push(usc.technologyForm);
    }

    //Method will be called when final update is performed from table.
    usc.update = function () {
        usc.temp = 0;
        var req = {
            "id": usc.editTechArray[0].id,
            "user_id": usc.editTechArray[0].user_id,
            "technology_id": usc.editTechArray[0].technology_id,
            "duration_months": usc.editTechArray[0].duration_months,
            "duration_years": usc.editTechArray[0].duration_years
        };

        var promise = services.updateUserTechnology(req);
        promise.then(function mySuccess(response) {
            Utility.stopAnimation();
            usc.technologyForm = {};
            toastr.success("Updated successfully...");
            usc.getUserwithId();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();

        });
    }

    var userId = $location.path().split("/")[3] || "Unknown";
    if (userId == "Unknown") {
        usc.userId = loggedInUser.id;
    } else {
        usc.userId = userId;
    }

    var currentPath = $location.path();

    //Fetching all users with it's specific id and getting its user_technology_mapping data.
    usc.getUserwithId = function () {
        if (currentPath == "/user" || currentPath == "/dashboard-users") {
            // Getting all the Users name and displaying in table
            var promise = services.getAllUsers();
            promise.success(function (result) {
                Utility.stopAnimation();
                usc.userList = result.data.data;
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });

        } else {
            var promise = services.getUserById(usc.userId);
            promise.success(function (result) {
                usc.data.userTechnology = [];
                usc.data.userInfo = result.data;
                usc.userProjectList = result.data.project;
                usc.data.userTechnology = result.data.userTechnologyMapping;
                usc.userTechnologyList = result.data.technology;
                usc.userDomainList = result.data.domains;
                // usc.userDomainTechnology =[];
                // var techExpArray=[];
                // for(var i=0; i<usc.data.userTechnology.length;i++){
                //         var j = i+1;
                //         if(usc.data.userTechnology[i].domain_id == usc.data.userTechnology[j].domain_id)
                //         {
                //             techExpArray.push({
                //             "tech_id": usc.data.userTechnology[j].technology_id,
                //             "techExperience": usc.data.userTechnology[j].duration
                //             });
                //             usc.userDomainTechnology.push({
                //             "domain_id"  : usc.data.userTechnology[i].domain_id,
                //             "technology" : techExpArray
                //             });
                //         }
                //         else
                //         {
                //             techExpArray.push({
                //             "tech_id": usc.data.userTechnology[i].technology_id,
                //             "techExperience": usc.data.userTechnology[i].duration
                //             });

                //             usc.userDomainTechnology.push({
                //             "domain_id"  : usc.data.userTechnology[i].domain_id,
                //             "technology" : techExpArray
                //             });
                //         }
                // }

                // usc.domain_index =[];
                // usc.userDomainTechnology =[];
                // var techExpArray=[];
                // for(var i=0;i < usc.data.userTechnology.length;i++){
                //     if(i == 0)
                //     {
                //         techExpArray.push({
                //             "tech_id": usc.data.userTechnology[i].technology_id,
                //             "techExperience": usc.data.userTechnology[i].duration
                //         });

                //         usc.userDomainTechnology.push({
                //             "domain_id"  : usc.data.userTechnology[i].domain_id,
                //             "technology" : techExpArray
                //         });
                //         usc.domain_index = {
                //             "domain_id" : usc.data.userTechnology[i].domain_id,
                //             "index" : i
                //         };

                //     }else{
                //         console.log("gdhfjhb");
                //         if(usc.domain_index.domain_id){
                //             techExpArray.push({
                //                 "tech_id": usc.data.userTechnology[i].technology_id,
                //                 "techExperience": usc.data.userTechnology[i].duration
                //             });
                //             usc.userDomainTechnology.push({
                //                 "technology" : techExpArray
                //             });
                //         }
                //         else{
                //             techExpArray.push({
                //                 "tech_id": usc.data.userTechnology[i].technology_id,
                //                 "techExperience": usc.data.userTechnology[i].duration
                //             });

                //             usc.userDomainTechnology.push({
                //                 "domain_id"  : usc.data.userTechnology[i].domain_id,
                //                 "technology" : techExpArray
                //             });
                //             usc.domain_index = {
                //                 "domain_id" : usc.data.userTechnology[i].domain_id,
                //                 "index" : i
                //             };
                //         }
                //     }
                // }
                usc.getUserProjectData('0');
                setTimeout(function () {
                    usc.getUserInfoFromHRMS();
                }, 1000);
                //                Utility.stopAnimation();
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }
    // usc.getUserwithId();

    usc.viewMore = function (data) {
        window.location.href = "/user/info/" + data.id;
    }

    usc.getUserInfoFromHRMS = function () {
        $("html, body").animate({ scrollTop: 0 }, "fast");
        if (usc.isDataExixst == false) {
            var userId = usc.data.userInfo.user_id;
            if (userId != "") {
                var promise = services.getUserInfoFromHRMS(userId);
                promise.success(function (result) {
                    usc.isDataExixst = true;
                    usc.data.hrmsUserInfo = result.data[0];
                    var aadhar_number = usc.data.hrmsUserInfo.aadhar_number;
                    usc.data.hrmsUserInfo.aadhar_number = Utility.formatAadharNumber(aadhar_number);

                    var mobile_number = usc.data.hrmsUserInfo.mobile_number;
                    if (mobile_number == "") {
                        usc.data.hrmsUserInfo.mobile_number = "-";
                    } else {
                        usc.data.hrmsUserInfo.mobile_number = Utility.formatPhoneNumber(mobile_number);
                        usc.data.hrmsUserInfo.mobile_number = usc.data.hrmsUserInfo.mobile_number.join("-");
                    }

                    var alternate_contact_number = usc.data.hrmsUserInfo.alternate_contact_number;
                    if (alternate_contact_number == "") {
                        usc.data.hrmsUserInfo.alternate_contact_number = "-";
                    } else {
                        if (alternate_contact_number.length == 11) {
                            usc.data.hrmsUserInfo.alternate_contact_number = Utility.formatLandlineNumber(alternate_contact_number);
                            usc.data.hrmsUserInfo.alternate_contact_number = usc.data.hrmsUserInfo.alternate_contact_number.join("-");
                        } else {
                            usc.data.hrmsUserInfo.alternate_contact_number = Utility.formatPhoneNumber(alternate_contact_number);
                            usc.data.hrmsUserInfo.alternate_contact_number = usc.data.hrmsUserInfo.alternate_contact_number.join("-");
                        }

                    }

                    var emergency_contact = usc.data.hrmsUserInfo.emergency_contact;
                    if (emergency_contact == "") {
                        usc.data.hrmsUserInfo.emergency_contact = "-";
                    } else {
                        usc.data.hrmsUserInfo.emergency_contact = Utility.formatPhoneNumber(emergency_contact);
                        usc.data.hrmsUserInfo.emergency_contact = usc.data.hrmsUserInfo.emergency_contact.join("-");
                    }

                    var date_of_birth = usc.data.hrmsUserInfo.date_of_birth;
                    if (date_of_birth == "") {
                        usc.data.hrmsUserInfo.date_of_birth = "-";
                    } else {
                        usc.data.hrmsUserInfo.date_of_birth = Utility.descriptiveFormatOfDate(date_of_birth);
                    }

                    /* Getting all companies from HRMS */
                    var promise = services.getUserCompanyInfoFromHRMS(userId);
                    promise.success(function (result) {
                        usc.companies = result.data;
                        if (usc.companies) {
                            if (usc.companies.length > 0) {
                                for (var i = 0; i < usc.companies.length; i++) {
                                    usc.companies[i].selected = {};
                                }
                            }
                        }
                    });

                    Utility.stopAnimation();
                }, function myError(r) {
                    toastr.error(r.data.message, 'Sorry!');
                    Utility.stopAnimation();
                });
            } else {
                // toastr.error("Invalid User...!!");
            }
        } else {

        }
    }

    usc.getUserRoles = function () {
        $("html, body").animate({ scrollTop: 0 }, "fast");
        var promise = services.getUserRoles(usc.userId);
        promise.success(function (result) {
            Utility.stopAnimation();
            usc.userRoles = result.user.roles;
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    usc.getAllRoles = function () {
        var promise = services.getAllRoles();
        promise.success(function (result) {
            if (result.status_code == 200) {
                $("#addRoleModal").modal("toggle");
                setTimeout(function () {
                    setCSS();
                }, 500);
                usc.allRoles = result.data.data;
                usc.unsignedRoles = prepareUnassignedPermissionList(usc.allRoles);
            }
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    var prepareUnassignedPermissionList = function (data) {
        var res = [];
        angular.forEach(data, function (pv, pk) {
            var check = isPermissionAssigned(pv.id);
            if (check !== true) {
                pv.isSelected = false;
                res.push(pv);
            }
        })
        return res;
    }

    var isPermissionAssigned = function (roleId) {
        dataArray = usc.userRoles;
        for (i = 0; i < dataArray.length; i++) {
            if (dataArray[i]["id"] == roleId) {
                return true;
            }
        }
        return false;
    }

    usc.attachRoleToUser = function () {
        if ($("#caddRoleForm").valid()) {
            var role_name = $("#roleId").val();
            var promise = services.attachRolesToUser(usc.userId, role_name);
            promise.success(function (result) {
                usc.getUserRoles();
                Utility.stopAnimation();
                $("#addRoleModal").modal("toggle");
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    usc.deleteRole = function (role_id) {
        swal.queue([{
            title: 'Sure?',
            confirmButtonText: 'Yes',
            showCancelButton: true,
            text: 'You want to revoke this role?',
            showLoaderOnConfirm: true,
            cancelButtonColor: 'rgb(221, 51, 51)',
            preConfirm: function () {
                return new Promise(function (resolve) {
                    var promise = services.detachRoleFromUser(usc.userId, role_id);
                    promise.success(function (result) {
                        Utility.stopAnimation();
                        toastr.success(result.message);
                        usc.getUserRoles();
                        resolve();
                    }, function myError(r) {
                        toastr.error(r.data.message, 'Sorry!');
                        Utility.stopAnimation();
                    });
                })
            }
        }])
    }

    $scope.setData = 0;
    usc.setTabData = function () {
        $("html, body").animate({ scrollTop: 0 }, "fast");
        usc.domainTechnologyExperience = [];
        usc.projectDomainTechnologyDurationArray = [];
        if ($scope.setData === 0) {
            usc.technologyTabVisibility = false;
            usc.showDomainTechnologyTab = false;
            usc.projectTable = true;
            load_data();
            applySelect2();
            $scope.setData = 1;
        }
        usc.highlightcolordomaintec = "";
        usc.errDomainTecMessage = "";
        usc.id = "";
        usc.projectForm = {};
    }

    usc.getUserProjectData = function (tyId) {
        usc.technologyTabVisibility = false;
        usc.showDomainTechnologyTab = false;
        usc.projectTable = true;
        var req = {
            "uId": usc.userId,
            "typeId": tyId
        };

        var promise = services.getUserProjectList(req);
        promise.success(function (result) {
            usc.userProjectLists = result.data;
            $scope.setData = 0;
            usc.setTabData();
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
        applySelect2();
    }

    usc.getUserProjectDataForPArticularUser = function (userId, tyId) {
        var req = {
            "uId": userId,
            "typeId": tyId
        };

        var promise = services.getUserProjectList(req);
        promise.success(function (result) {
            usc.userProjectListsData = result.data;
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
        applySelect2();
    }

    usc.editPreviousCompany = function (pId) {
        $("html, body").animate({ scrollTop: 0 }, "fast");
        usc.pId = pId;
        setTimeout(function () {
            // applyPlugins();
            applySelect2();
            initialiseCKEditor();

        }, 500);
        usc.highlightcolordomaintec = "";
        usc.errDomainTecMessage = "";
        usc.showBackbtn = true;
        usc.editPageVisibility = true;
        usc.technologyTabVisibility = true;
        usc.showDomainTechnologyTab = false;
        usc.projectTable = false;

        usc.prevCompForm = {};
        usc.addEdit = "Edit";
        usc.id = pId;

        if (pId > 0) {

            usc.prevCompForm.organisationName = {};
            var promise = services.getProject(pId);
            promise.then(function mySuccess(response) {
                // var startDate = usc.formateDateInMY(response.data.data.start_date);
                // var endDate = usc.formateDateInMY(response.data.data.due_date);
                var startDate = Utility.formatDate(response.data.data.start_date);
                var endDate = Utility.formatDate(response.data.data.due_date);
                /*  dates for storing in edit domain tech date*/
                for (var i = 0; i < usc.companies.length; i++) {
                    if (usc.companies[i].id == response.data.data.company_id) {
                        usc.companies[i].selected = {
                            id: response.data.data.company_id
                        };
                        // setTimeout(function () {
                        //     $('#organisationName').change();
                        // }, 200);
                        setTimeout(function () {
                            usc.companySDate = Utility.formatDate(response.data.data.company_start_date);;
                            usc.companyEDate = Utility.formatDate(response.data.data.company_due_date);;
                            // $('#endExperienceMonths').datepicker('setDate', endDate);
                            // $('#startExperienceMonths').datepicker('setDate', startDate);
                            $('#startExperienceMonths').datepicker('setDate', startDate).datepicker('setStartDate', usc.companySDate).datepicker('setEndDate', usc.companyEDate);
                            $('#endExperienceMonths').datepicker('setDate', endDate).datepicker('setStartDate', usc.companySDate).datepicker('setEndDate', usc.companyEDate);
                            //                            $("#duration").val(response.data.data.duration_in_years);
                            usc.prevCompForm.duration = response.data.data.duration_in_years;
                            // setCompData();
                        }, 1000);
                    }
                }

                usc.prevCompForm.projectName = response.data.data.name;
                usc.prevCompForm.organisationName.companyName = response.data.data.company_name;
                usc.prevCompForm.organisationName.id = response.data.data.company_id;
                usc.prevCompForm.projectRole = response.data.data.role;
                usc.prevCompForm.duration_S_months = startDate;
                usc.prevCompForm.duration_E_months = endDate;
                usc.prevCompForm.duration = response.data.data.duration_in_years;
                usc.prevCompForm.description = response.data.data.description;
                usc.domainTechnologyExperience = usc.getProjectDomainList(response.data.data.domain);
                Utility.stopAnimation();
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    //Method for formatting date in month & year.
    usc.formateDateInMY = function (date) {
        var dateObj = new Date(date);
        var month = ("0" + (dateObj.getMonth() + 1)).slice(-2); //months from 1-12
        var day = dateObj.getDate();
        var year = dateObj.getFullYear();
        return newdate = month + "/" + year;
    }

    //Method for formatting date domain & technology array at the time of edit.
    usc.getProjectDomainList = function (data) {
        if (data) {
            var mainTecAddhArray = [];
            var technologiesArr = data;
            for ($i = 0; $i < technologiesArr.length; $i++) {
                var techArray = {};
                if (technologiesArr[$i]['id']) {
                    techArray["projectDomain"] = technologiesArr[$i];
                }
                techArray["projectTechnology"] = technologiesArr[$i]['technology'];
                mainTecAddhArray.push(techArray);
            }

            if (mainTecAddhArray.length == 1) {
                if (mainTecAddhArray[0]["projectTechnology"].length == 1) {
                    usc.mainTecAddhArrayLength = 1;
                }
            }
            return mainTecAddhArray;
        }
    }

    //Method for button add previous company details.
    usc.addPreviousCompany = function () {
        usc.checkValidation = false;
        usc.domainTechnologyExperience = [];
        usc.projectDomainTechnologyDurationArray = [];
        usc.technologyTabVisibility = true;
        usc.showDomainTechnologyTab = true;
        usc.projectTable = false;
        usc.prevCompForm = {};
        usc.addEdit = "Add";

        usc.compStartDate = '';
        usc.compEndDate = '';
        $("#duration").val("");

        setTimeout(function () {
            applyPlugins();
            applySelect2();
        }, 700);
        $scope.setData = 0;
    }

    /*//getting data from technology section and pushing into array
     usc.projectForm = {};
     usc.technologyDomainArray = [];
     usc.addMoreDomainTechnologyForUser = function () {
     if ((usc.projectForm.projectDomain)) {
     usc.technologyDomainArray.push(usc.projectForm);
     }
     usc.projectForm = {};
     applySelect2();
     usc.domainTechnology =  usc.technologyDomainArray;
     }*/

    usc.savePreviousProject = function () {
        if ((usc.domainTechnologyExperience.length) == 0) {
            usc.errDomainTecMessage = 'Please select atleast one domain & their technology';
            usc.highlightcolordomaintec = "#dd4b39";
        } else {
            usc.highlightcolordomaintec = "";
        }

        if ($("#previousCompanyForm").valid() && usc.checkIfDomainExistOrNot() && usc.domainTechnologyExperience.length > 0) {
            // var prjStartDate = '01/' + usc.prevCompForm.duration_S_months;
            // var prjEndDate = '30/' + usc.prevCompForm.duration_E_months;

            var prjStartDate = usc.prevCompForm.duration_S_months;
            var prjEndDate = usc.prevCompForm.duration_E_months;
            var startDate = Utility.formatDate(prjStartDate, "Y/m/d");
            var endDate = Utility.formatDate(prjEndDate, "Y/m/d");
            var sdate = $("#companyStartDate").val();
            var edate = $("#companyEndDate").val();
            var companyStartDate = sdate;
            var companyEndDate = edate;

            var desc = CKEDITOR.instances.description.getData();
            var userId = $location.path().split("/")[3] || "Unknown";

            if (usc.domainTechnologyExperience.length > 0 && !usc.id) {
                var domainData = usc.getDomainwithTechnologyArrayForAdd(usc.domainTechnologyExperience);
            }

            var duration = usc.getDuration(startDate, endDate);
            var req = {
                "project_type": "old",
                "name": usc.prevCompForm.projectName,
                "user_id": userId,
                "status_id": "",
                "client_id": "",
                "start_date": startDate,
                "due_date": endDate,
                "revised_date": "",
                "duration_in_days": "",
                "description": desc,
                "current_milestone_index": "",
                "company_name": usc.prevCompForm.organisationName.companyName,
                "company_id": usc.prevCompForm.organisationName.id,
                "company_start_date": companyStartDate,
                "company_due_date": companyEndDate,
                "role": usc.prevCompForm.projectRole,
                "type": "1",
                //                "duration_in_years": duration,
                "domain": domainData
            };

            if (usc.id) {
                delete req["domain"];
                req.id = usc.id;
                var forToasterTemp = false;
                req["updated_by"] = loggedInUser.id;
                var promise = services.updateProject(req);
                var operationMessage = " updated ";
            } else {
                forToasterTemp = true;
                req["created_by"] = loggedInUser.id;
                req["updated_by"] = loggedInUser.id;
                var promise = services.saveProject(req);
                operationMessage = " created ";
            }

            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    usc.getUserProjectData('0');
                    usc.projectTable = true;
                    usc.domainTechnologyExperience = [];
                    usc.showBackbtn = false;
                    toastr.success('Project' + operationMessage + 'successfully..');
                    usc.editPageVisibility = false;
                    usc.id = "";
                } catch (e) {
                    toastr.error("Unable to save project..");
                    Raven.captureException(e)
                }
            }, function myError(r) {
                //                toastr.error(r.data.message);
                toastr.error(r.data.errors.name);
                Utility.stopAnimation();
            });
        }
    }

    //Fetching all users with it's specific id and getting its user_technology_mapping data.
    usc.getDomainwithTechnologyArrayForAdd = function (data) {
        //        var groups = {};
        var groups = [];
        var repeat = null;
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < groups.length; j++) {

                if (groups[j].id == data[i].projectDomain.id) {
                    repeat = j;
                }

            }

            var json = {};
            json.id = data[i].projectDomain.id;

            //            json.startDate = data[i].duration_start_months;
            //            json.endDate = data[i].duration_end_months;


            techArray = {}
            techArray.id = data[i].projectTechnology.id;
            techArray.start_date = Utility.formatDate(data[i].duration_start_months, "Y/m/d");
            techArray.due_date = Utility.formatDate(data[i].duration_end_months, "Y/m/d");
            json.technology = [];
            json.technology.push(techArray);

            if (repeat != null) {
                groups[repeat].technology.push(techArray);
            } else {

                //            var groupName = data[i].projectDomain.id;
                ////            var sDate = data[i].duration_start_months;
                ////            var eDate = data[i].duration_end_months;
                //            if (!groups[groupName]) {
                //                groups[groupName] = [];
                ////                groups[groupName][sDate] = [];
                ////                groups[groupName][eDate] = [];
                //            }
                //            groups[groupName].push(data[i].projectTechnology.id);
                //            groups[groupName][sDate] = (data[i].duration_start_months);
                //            groups[groupName][eDate] = (data[i].duration_end_months);
                groups.push(json);
            }
        }
        //        data = [];
        //        for (var groupName in groups) {
        ////            data.push({id: groupName, technology: groups[groupName], start_date: groups[groupName][sDate], end_date: groups[groupName][eDate]});
        //            data.push({id: groupName, technology: groups[groupName]});
        //        }
        //        for (i=0; i<groups.length; i++) {
        //            if(i==0){
        //                data.push(groups[i]);
        //            }else{
        //                if(data){
        //
        //                }
        //            }
        //            data.push({id: groupName, technology: groups[groupName], start_date: groups[groupName][sDate], end_date: groups[groupName][eDate]});
        //            data.push({id: groupName, technology: groups[groupName]});
        //        }
        return groups;

    }

    usc.getDomainwithTechnologyArray = function (data) {
        if (data) {
            var mainTecAddhArray = [];
            var technologiesArr = data;
            var previousDomainId = '';
            for ($i = 0; $i < technologiesArr.length; $i++) {
                var techArray = {};
                if (technologiesArr[$i]['projectDomain']['id']) {
                    var id = technologiesArr[$i]['projectDomain']['id'];
                    techArray["id"] = id;
                }
                var technology = technologiesArr[$i]['projectTechnology'];
                if (technology) {

                    var techIds = [];
                    techIds.push(technology['id']);
                    techArray["technology"] = techIds;
                    //                    techArray["tech_start_date"] = technologiesArr[$i]["duration_start_months"];
                    //                    techArray["tech_end_date"] = technologiesArr[$i]["duration_end_months"];
                }
                mainTecAddhArray.push(techArray);
            }
            return mainTecAddhArray;
        }
    }

    usc.cancelPreviousProject = function () {
        usc.domainTechnologyExperience = "";
        usc.projectDomainTechnologyDurationArray = [];
        usc.domainTechnologyExperience = [];
        usc.projectTable = true;
        $scope.setData = 0;
        usc.setTabData();
        usc.prevCompForm = {};
        usc.errDomainTecMessage = "";
        usc.highlightcolordomaintec = "";
        usc.projectForm = {};
        usc.compStartDate = "";
        usc.compEndDate = "";
    }

    //Method for calculating duration at the time of add details of project in user.
    usc.calculateDateDuration = function () {
        // var startDate = $('#startExperienceMonths').val();
        // var endDate = $('#endExperienceMonths').val();

        var startDate = usc.prevCompForm.duration_S_months;
        var endDate = usc.prevCompForm.duration_E_months;

        if (startDate != "" && endDate != "") {

            var validator = $("#previousCompanyForm").validate();
            validator.element("#startExperienceMonths");
            validator.element("#endExperienceMonths");

            // var sDate = "01/" + usc.prevCompForm.duration_S_months;
            // var eDate = "30/" + usc.prevCompForm.duration_E_months;

            var sDate = usc.prevCompForm.duration_S_months;
            var eDate = usc.prevCompForm.duration_E_months;
            var duration = usc.getDuration(sDate, eDate);
            //            usc.prevCompForm.duration = duration;
            var years = duration.split(".")[0];
            var month = duration.split(".")[1];
            var days = duration.split(".")[2];
            usc.prevCompForm.duration = ((years > 0) ? years + ' Year' + (years > 1 ? 's' : '') + ' ' : '') + ((month > 0) ? month + ' Month' + (month > 1 ? 's' : '') + ' ' : '') + ((days > 0) ? days + ' Day' + (days > 1 ? 's' : '') : '');
            // usc.prevCompForm.duration = (duration.split(".")[0] + " years " + duration.split(".")[1] + " months " + duration.split(".")[2] + " days");
        }
    }

    //Method for calculating duration at the time of add domain technology experience for project in user.
    usc.calculateDomainTechDateDuration = function () {

        var startDate = $('#tecExpStartMY').val();
        var endDate = $('#tecExpEndMY').val();

        if (startDate != "" && endDate != "") {
            // var sDate = "01/" + usc.projectForm.duration_start_months;
            // var eDate = "30/" + usc.projectForm.duration_end_months;

            var sDate = usc.projectForm.duration_start_months;
            var eDate = usc.projectForm.duration_end_months;

            var duration = usc.getDuration(sDate, eDate);
            // var years = duration.split(".")[0];
            // var month = duration.split(".")[1];
            // var days = duration.split(".")[2];
            // usc.projectForm.duration =  ((years > 0) ? years + ' Year' + (years > 1 ? 's' : '') + ' ' : '') + ((month > 0) ? month + ' Month' + (month > 1 ? 's' : '') + ' ' : '') + ((days > 0) ? days + ' Day' + (days > 1 ? 's' : '') : '');
            usc.projectForm.duration = duration;

            usc.errMessage2 = '';
            if (typeof (duration) == "undefined") {
                usc.errMessage2 = 'End Date should be greater than start date';
                usc.highlightcolor2 = "#dd4b39";
                usc.temp = 1;
                // return false;
            } else {
                usc.highlightcolor2 = "";
                usc.temp = 0;
                // return true;
            }
        }
    }

    //Calculate duration in years by passing start & end date.
    usc.getDuration = function (sDate, eDate) {

        var startDate = Utility.formatDate(sDate, "Y/m/d");
        var endDate = Utility.formatDate(eDate, "Y/m/d");

        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var d1 = new Date(startDate);
        var d2 = new Date(endDate);

        var diffDays = Math.round(Math.abs((d1.getTime() - d2.getTime()) / (oneDay)));

        //var convert = diffDays + 1;
        var convert = diffDays;

        var years = (convert / 365.2525); // days / 365 days
        years = Math.floor(years); // Remove all decimals

        var month = (convert - (years * 365.2525)) / 30.5;
        month = Math.floor(month); // Remove all decimals

        var days = (convert - (years * 365.2525) - (month * 30.5));
        days = Math.floor(days); // Remove all decimals
        // if (days >= 20) {
        //     month = month + 1;
        // }
        // if (month == 12) {
        //     month = 0;
        //     years = years + 1;
        // }
        var result = years + '.' + month + '.' + days;
        return result;

    }

    //Method for back button from edit project section.
    usc.editBack = function () {
        usc.technologyTabVisibility = false;
        usc.showDomainTechnologyTab = false;
        usc.editPageVisibility = false;
        usc.getUserProjectData('0');
        usc.showBackbtn = false;
        $scope.setData = 0;
        //        usc.domainTechnologyExperience = "";
        setTimeout(function () {
            removeActiveClass();
        }, 100)
        //$("#personalTab").removeClass('active');
        //$("#projectSectionId").addClass('active');
    }

    //Method for tab button from edit domain technology section.
    usc.showAddDomainTab = function () {
        usc.editPreviousCompany(usc.pId);
        usc.technologyTabVisibility = true;
        usc.showDomainTechnologyTab = false;
    }

    usc.checkSelect2Plugin = 0;
    //Method for tab button from edit project section.
    usc.showAddDomainTechnologyTab = function () {
        $("html, body").animate({ scrollTop: 0 }, "fast");
        if (usc.checkSelect2Plugin == 0) {
            setTimeout(function () {
                applyPlugins();
                applySelect2();
                $('#tecExpStartMY').datepicker().datepicker('setStartDate', usc.prevCompForm.duration_S_months).datepicker('setEndDate', usc.prevCompForm.duration_E_months).datepicker('setDate', usc.prevCompForm.duration_S_months);
                $('#tecExpEndMY').datepicker().datepicker('setStartDate', usc.prevCompForm.duration_S_months).datepicker('setEndDate', usc.prevCompForm.duration_E_months).datepicker('setDate', usc.prevCompForm.duration_E_months);

                // $('#tecExpStartMY').datepicker('setStartDate', usc.prevCompForm.duration_S_months);
                // $('#tecExpStartMY').datepicker('setEndDate', usc.prevCompForm.duration_E_months);
                // $('#tecExpEndMY').datepicker('setStartDate', usc.prevCompForm.duration_S_months);
                // $('#tecExpEndMY').datepicker('setEndDate', usc.prevCompForm.duration_E_months);

                // $('#tecExpStartMY').datepicker('setDate', usc.prevCompForm.duration_S_months);
                // $('#tecExpEndMY').datepicker('setDate', usc.prevCompForm.duration_E_months);
            }, 500);
            usc.checkSelect2Plugin = 1;
        } else {
            setTimeout(function () {
                $('#tecExpStartMY').datepicker().datepicker('setStartDate', usc.prevCompForm.duration_S_months).datepicker('setEndDate', usc.prevCompForm.duration_E_months).datepicker('setDate', usc.prevCompForm.duration_S_months);
                $('#tecExpEndMY').datepicker().datepicker('setStartDate', usc.prevCompForm.duration_S_months).datepicker('setEndDate', usc.prevCompForm.duration_E_months).datepicker('setDate', usc.prevCompForm.duration_E_months);
            }, 500);
        }
        usc.technologyTabVisibility = false;
        usc.showDomainTechnologyTab = true;
    }

    //function to remove row from technology table section
    usc.removeRowPageTable = function (idx) {
        var req = {
            "id": idx
        };
        swal({
            title: "Sure?",
            text: "Delete this Domain with associated Technologies?",
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
            var promise = services.deleteUserTechnology(req);
            promise.then(function mySuccess(response) {
                toastr.success("Deleted Successfully ...");
                usc.getUserwithId();
                usc.resetDataOfDropDown();
                Utility.stopAnimation();
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }).catch(swal.noop);
    }

    usc.getProjectById = function (pId) {
        usc.prevCompForm = {};
        usc.addEdit = "Edit";
        usc.id = pId;

        if (pId > 0) {
            var promise = services.getProject(pId);
            promise.then(function mySuccess(response) {
                // var startDate = usc.formateDateInMY(response.data.data.start_date);
                // var endDate = usc.formateDateInMY(response.data.data.due_date);
                var startDate = Utility.formatDate(response.data.data.start_date);
                var endDate = Utility.formatDate(response.data.data.due_date);
                usc.prevCompForm.projectName = response.data.data.name;
                usc.prevCompForm.organisationName = response.data.data.company_name;
                usc.prevCompForm.projectRole = response.data.data.role;
                usc.prevCompForm.duration_S_months = startDate;
                usc.prevCompForm.duration_E_months = endDate;
                usc.compStartDate = startDate;
                usc.compEndDate = endDate;
                usc.prevCompForm.duration = response.data.data.duration_in_years;
                usc.prevCompForm.description = response.data.data.description;
                usc.domainTechnologyExperience = usc.getProjectDomainList(response.data.data.domain);
                Utility.stopAnimation();
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }

    }

    usc.openIdleInfoModal = function (data) {
        usc.selectedProjectData = data;
        $("#checkIdleDetails").modal("toggle");
        setTimeout(function () { setCSS(); }, 500);
    }

    usc.setStartAndEndDateOfCompany = function (data) {
        // usc.compStartDate = Utility.formatDate(usc.prevCompForm.organisationName.companyStartDate);
        // usc.compEndDate = Utility.formatDate(usc.prevCompForm.organisationName.companyEndDate);
        // if (usc.compStartDate == "" && usc.compEndDate == "") {
        usc.compStartDate = data.companyStartDate;
        usc.compEndDate = data.companyEndDate;
        // }
        setTimeout(function () {
            setCompData();
            var validator = $("#previousCompanyForm").validate();
            validator.element("#organisationName");
        }, 1000);
    }

    $scope.show = function (x) {
        return x.id > 1;
    }

    usc.resetDataOfDropDown = function () {
        $("html, body").animate({ scrollTop: 0 }, "fast");
        usc.technologyForm.projectDomain = "";
        usc.technologyForm.technology_id = "";
        usc.projectTechnologies = [];
    }

    usc.scrollbarSetting = function () {
        $("html, body").animate({ scrollTop: 0 }, "fast");
    }

    //Download PDF
    usc.download = function (id) {
        var promise = services.download('user', id);
    }
    /*Sonal: Delete User function*/
    usc.deleteUser = function (userId) {
        swal({
            title: "Sure?",
            text: "Do you want to delete user?",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: true,
            confirmButtonText: "Yes",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: '#d33',
            cancelButtonText: "No",
            animation: false,
            customClass: 'animated tada',
            allowOutsideClick: false,
        }).then(function (isConfirm) {
            if (isConfirm) {
                var promise = services.deleteIndividualUser(userId);
                promise.then(function mySuccess(response) {
                    Utility.stopAnimation();
                    try {
                        if (response.data.status_code == 200) {
                            toastr.success('User deleted successfully.');
                            setTimeout(function () {
                                usc.init();
                            }, 100);
                        } else if (response.data.status_code == 201) {
                            toastr.error(response.data.message, 'Sorry!');
                        }
                    } catch (e) {
                        Raven.captureException(e)
                    }
                }, function myError(r) {
                    toastr.error(r.data.message, 'Sorry!');
                });
            } else {
                // console.log("cancel");
            }
        }).catch(swal.noop);
    }

});
