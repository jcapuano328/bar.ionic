angular.module('bar.controllers')

.controller('BattleMeleeCtrl', function($rootScope, $scope, $log, Melee) {
	$log.info('load battle melee controller');
    var _dice = [0,0];
    $scope.show = {};
    $scope.show.results = true;
    $scope.show.attacker = true;
    $scope.show.defender = true;
    $scope.melee = {
    	odds: Melee.odds,
    	nationalities: Melee.nationalities,
	    attack: {
	    	nationality: Melee.nationalities[0],
	        morale: 0,
	        leader: 0,
	        tacticalldr: false,
	        diversion: false,
	        modifier: {}
	    },
        defend: {
	    	nationality: Melee.nationalities[0],
	        morale: 0,
	        leader: 0,
	        tacticalldr: false,
	        modifier: {}
	    }
    };
    $scope.results = {
    	odds: Melee.odds[2],
    	melee: ''
    };
	
    $scope.reset = function() {
    	$rootScope.$emit('reset');
    }
    
    $scope.toggleItem = function(item) {
    	$scope.show[item] = !$scope.show[item];
    }
    
    $scope.isItemShown = function(item) {
    	return !!$scope.show[item];
    }
    
    $scope.onChange = function(v) {
    	$log.debug('onChange ' + v);
        resolve();
    }
    
    $scope.onRoll = function(dice) {
    	_dice = dice;
        resolve();
    }
    
    function modifiers(selected, mods) {
    	var drm = 0;
        _.each(selected, function(value, key) {
        	if (value) {
            	var m = _.find(mods, function(m) {
                	return m.name == key;
				}) || {value: 0};
                drm += m.value;
            }
        });
        return drm;
    }
    
    function resolve() {
    	$log.info('Resolve melee');
        var attackdrm = modifiers($scope.melee.attack.modifier, $scope.battle.modifiers.melee.attack);
        var defenddrm = modifiers($scope.melee.defend.modifier, $scope.battle.modifiers.melee.defend);
        //$log.debug('Hit: ' + _dice[0] + ', Damage: ' + _dice[1] + ', Type: ' + $scope.fire.type + ', SPs: ' + $scope.fire.strength + ', Range: ' + $scope.fire.range + ', DRM: ' + drm);
        $scope.results.melee = Melee.resolve(_dice[0], _dice[1], $scope.results.odds, 
        									$scope.melee.attack.morale, $scope.melee.attack.nationality, $scope.melee.attack.leader, $scope.melee.attack.tacticalldr, $scope.melee.attack.diversion, attackdrm, 
                                            $scope.melee.defend.morale, $scope.melee.defend.nationality, $scope.melee.defend.leader, $scope.melee.defend.tacticalldr, defenddrm);
    }
    
});

