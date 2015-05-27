'use strict';

angular.module('spinnaker.pipelines.stage.disableAsg')
  .config(function(pipelineConfigProvider) {
    pipelineConfigProvider.registerStage({
      label: 'Disable Server Group',
      description: 'Disables a server group',
      key: 'disableAsg',
      controller: 'DisableAsgStageCtrl',
      controllerAs: 'disableAsgStageCtrl',
      templateUrl: 'scripts/modules/pipelines/config/stages/disableAsg/disableAsgStage.html',
      executionDetailsUrl: 'scripts/modules/pipelines/config/stages/disableAsg/disableAsgExecutionDetails.html',
      executionStepLabelUrl: 'scripts/modules/pipelines/config/stages/disableAsg/disableAsgStepLabel.html',
    });
  }).controller('DisableAsgStageCtrl', function($scope, stage, accountService) {
    var ctrl = this;

    $scope.stage = stage;

    $scope.state = {
      accounts: false,
      regionsLoaded: false
    };

    accountService.listAccounts().then(function (accounts) {
      $scope.accounts = accounts;
      $scope.state.accounts = true;
    });

    $scope.regions = ['us-east-1', 'us-west-1', 'eu-west-1', 'us-west-2'];

    ctrl.accountUpdated = function() {
      accountService.getRegionsForAccount($scope.stage.credentials).then(function(regions) {
        $scope.regions = _.map(regions, function(v) { return v.name; });
        $scope.state.regionsLoaded = true;
      });
    };

    ctrl.toggleRegion = function(region) {
      if (!$scope.stage.regions) {
        $scope.stage.regions = [];
      }
      var idx = $scope.stage.regions.indexOf(region);
      if (idx > -1) {
        $scope.stage.regions.splice(idx,1);
      } else {
        $scope.stage.regions.push(region);
      }
    };

    $scope.targets = [
      {
        label: 'Current Server Group',
        val: 'current_asg'
      }, {
        label: 'Last Server Group',
        val: 'ancestor_asg'
      }
    ];

    (function() {
      if ($scope.stage.credentials) {
        ctrl.accountUpdated();
      }
      if (!$scope.stage.target) {
        $scope.stage.target = $scope.targets[0].val;
      }
    })();

  });

