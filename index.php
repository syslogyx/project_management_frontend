<!DOCTYPE html>
<html>
    <head>

        <base href="/">

        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Project Management</title>
        <!-- Tell the browser to be responsive to screen width -->
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <link rel="shortcut icon" href="resources/img/favicon.ico">
        <!-- Bootstrap 3.3.6 -->
        <link rel="stylesheet" href="/resources/plugins/bootstrap/css/bootstrap.min.css">
        <!-- Font Awesome -->
        <link rel="stylesheet" href="/resources/lib/font-awesome-4.5.0/css/font-awesome.min.css">
        <!-- Ionicons -->
        <link rel="stylesheet" href="/resources/lib/ionicons-2.0.1/css/ionicons.min.css">
        <!-- Sweetalert -->
        <link rel="stylesheet" href="/resources/lib/sweetalert2-6.6.0/sweetalert2.min.css">
        <!--iCheck -->
        <link rel="stylesheet" href="/resources/plugins/iCheck/square/blue.css">
        <!-- Theme style -->
        <link rel="stylesheet" href="/resources/css/AdminLTE.min.css">
        <!-- AdminLTE Skins. Choose a skin from the css/skins
             folder instead of downloading all of them to reduce the load. -->
        <link rel="stylesheet" href="/resources/css/skins/_all-skins.css">
        <!-- Bootstrap style -->
        <link rel="stylesheet" href="/resources/lib/bootstrap-3.1.1/css/bootstrap.min.css">
        <!-- css default skin: _all-skins.min.css   -->
        <link href="/resources/css/Font_montserrat.css" rel="stylesheet">
        <!-- Data Table -->
        <link rel="stylesheet" type="text/css" href="/resources/lib/datatables-1.10.15/css/datatables.min.css"/>
        <!--<link rel="stylesheet" href="resources/css/style.css">-->
        <link rel="stylesheet" href="/resources/lib/angular-toggle-switch-master/angular-toggle-switch.css">
        <link rel="stylesheet" href="/resources/lib/angular-toggle-switch-master/angular-toggle-switch-bootstrap.css">
        <link rel="stylesheet" href="/resources/lib/angular-block-ui-master/dist/angular-block-ui.min.css"/>
        <!-- Datepicker CSS-->
        <link rel="stylesheet" href="/resources/plugins/datepicker/datepicker3.css">
        <!-- Daterangepicker CSS-->
        <link rel="stylesheet" href="/resources/bower_components/bootstrap-daterangepicker/daterangepicker.css">
        <!-- Bootstrap-Timepicker CSS-->
        <link rel="stylesheet" type="text/css" href="/resources/plugins/timepicker/bootstrap-timepicker.min.css" />
        <!-- Bootstrap-Toggle CSS-->
        <link href="/resources/bower_components/bootstrap-toggle-master/css/bootstrap-toggle.min.css" rel="stylesheet">
        <!-- Select2 CSS-->
        <link rel="stylesheet" href="/resources/plugins/select2/select2.min.css">
        <!-- Custom common style -->
        <link rel="stylesheet" type="text/css" href="/resources/css/commonStyle.css"/>
        <!-- Pie Chart CSS -->
        <link rel="stylesheet" href="/resources/pie_chart/jqwidgets/styles/jqx.base.css" type="text/css" /> 
        <!-- Sweetalert CSS-->
        <link rel="stylesheet" type="text/css" href="/resources/css/sweetalert-master/dist/sweetalert.css">
        <!-- Ziehharmonika CSS-->
        <link href="/resources/css/ziehharmonika.css" rel="stylesheet">
        <!-- dropzone -->
        <!--  <link rel="stylesheet" type="text/css" href="/resources/dropzone/dropzone.css"> -->
        <script src="/resources/js/sweetalert-master/dist/sweetalert.min.js"></script>
        <!-- Material design icons -->
        <link rel="stylesheet" type="text/css" href="/resources/node_modules/mdi/css/materialdesignicons.min.css">
        <!-- Material design icons -->
        <link rel="stylesheet" type="text/css" href="/resources/css/animate.css">
        <!-- For toaster alert section -->
        <link rel="stylesheet" href="/resources/bower_components/toastr/toastr.min.css">
        <link rel="stylesheet" href="/resources/plugins/awesome-bootstrap-checkbox-master/demo/build.css">
        <!-- Google Material icons -->
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
        
        <style>
            [ng\:cloak], [ng-cloak], [data-ng-cloak], [x-ng-cloak], .ng-cloak, .x-    ng-cloak{
                display: none !important;
            }
            .Blink {
                animation: blinker 1.5s cubic-bezier(.5, 0, 1, 1) infinite alternate;
            }
            @keyframes blinker {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            .skin-blue .sidebar-menu > li:hover > a, .skin-blue .sidebar-menu > li.active > a {
                outline:0;
                text-decoration: none;
            }
            .treeview-menu>li>a {
                 font-size: 13px; 
            }
            /*.main-header .navbar {
                margin-left: 200px;
            }
            .main-header .logo {
                width: 200px;
            }*/
            .user-panel>.info {
                padding: 14px 5px 5px 14px;
            }
            .user-panel>.image>img {
                /*-------Suvrat---------*/
                /*height: 45px;*/
            }
            a, u {
                text-decoration: none !important;
            }
            /* Suvrat Floating action button */
            #floating_action {
                width: 55px;
                z-index: 5;
                position: fixed;
                bottom: 0;
                right: 0;
                margin-bottom: 10px;
                margin-right: 10px;
                opacity: 0.3;
            }

            #floating_action:hover {
                opacity: 1;
            }

            #main_fab {
                background-color: #2d5098;
                color: white;
                border: none;
                border-radius: 50% !important;
                width: 45px !important;
                height: 45px;
                outline: none;
                box-shadow: 2px 2px 4px rgba(0, 0, 0, .4);
                position: fixed !important;
                bottom: 50px;
                right: 0;
                /* margin-bottom: 50px; */
                margin-right: 5px;
                width: 55px;
                z-index: 1;
            }
            .material-icons {
                -moz-transition: all 0.5s linear;
                -webkit-transition: all 0.5s linear;
                transition: all 0.5s linear;
            }
            .material-icons.rotate {
                -ms-transform: rotate(45deg);
                -moz-transform: rotate(45deg);
                -webkit-transform: rotate(45deg);
                transform: rotate(45deg);
            }
            .menu_btn {
                background-color: #2d5098;
                color:  white;
                width: 35px;
                height: 35px;
                border-radius: 50% !important;
                margin-bottom: 7px;
                box-shadow: 2px 2px 4px rgba(0, 0, 0, .4);
                border-style: none;
            }
            .menu_icon {
                font-size: 20px;
                padding-top: 2px;
                margin-left: -4px;
            }
            #inner_fab_menu {
                list-style-type: none;
                padding-left: 19px;
                padding-bottom: 75px;
                animation-name: FAB_open;
                animation-duration: 0.5s;
            }
            .closing {
                animation-name: FAB_close !important;
                animation-duration: 0.5s !important;
            }
            @keyframes FAB_close {
                from {
                    padding-bottom: 47px;
                    opacity: 1;
                }
                to {
                    padding-bottom: 0px;
                    opacity: 0;
                }
            }
            .invisible {
                display: none;
            }
            @keyframes FAB_open {
                from {
                    padding-bottom: 29px;
                    opacity: 0;
                }
                to {
                    padding-bottom: 75px;
                    opacity: 1;
                }
            }
            #main_fab {
                position: relative;
                overflow: hidden;
            }
            .menu_btn {
                position: relative;
                overflow: hidden;
            }
            #main_fab:after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 5px;
                height: 5px;
                background: rgba(255, 255, 255, .5);
                opacity: 0;
                border-radius: 100%;
                transform: scale(1, 1) translate(-50%);
                transform-origin: 50% 50%;
            }
            .menu_btn:after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 5px;
                height: 5px;
                background: rgba(255, 255, 255, .5);
                opacity: 0;
                border-radius: 100%;
                transform: scale(1, 1) translate(-50%);
                transform-origin: 50% 50%;
            }
            @keyframes ripple {
                0% {
                    transform: scale(0, 0);
                    opacity: 1;
                }
                20% {
                    transform: scale(25, 25);
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                    transform: scale(40, 40);
                }
            }
            #main_fab:focus:not(:active)::after {
                animation: ripple 1s ease-out;
            }
            .menu_btn:focus:not(:active)::after {
                animation: ripple 1s ease-out;
            }
        </style>
    </head>

    <body ng-app="myapp" class="hold-transition skin-blue sidebar-mini ng-cloak" ng-cloak="" ui-view autoscroll="false" >
        <div id="loading" style="display:none;">
            <img id="loading-image" src="resources/img/3_PM_DoubleRing_loader.gif" alt="Loading..." />
        </div>
        <!-- Site wrapper -->
        <div class="wrapper">
            <div ng-controller="menuCtrl" >
                <!-- style="display:none;" -->
                <header class="main-header">
                    <!-- Logo -->
                    <!--   <a ng-show="!token" class="logo">
                        <img src="/resources/img/syslogyx_logo.png" >
                    </a>
                    <a ng-show="token" href="/" class="logo">
                        <img src="/resources/img/syslogyx_logo.png" style="margin-top: -14px">
                    </a> -->
                    <!-- Logo -->
                    <!-- <a href="/" class="logo" onclick="window.location.reload();"> -->
                    <!-- Suvrat Issue#2892-->
                    <a href="/" class="logo">
                      <!-- mini logo for sidebar mini 50x50 pixels -->
                      <img src="resources/img/syslogyx_small_logo.png" style="padding-left: 7px; padding-top: 14px;" class="logo-mini">
                      <!-- logo for regular state and mobile devices -->
                      <img src="resources/img/syslogyx_logo.png" style="padding-left: 30px;padding-top: 2px;" class="logo-lg">
                    </a>
                    <!-- Header Navbar: style can be found in header.less -->
                    <nav class="navbar navbar-static-top" >
                        <!-- Sidebar toggle button-->
                        <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button" ng-show="token" style="text-decoration: none;" id="sidebar-toggle">
                        <span class="sr-only">Toggle navigation</span>
                        </a>

                        <div class="navbar-custom-menu">
                            <ul class="nav navbar-nav" ng-show="token">
                                <!-- <li class="dropdown user user-menu">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                        <img src="resources/img/default_profile.png" class="user-image" alt="User Image">
                                    </a>
                                    <ul class="dropdown-menu">

                                        <li class="user-header">
                                            <img src="resources/img/default_profile.png" class="img-circle" alt="User Image">

                                            <p>
                                                <a ng-href="user/add/{{userId}}" style="color: white;">View Profile</a>
                                            </p>
                                        </li>

                                        <li class="user-footer">
                                            <div class="pull-right">
                                                <button type="button" class="btn btn-default btn-md" title="Logout" data-ng-click="clearToken()">Logout
                                                </button>
                                            </div>
                                        </li>
                                    </ul>
                                </li> -->
                                <li class="dropdown user user-menu">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                        <!-- <img src="resources/img/default_profile.png" class="user-image" alt="User Image"> -->
                                        <!-- <img ng-src="http://hrms.syslogyx.com/upload/profilepic/{{avatar}}" onerror="this.onerror=null;this.src='resources/img/default_profile.png';" class="user-image"> -->
                                        <!-- Suvrat Issue#3174 -->
                                        <img ng-src="https://hrms.syslogyx.com/upload/profilepic/{{avatar}}" onerror="this.onerror=null;this.src='resources/img/default_profile.png';" class="user-image img-circle">
                                        <!-- ---------------------- -->
                                        <span class="hidden-xs">{{name}}</span>
                                    </a>
                                    <ul class="dropdown-menu">
                                        <!-- User image -->
                                        <li class="user-header">
                                            <!-- <img src="resources/img/default_profile.png" class="img-circle" alt="User Image"> -->
                                            <!-- <img ng-src="http://hrms.syslogyx.com/upload/profilepic/{{avatar}}" onerror="this.onerror=null;this.src='resources/img/default_profile.png';" class="img-circle"> -->
                                            <!-- Suvrat Issue#3174 -->
                                            <img ng-src="https://hrms.syslogyx.com/upload/profilepic/{{avatar}}" class="img-circle" onerror="this.onerror=null;this.src='/resources/img/default_profile.png';">
                                            <!-- ----------------- -->
                                            <p>
                                                {{name}}
                                            </p>
                                        </li>
                                        <!-- Menu Body -->
                                        <!-- <li class="user-body">
                                            <div class="row"> </div>  
                                        </li> -->
                                        <!-- Menu Footer-->
                                        <li class="user-footer">
                                            <div class="pull-left">
                                                <a ng-href="user/info/{{userId}}" class="btn btn-default btn-flat">Profile</a>
                                            </div>
                                            <!-- style="display:none" -->
                                            <div class="pull-right" >
                                                <a href="#" class="btn btn-default btn-flat" style="display:none" data-ng-click="clearToken()">Sign out</a>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>
                <!-- =============================================== -->

                <!-- Left side column. contains the sidebar -->
                <aside class="main-sidebar" ng-show="token">
                    <!-- sidebar: style can be found in sidebar.less -->
                    <section class="sidebar">
                        <!-- Sidebar user panel -->
                        <div class="user-panel push-menu">
                            <div class="pull-left image">
                                <!-- <img src="resources/img/default_profile.png" class="img-circle" alt="User Image"> -->
                                <img ng-src="https://hrms.syslogyx.com/upload/profilepic/{{avatar}}" onerror="this.onerror=null;this.src='resources/img/default_profile.png';" class="img-circle" style="max-height:45px;">
                            </div>
                            <div class="pull-left info" style="white-space: initial;">
                                <p>{{name}}</p>
                            </div>
                        </div>

                        <!-- sidebar menu: : style can be found in sidebar.less -->

                        <!-- <ul class="sidebar-menu" data-widget="tree" ng-if ="projectInfo.projectName">
                            <li class="active" id="projectMain" >
                                <a href="#" style="outline:0;text-decoration: none;" ng-click="subMenuClick('parent')">
                                    <i class="fa fa-dashboard"></i> <span>{{projectInfo.projectName}}</span>
                                    <span class="pull-right-container">
                                        <i class="fa fa-angle-down pull-right" id="parent"></i>
                                    </span>
                                </a>
                                <ul class="treeview-menu menu-open" style="display: block;">
                                    <li ng-repeat = "item in globalMenu" ng-if="item.menu_name != 'Calendar' && item.menu_name != 'Timesheet' && item.menu_name != 'EOD' && item.menu_name != 'Project Info'  && (item.menu_name != 'MoM List' && item.menu_name != 'MoM Add')  && can(item.permissionTag)" class="{{item.active}}">
                                      <a href="{{item.url}}/{{item.projectId}}" id="{{item.id}}" style="outline:0;text-decoration: none;" >
                                        <i class="{{item.icon}}"></i> <span>{{item.menu_name}}</span>
                                      </a>
                                    </li>

                                    <li ng-click="subMenuClick(item.id)"  ng-repeat = "item in globalMenu" ng-if="item.permissionTag=='' && item.child.length>0 && item.menu_name == 'Project Info'" class="treeview {{item.active}}">
                                        <a href="#" style="outline:0;text-decoration: none;">
                                            <i class="{{item.icon}}"></i> <span>{{item.menu_name}}</span>
                                            <span class="pull-right-container">
                                                <i class="fa fa-angle-left pull-right" id="{{item.id}}"></i>
                                            </span>
                                        </a>
                                        <ul class="treeview-menu menu-open" ng-if = "item.child.length>0 && item.menu_name == 'Project Info'">
                                            <li ng-repeat="ch in item.child" class="{{ch.active}}" ><a style="outline:0;text-decoration: none;" href="{{ch.url}}/{{item.projectId}}" ><i class="fa fa-circle-o"  ></i><span> {{ch.menu_name}}</span></a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li ng-repeat = "item in globalMenu" ng-if="(item.menu_name == 'Calendar' || item.menu_name == 'Timesheet') && (item.permissionTag !='' && can(item.permissionTag))" ng-click="select($index)" class="{{item.active}}">
                                <a href="{{item.url}}/{{item.projectId}}" id="{{item.id}}" style="outline:0;text-decoration: none;" >
                                    <i class="{{item.icon}}"></i> <span>{{item.menu_name}}</span>
                                </a>
                            </li>

                            <li ng-click="subMenuClick(item.id)" ng-repeat = "item in globalMenu" ng-if="item.permissionTag=='' && item.child.length>0 && item.menu_name !== 'Project Info'" class="treeview {{item.active}}">
                                <a href="#" style="outline:0;text-decoration: none;">
                                    <i class="{{item.icon}}"></i> <span>{{item.menu_name}}</span>
                                    <span class="pull-right-container">
                                        <i class="fa fa-angle-left pull-right" id="{{item.id}}" ></i>
                                    </span>
                                </a>
                                <ul class="treeview-menu menu-open" ng-if = "item.child.length>0">
                                    <li ng-repeat="ch in item.child" class="{{ch.active}}" ><a style="outline:0;text-decoration: none;" href="{{ch.url}}/{{item.projectId}}" ><i class="fa fa-circle-o"  ></i><span> {{ch.menu_name}}</span></a></li>
                                </ul>
                            </li>
                        </ul> -->

                        <!-- <ul class="sidebar-menu" data-widget="tree" ng-if ="!projectInfo.projectId">
                              
                            <li ng-repeat = "item in globalMenu" ng-if="item.permissionTag!='' && can(item.permissionTag)" ng-click="select($index)" class="{{item.active}}">
                                <a href="{{item.url}}/{{item.projectId}}" id="{{item.id}}" style="outline:0;text-decoration: none;" >
                                    <i class="{{item.icon}}"></i> <span>{{item.menu_name}}</span>
                                </a>
                            </li>

                            <li ng-click="subMenuClick(item.id)"  ng-repeat = "item in globalMenu" ng-if="item.permissionTag=='' && item.child.length>0 " class="treeview {{item.active}}">
                                <a href="#" style="outline:0;text-decoration: none;">
                                    <i class="{{item.icon}}"></i> <span>{{item.menu_name}}</span>
                                    <span class="pull-right-container">
                                        <i class="fa fa-angle-left pull-right" id="{{item.id}}"></i>
                                    </span>
                                </a>
                                <ul class="treeview-menu menu-open" ng-if = "item.child.length>0 " >
                                    <li ng-repeat="ch in item.child" class="{{ch.active}}"><a style="outline:0;text-decoration: none;" href="{{ch.url}}/{{item.projectId}}" ><i class="fa fa-circle-o"  ></i> <span>{{ch.menu_name}}</span></a></li>
                                </ul>
                            </li>
                        </ul> -->
                       <!--  <ul class="sidebar-menu" data-widget="tree" ng-if ="!projectInfo.projectId">
                            <li ng-repeat = "item in globalMenu" ng-if="item.permissionTag!='' && can(item.permissionTag)" ng-click="select($index)" class="{{item.active}}">
                                <a href="{{item.url}}/{{item.projectId}}" id="{{item.id}}" style="outline:0;text-decoration: none;" >
                                    <i class="{{item.icon}}"></i> <span>{{item.menu_name}}</span>
                                </a>
                            </li>

                            <li ng-click="subMenuClick(item.id)" ng-repeat = "item in globalMenu" ng-if="item.permissionTag=='' && item.child.length>0 " class="treeview" id="EOD">

                                <a href="#" style="outline:0;text-decoration: none;">
                                    <i class="{{item.icon}}"></i> <span>{{item.menu_name}}</span>
                                    <span class="pull-right-container">
                                        <i class="fa fa-angle-left pull-right" id="DROPICN"></i>
                                    </span>
                                </a>
                                <ul class="treeview-menu menu-open" ng-if = "item.child.length>0" id="EODSM">
                                    <li ng-repeat="ch in item.child" class="{{ch.active}}"><a style="outline:0;text-decoration: none;" href="{{ch.url}}/{{item.projectId}}" ><i class="fa fa-circle-o"  ></i> <span>{{ch.menu_name}}</span></a></li>
                                </ul>
                            </li>
                        </ul> -->

                        <!-- Sidebar issue fix(incomplete) -->
                        <!-- sidebar: style can be found in sidebar.less -->
                        <!-- <section class="sidebar">                       
                            <div class="user-panel push-menu">
                                <div class="pull-left image">
                                    
                                    <img ng-src="http://hrms.syslogyx.com/upload/profilepic/{{avatar}}" onerror="this.onerror=null;this.src='resources/img/default_profile.png';" class="img-circle">
                                </div>
                                <div class="pull-left info" style="white-space: initial;">
                                    <p>{{name}}</p>
                                </div>
                            </div>

                            <ul class="sidebar-menu tree" data-widget="tree" ng-if ="projectInfo.projectName">
                                    
                                <li class="active" id="projectMain" >
                                    <a href="#" class="click-loader" style="outline:0;text-decoration: none;">
                                        <i class="fa fa-dashboard"></i> <span>{{projectInfo.projectName}}</span>
                                        <span class="pull-right-container">
                                            <i class="fa fa-angle-down pull-right" id="parent"></i>
                                        </span>
                                    </a>
                                    <ul class="treeview-menu" style="display: block;">
                                        <li ng-repeat = "item in globalMenu" ng-if="item.menu_name != 'Calendar' && item.menu_name != 'Timesheet' && item.menu_name != 'EOD' && item.menu_name != 'Project Info'  && (item.menu_name != 'MoM List' && item.menu_name != 'MoM Add')  && can(item.permissionTag)">
                                          <a href="{{item.url}}/{{item.projectId}}" class="click-loader" id="{{item.id}}" style="outline:0;text-decoration: none;" >
                                            <i class="{{item.icon}}"></i> <span>{{item.menu_name}}</span>
                                          </a>
                                        </li>

                                        <li ng-repeat = "item in globalMenu" ng-if="item.permissionTag=='' && item.child.length>0 && item.menu_name == 'Project Info'" class="treeview">
                                            <a href="#" class="click-loader" style="outline:0;text-decoration: none;">
                                                <i class="{{item.icon}}"></i> <span>{{item.menu_name}}</span>
                                                <span class="pull-right-container">
                                                    <i class="fa fa-angle-left pull-right" id="{{item.id}}"></i>
                                                </span>
                                            </a>
                                            <ul class="treeview-menu" ng-if = "item.child.length>0 && item.menu_name == 'Project Info'">
                                                <li ng-repeat="ch in item.child"><a style="outline:0;text-decoration: none;" class="click-loader" href="{{ch.url}}/{{item.projectId}}" ><i class="fa fa-circle-o"  ></i><span> {{ch.menu_name}}</span></a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                                <li ng-repeat = "item in globalMenu" ng-if="(item.menu_name == 'Calendar' || item.menu_name == 'Timesheet') && (item.permissionTag !='' && can(item.permissionTag))">
                                    <a href="{{item.url}}/{{item.projectId}}" class="click-loader" id="{{item.id}}" style="outline:0;text-decoration: none;" >
                                        <i class="{{item.icon}}"></i> <span>{{item.menu_name}}</span>
                                    </a>
                                </li>

                                <li ng-repeat = "item in globalMenu" ng-if="item.permissionTag=='' && item.child.length>0 && item.menu_name !== 'Project Info'" class="treeview">
                                    <a href="#" class="click-loader" style="outline:0;text-decoration: none;">
                                        <i class="{{item.icon}}"></i> <span>{{item.menu_name}}</span>
                                        <span class="pull-right-container">
                                            <i class="fa fa-angle-left pull-right" id="{{item.id}}" ></i>
                                        </span>
                                    </a>
                                    <ul class="treeview-menu" ng-if = "item.child.length>0">
                                        <li ng-repeat="ch in item.child"><a class="click-loader" style="outline:0;text-decoration: none;" href="{{ch.url}}/{{item.projectId}}" ><i class="fa fa-circle-o"  ></i><span> {{ch.menu_name}}</span></a></li>
                                    </ul>
                                </li>
                            </ul>

                            <ul class="sidebar-menu tree" data-widget="tree" ng-if ="!projectInfo.projectId">
                                
                                <li ng-repeat = "item in globalMenu" ng-if="item.permissionTag!='' && can(item.permissionTag)">
                                    <a href="{{item.url}}/{{item.projectId}}" class="click-loader" id="{{item.id}}" style="outline:0;text-decoration: none;" >
                                        <i class="{{item.icon}}"></i> <span>{{item.menu_name}}</span>
                                    </a>
                                </li>

                                <li ng-repeat = "item in globalMenu" ng-if="item.permissionTag=='' && item.child.length>0 " class="treeview">

                                    <a href="#" class="click-loader" style="outline:0;text-decoration: none;">
                                        <i class="{{item.icon}}"></i> <span>{{item.menu_name}}</span>
                                        <span class="pull-right-container">
                                            <i class="fa fa-angle-left pull-right"></i>
                                        </span>
                                    </a>
                                    <ul class="treeview-menu" ng-if = "item.child.length>0">
                                        <li ng-repeat="ch in item.child" ><a class="click-loader" style="outline:0;text-decoration: none;" href="{{ch.url}}/{{item.projectId}}" ><i class="fa fa-circle-o"  ></i> <span>{{ch.menu_name}}</span></a></li>
                                    </ul>
                                </li>
                            </ul> -->

                            <!-- --------------------------------------------------- -->

                            <!-- <ul class="sidebar-menu" ng-if ="!projectInfo.projectId">
                                <li ng-repeat = "item in globalMenu" class="{{ item.active}}  {{ item.child.length>0 ? '' : 'treeview' }}" ng-if="item.permissionTag != '' && can(item.permissionTag)">
                                    <a ng-href="{{item.url}}">
                                        <i class="{{item.icon}}"></i>
                                        <span>{{item.menu_name}}</span>
                                        <i ng-if="item.child.length>0" class="fa fa-angle-left pull-right"></i>
                                    </a>
                                    <ul class="treeview-menu" ng-if="item.child.length>0 && item.menu_name == 'Projects'">
                                        <li ng-repeat="ch in item.child" class="{{ch.active}}">
                                            <a ng-href="{{ch.url}}">
                                                <i class="fa fa-circle-o"></i> 
                                                <span>{{ch.menu_name}}</span>
                                                <i ng-if="ch.child.length>0" class="fa fa-angle-left pull-right" ></i>
                                            </a>
                                            <ul ng-if="ch.child.length>0" class="treeview-menu">
                                                <li ng-repeat="sch in ch.child" class="{{sch.active}}">
                                                    <a ng-href="{{sch.url}}">
                                                        <i class="fa fa-circle-o"></i>
                                                        <span>{{sch.menu_name}}</span>       
                                                        <i ng-if="sch.child.length>0" class="fa fa-angle-left pull-right"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                    <ul class="treeview-menu" ng-if="item.child.length>0 && item.menu_name !== 'Projects'">
                                        <li ng-repeat="ch in item.child" class="{{ch.active}}">
                                            <a ng-href="{{ch.url}}">
                                                <i class="fa fa-circle-o"></i> 
                                                <span>{{ch.menu_name}}</span>
                                                <i ng-if="ch.child.length>0" class="fa fa-angle-left pull-right"></i>
                                            </a>
                                            <ul ng-if="ch.child.length>0" class="treeview-menu">
                                                <li ng-repeat="sch in ch.child" class="{{sch.active}}">
                                                    <a ng-href="{{sch.url}}">
                                                        <i class="fa fa-circle-o"></i>
                                                        <span>{{sch.menu_name}}</span>       
                                                        <i ng-if="sch.child.length>0" class="fa fa-angle-left pull-right"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                            </ul> -->

                            <!-- Suvrat -->
                            <ul class="sidebar-menu" ng-if ="!projectInfo.projectId" style="cursor: pointer;">
                                <li ng-repeat = "item in globalMenu" class="{{ item.active}}  {{ item.child.length>0 ? '' : 'treeview' }}" ng-if="item.permissionTag != '' && can(item.permissionTag)">
                                    <a ng-href="{{item.url}}" class="click-loader" onclick="menu(this);">
                                        <i class="{{item.icon}}"></i>
                                        <span>{{item.menu_name}}</span>
                                        <i ng-if="item.child.length>0" class="fa fa-angle-left pull-right"></i>
                                    </a>
                                    <ul class="treeview-menu" ng-if="item.child.length>0 && item.menu_name == 'Projects'">
                                        <!-- Suvrat Issue#3166 To get the name of project from root scope-->
                                        <li style="cursor: default;" class="active"><a><i class="fa fa-chevron-circle-down"></i> {{project_name}}</a></li>
                                        <!-- ----------------- -->
                                        <li ng-repeat="ch in item.child" class="{{ch.active}}">
                                            <a ng-href="{{ch.url}}" class="click-loader" onclick="menu(this);">
                                                <i class="fa fa-circle-o"></i> 
                                                <span>{{ch.menu_name}}</span>
                                                <i ng-if="ch.child.length>0" class="fa fa-angle-left pull-right" ></i>
                                            </a>
                                            <ul ng-if="ch.child.length>0" class="treeview-menu">
                                                <li ng-repeat="sch in ch.child" class="{{sch.active}}">
                                                    <a ng-href="{{sch.url}}" class="click-loader" onclick="menu(this);">
                                                        <i class="fa fa-circle-o"></i>
                                                        <span>{{sch.menu_name}}</span>       
                                                        <i ng-if="sch.child.length>0" class="fa fa-angle-left pull-right"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                    <ul class="treeview-menu" ng-if="item.child.length>0 && item.menu_name !== 'Projects'">
                                        <li ng-repeat="ch in item.child" class="{{ch.active}}">
                                            <a ng-href="{{ch.url}}" class="click-loader" onclick="menu(this);">
                                                <i class="fa fa-circle-o"></i> 
                                                <span>{{ch.menu_name}}</span>
                                                <i ng-if="ch.child.length>0" class="fa fa-angle-left pull-right"></i>
                                            </a>
                                            <ul ng-if="ch.child.length>0" class="treeview-menu">
                                                <li ng-repeat="sch in ch.child" class="{{sch.active}}">
                                                    <a ng-href="{{sch.url}}" class="click-loader" onclick="menu(this);">
                                                        <i class="fa fa-circle-o"></i>
                                                        <span>{{sch.menu_name}}</span>       
                                                        <i ng-if="sch.child.length>0" class="fa fa-angle-left pull-right"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            <!-- ---------------------------------- -->
                    </section>
                    <!-- /.sidebar -->
                </aside>
                <!-- Suvrat Add the floating action button -->
                <div id="floating_action" ng-if="can('user.projects.add') || can('user.projects.milestones.add') || can('user.projects.tasks.add')">
                    <button type="button" class="btn non_rot" id="main_fab">
                        <i class="material-icons" id="main_fab_btn" style="font-size:23px;margin-top: 4px;margin-left: -1px;">add
                        </i>
                    </button>
                    <ul id="inner_fab_menu" class="invisible">
                        <li>
                            <a type="button" class="btn menu_btn" title="Add new project" href="/project/add" style="outline:none;color: white;" ng-if="can('user.projects.add')">
                                <i class="material-icons menu_icon">info</i>
                            </a>
                        </li>
                        <li>
                            <button type="button" class="btn menu_btn" data-toggle="modal" data-ng-click="addMilestone()" title="Add new milestone" style="outline:none;color: white;" ng-if="can('user.projects.milestones.add')">
                                <i class="material-icons menu_icon">flag</i>
                            </button>
                        </li>
                        <li>
                            <button type="button" class="btn menu_btn" data-toggle="modal" data-ng-click="addTask()" title="Add new task" style="outline:none;color: white;" ng-if="can('user.projects.tasks.add')">
                                <i class="material-icons menu_icon">assignment_turned_in</i>
                            </button>
                        </li>
                    </ul>
                </div>
                <!-- ------------------------------------- -->
            </div>

            <!--  ng-style="blurData ==1 ? { 'filter': 'blur(15px)' } : { 'filter': 'blur(0px)'}" -->
            <!-- =============================================== -->

            <!-- Content Wrapper. Contains page content -->
            <div class="content-wrapper" >
                <div id="viewPort" data-ng-view ></div>
            </div>
            <!-- /.content-wrapper -->

            <div ng-controller="menuCtrl" >
                <!-- <footer class="main-footer prjct-footer" ng-style="globalMenu.length > 0 ? {'margin-left': '200px'} : {'margin-left': '0px'}">
                    <div class="pull-right hidden-xs">

                    </div>
                    <strong>&copy;<a href="http://www.syslogyx.com/">Syslogyx Technologies Pvt. Ltd.</a></strong> All rights
                    reserved.
                    <span class="pull-right"><b>V</b> 2.1</span>
                </footer> -->
                <footer class="main-footer">
                    <div class="pull-right hidden-xs">
                        <b>Version</b> 3.2
                    </div>
                    <strong>Copyright &copy; 2018 <a href="http://www.syslogyx.com/" target="_blank" >Syslogyx Technologies Pvt. Ltd.</a></strong> All rights
                    reserved.
                </footer>

                <div class="pm_uploader_container pmct">
                    <div class="pm_uploader_head">
                        <h4 >Uploading 1 file</h4>
                        <a href="" class="pm_close"><i class="mdi mdi-close"></i></a>
                    </div>
                    <div class="pm_uploader_body">
                        <div class="file_info">
                            sbfkjqhnkasnd.jpg
                        </div>
                        <div class="file_activity">
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" aria-valuenow="70"
                                     aria-valuemin="0" aria-valuemax="100" style="width:70%">
                                    <span class="sr-only">70% Complete</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
         <!-- ./wrapper -->
        <div data-ng-controller="sidebarCtrl" id="sidebarComponent">
                <div ng-include="'/resources/templates/comp_user_info.html'"></div>
        </div>

        <!-- Suvrat Add new task modal -->
        <div class="modal fade" id="taskSelModal" role="dialog" data-ng-controller="menuCtrl" style="padding-top:100px;" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-xs">
                <form id = "taskOptionForm" role="form">
                    <div class="modal-content" style="border-radius: 0px!important;">
                        <div class="modal-header" style="text-align:center;">
                            <button type="button" class="close" data-dismiss="modal" ng-click="resetAddTaskModal();">&times;</button>
                            <h4 class="modal-title">Select Task Source</h4>
                        </div>
                        <div class="modal-body">
                            <div class="row" style="margin-bottom: 20px;text-align:center;">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <div class="radio radio-info radio-inline">
                                            <input type="radio" data-ng-model="taskOptionSelected" name="radioInline" id="new" value="new" ng-click="select2Initialisation()" />
                                            <label for="new">New</label>
                                        </div>
                                        <div class="radio radio-info radio-inline">
                                            <input type="radio" data-ng-model="taskOptionSelected" id="copy_from_existing" name="radioInline" value="copy_from_existing" ng-click="select2Initialisation()" />
                                            <label for="copy_from_existing">Copy from Existing
                                            </label>
                                        </div>
                                        <div class="radio radio-info radio-inline">
                                            <input type="radio" data-ng-model="taskOptionSelected" id="copy_from_default" name="radioInline" value="copy_from_default" ng-click="select2Initialisation()" disabled="" />
                                            <label for="copy_from_default">Copy from Default
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row" ng-if="taskOptionSelected == 'new'">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label class="mandatory" for="">Project</label>
                                        <select id="projectLists" name="projectLists" data-ng-model="projectNewTask" class="form-control select2 s2mn" ng-options="x.id as x.name for x in ProjectsLists" ng-change="getProjectID(projectNewTask);">
                                            <option value="">Select Project</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row" ng-if="taskOptionSelected == 'copy_from_existing' || taskOptionSelected == 'copy_from_default'">
                                <div class="row" style="margin-left: 20px !important;margin-right: 20px !important;">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label class="mandatory" for="">Project</label>
                                            <select id="projectListss" name="projectListss" ng-model="projectIDForMilestone" class="form-control select2 s2mn" style="width: 100%;" ng-options="x.id as x.name for x in ProjectsLists" ng-change="getMilestoneListID(projectIDForMilestone)">
                                                <option value="">Select Project</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" style="margin-left: 20px !important;margin-right: 20px !important;">
                                    <div class="col-md-6" ng-if="projectIDForMilestone">
                                        <div class="form-group">
                                            <label class="mandatory" for="">Milestone</label>
                                            <select id="milestoneLists" name="milestoneLists" data-ng-model="milestoneIdForTask" class="form-control select2 s2mn" style="width: 100%;" ng-options="x.id as x.title for x in MilestonesLists"  ng-change="getTasksFromMilestone(milestoneIdForTask)">
                                                <option value="">Select milestone</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6" ng-if="projectIDForMilestone && milestoneIdForTask">
                                        <div class="form-group">
                                            <label class="mandatory" for="">Task</label>
                                            <select id="taskList" name="taskList" data-ng-model="taskListId" class="form-control select2 s2mn" style="width: 100%;" ng-options="x.id as x.title for x in TasksLists | unique:'title'" ng-change="getTaskID(taskListId)">
                                                <option value="">Select task</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <a type="button" class="btn btn-primary" ng-if="taskOptionSelected == 'new'" ng-href="/project/task/add/{{projectNewTask}}" ng-click="resetAddTaskModal()" onclick="dismissModal()">Next</a>
                                <a type="button" class="btn btn-primary" ng-if="taskOptionSelected == 'copy_from_existing'" ng-href="/project/task/add/{{projectIDForMilestone}}?copy={{taskListId}}" ng-click="resetAddTaskModal()" onclick="dismissModal()">Next</a>
                                <!-- <a type="button" class="btn btn-primary" ng-if="taskOptionSelected == 'copy_from_default'" ng-href="/project/task/add/{{projectIDForMilestone}}?copy={{taskListId}}" onclick="dismissModal()">Next</a> -->
                                <button type="button" class="btn btn-warning" data-dismiss="modal" ng-click="resetAddTaskModal();">Cancel</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <!-- ------------------------------------------- -->
        <!-- Suvrat Add new milestone modal -->
        <div class="modal fade" data-ng-controller="menuCtrl" id="milestoneModal" role="dialog" style="padding-top:100px;" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-xs">
                <form id = "milestoneForm" role="form">
                    <div class="modal-content" style="border-radius: 0px!important;">
                        <div class="modal-header" style="text-align:center;">
                            <button type="button" class="close" data-dismiss="modal" ng-click="resetMilestoneModal()">&times;</button>
                            <h4 class="modal-title">Select Milestone Source</h4>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label class="mandatory" for="">Project</label>
                                        <br>
                                        <select id="milestoneProjectLists" name="milestoneProjectLists" data-ng-model="milestoneProjectId" class="form-control select2 s2mn" ng-options="x.id as x.name for x in ProjectsLists" style="width:100%;" placeholder="Select Project">
                                            <option value="">Select Project</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <a type="button" id="milestoneButton" class="btn btn-success" ng-href="/project/milestone/add/{{milestoneProjectId}}">Next</a>
                            <button type="button" class="btn btn-warning" data-dismiss="modal" ng-click="resetMilestoneModal()">Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <!-- ------------------------------------------- -->
        <!-- jQuery 3 -->
        <!-- <script src="/resources/plugins/jquery/dist/jquery.min.js"></script> -->
        <!-- <script src="/resources/jquery.js"></script> -->
        <script src="/resources/jquery.min.js"></script>
        <!-- <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script> -->
        <!-- jQuery UI 1.11.4 -->
        <script src="/resources/plugins/jquery-ui/jquery-ui.min.js"></script>
        <!-- Bootstrap 3.3.6 -->
        <script src="/resources/js/bootstrap.min.js"></script>
        <!-- SlimScroll -->
        <script src="/resources/plugins/slimScroll/jquery.slimscroll.min.js"></script>
        <!-- FastClick -->
        <script src="/resources/plugins/fastclick/fastclick.js"></script>
        <!-- AdminLTE App -->
        <script src="/resources/js/app.min.js"></script>
        <script src="/resources/js/adminlte.min.js"></script>
        <!-- AdminLTE for demo purposes -->
        <script src="/resources/js/demo.js"></script>
        <!--jQuery Cookies -->
        <script src="/resources/bower_components/jquery-cookie-master/src/jquery.cookie.js"></script>
        <!-- Data Table -->
        <script type="text/javascript" src="/resources/lib/datatables-1.10.15/js/datatables.min.js"></script>
        <!-- Jquery Validate -->
        <script src="/resources/plugins/jquery-validation/dist/jquery.validate.min.js"></script>
        <!-- Icheck -->
        <script src="/resources/plugins/iCheck/icheck.min.js"></script>
        <!-- Angular-1.4.8 -->
        <script src="/resources/lib/angular-1.4.8/angular.min.js"></script>
        <!-- For tagging user in mom-task section -->
        <script src="/resources/lib/mentio.js"></script>
        <!-- Angular-Route -->
        <script src="/resources/lib/angular-1.4.8/angular-route.js"></script>
        <!-- Angular-acl -->
        <script src="/resources/bower_components/angular-acl/angular-acl.js"></script>
        <!-- Angular-cookies -->
        <script src="/resources/bower_components/angular-cookies/angular-cookies.js"></script>
        <!-- Breadcrumbs -->
        <script src="/resources/bower_components/breadcrum/ng-breadcrumbs.min.js"></script>
        <!-- <script src="/resources/bower_components/breadcrum/ng-breadcrumbs.js"></script> -->
        <!--Sweetalert2 -->
        <script src="/resources/lib/sweetalert2-6.6.0/sweetalert2.min.js"></script>
        <!--<script src="/resources/plugins/jquery-validation/dist/jquery.validate.min.js"></script>-->
        <!-- CK Editor -->
        <script src="/resources/plugins/ckeditor/ckeditor.js"></script>
        <!-- Bootstrap WYSIHTML5 -->
        <script src="/resources/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js"></script>
        <!-- For toaster alert -->
        <script src="/resources/bower_components/toastr/toastr.min.js"></script>
        <!-- date-range-picker -->
        <script src="/resources/lib/moment/moment.min.js"></script>
        <script src="/resources/plugins/daterangepicker/daterangepicker.js"></script>
        <script src="/resources/bower_components/bootstrap-daterangepicker/daterangepicker.js"></script>
        <!-- bootstrap datepicker -->
        <script src="/resources/plugins/datepicker/bootstrap-datepicker.js"></script>
        <!-- Chart -->
        <script src="/resources/bower_components/chartJs/Chart.js"></script>
        <!--<script type="text/javascript" src="/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js"></script>-->
        <!-- bootstrap Timepicker -->
        <script type="text/javascript" src="/resources/plugins/timepicker/bootstrap-timepicker.min.js"></script>
        <!-- bootstrap Toggle -->
        <script src="/resources/bower_components/bootstrap-toggle-master/js/bootstrap-toggle.min.js"></script>
        <!-- Select2 -->
        <script src="/resources/plugins/select2/select2.full.min.js"></script>
        <!-- TwoPagination Plugin -->
        <script src="/resources/plugins/jquery.twbsPagination/jquery.twbsPagination.min.js"></script>
        <!-- Raven -->
        <script src="/resources/lib/raven.min.js" crossorigin="anonymous"></script>
        <!-- Ck editor liberary f -->
        <script type="text/javascript" src="/resources/lib/ckeditor-new/ckeditor.js"></script>
        <!-- Jquery -->
        <script type="text/javascript" src="/resources/lib/ckeditor-new/jquery.js"></script>
        <!-- UI-bootstrap-tpls -->
        <script src="/resources/js/ui-bootstrap-tpls.js"></script>
        <!-- <script src="/resources/js/angular-breadcrumb.js"></script> -->
        <!-- Pie Chart JS -->
        <script type="text/javascript" src="/resources/pie_chart/jqwidgets/jqxcore.js"></script>
        <script type="text/javascript" src="/resources/pie_chart/jqwidgets/jqxdraw.js"></script>
        <script type="text/javascript" src="/resources/pie_chart/jqwidgets/jqxchart.core.js"></script>
        <!-- <script type="text/javascript" src="scripts/demos.js"></script> -->
        <script type="text/javascript" src="/resources/pie_chart/jqwidgets/jqxdata.js"></script>
        <script type="text/javascript">
            var _c = new Date().getTime();
            var controllerList =[
                                    "homeCtrl",
                                    "loginCtrl",
                                    "domainCtrl",
                                    "menuCtrl",
                                    "clientCtrl",
                                    "projectCtrl",
                                    "technologyCtrl",
                                    "milestoneCtrl",
                                    "taskCtrl",
                                    "documentCtrl",
                                    "projectResourceCtrl",
                                    "feedCtrl",
                                    "userCtrl",
                                    "resourceMatrixCtrl",
                                    "categoryCtrl",
                                    "projectPocCtrl",
                                    "activityStatusCtrl",
                                    "statusCtrl",
                                    "timeSheetCtrl",
                                    "calendarCtrl",
                                    "allFeedCtrl",
                                    "rolesCtrl",
                                    "permissionCtrl",
                                    "attachPermissionCtrl",
                                    "momCtrl",
                                    "eodCtrl"
                                ];
            document.write('<script type="text/javascript" src="/resources/js/myapp.js?v='+_c+'"><\/script>');

            for(var i=0;i<controllerList.length;i++){
                document.write('<script type="text/javascript" src="/controller/'+controllerList[i]+'.js?v='+_c+'"><\/script>');
            }
        </script>
        <script >
            var subject = $(".sm_container");
            $(document).ready(function () {
                $(".wrapper").mouseup(function(e){
                    $(".sm_container").fadeOut(10);
                });
                $("html, body").animate({scrollTop: 0}, "fast");
            });

            subject.click(function(){
                subject.fadeIn(0);
            });

            $('.mdi-close').click(function(){
                subject.fadeOut(0);
            });

            $("#ref").click(function (e) {
                e.preventDefault();
                $(".sm_container").hide();
            });

            $(".pm_close").click(function (e) {
                e.preventDefault();
                $(this).parents(".pmct").hide();
            });

            $( window ).scroll(function() {
                $(".date-picker").blur();
            });

            $(window).on('popstate', function(event) {
                $(".modal").modal("hide");
                $('.modal-backdrop').remove();
                // $('.modal').remove();
                $("body").removeClass("modal-open");
                $("body").css("padding-right", "0px");
                window.location.reload();
            });  
        </script>
        <script>
            var clickedOnScrollbar = function(mouseX){
                if( $(window).outerWidth() <= mouseX ){
                return true;
                }
            };

            $(document).mousedown(function(e){
                if( clickedOnScrollbar(e.clientX) ){
                    $(".date-picker").blur();
                }
            });
        </script>
    </body>
</html>
<!-- Suvrat Control the floating action button -->
<script>
    var click_flag = 0;
    $(document).ready(function() {
        $('#main_fab').on('click',function() {
            $('#main_fab_btn').toggleClass("rotate");
            $('#inner_fab_menu').toggleClass("invisible");
            click_flag = 1;
        });
        $('.menu_btn').on('click', function() {
            $('#inner_fab_menu').addClass("closing");
            $('#main_fab_btn').toggleClass("rotate");

            setTimeout(close_menu, 400);
            function close_menu() {
            $('#inner_fab_menu').toggleClass("invisible");
            $('#inner_fab_menu').removeClass("closing");
            }
        });

        // Suvrat Issue#3344
        // $('#floating_action').on('mouseleave', function() {
            // if(click_flag == 1) {
                // $('#main_fab_btn').toggleClass("rotate");
                // $('#inner_fab_menu').toggleClass("invisible");                
                // click_flag = 0;
            // } else {
                //Do nothing
            // }
        // });
        ////////////////////
        $('#milestoneButton').on('click',function() {
            $('#milestoneModal').modal('hide');
        });

        $(".s2mn").select2();
        $("#projectLists").select2();
        
    });
</script>
<!-- ----------------------------------------- -->
<script>
    dismissModal = function() {
        $('.modal').modal('hide');
    };
</script>
