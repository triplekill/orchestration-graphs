var graphHandlers = {
   	/**
	 * Handles Click on Graph
	 * - Deletes possible connection 
	 * OR
	 * - Show activity creation modal
	 * event.data contains nFixedElements
	 */
	onClick: function(event) {
		if (!graph.blockActivityCreation &&
			(!graph.paper.getElementByPoint(event.clientX, event.clientY) ||
			graph.paper.getElementByPoint(event.clientX, event.clientY).id <= event.data.nFixedElements)) {
			// If on graph (not on existing activity)
			if (graph.selectedActivities.length == 1) {
				// If connecting, delete possible connection
				graph.deselectActivities();
			} else {
				// If on graph, create activity
	    		position = {};
				position.x = event.offsetX;
				position.y = event.offsetY;
				graph.storeData(position);
				$('#activityChoice').modal('show');
			}
		}
	},

	onContextMenu: function($trigger, event) {
    	var raphElement = graph.paper.getElementByPoint(event.clientX, event.clientY);
    	if (!raphElement || raphElement.id <= event.data.nFixedElements) {
    		return graphHandlers.getContextMenu();
    	} else {
    		var activity = graph.getActivityFromDbid(raphElement.dbid, raphElement.counter);
    		if (activity) {
    			return activityHandlers.getContextMenu(activity);
    		} else {
    			return false;
    		}
    	}
    },

	getContextMenu: function() {
		return {
			callback: function(key, options) {
				switch (key) {
				case "clear": graph.clear(); break;
				}
			},
			items: { "clear": { name: "Clear graph" } }
		}
	},

   	/**
	 * Handles Submit on Activity Modal
	 */
	onActivityModalSubmit: function(e) {
		var value = $('#activitySelector').val();
		if (value != "choose") {
			$('#activityChoice').modal('hide');
			var data = graph.retrieveData();
			var dbid = parseInt($('#activitySelector').val());
			$('#activitySelector').val('choose');
			
			if (data.rectangle) {
				// Data is the Activity object to edit
				data.edit(dbid);
			} else {
				// Data contains {dbid, x, y}
				data.dbid = dbid;
				graph.buildActivity(data);
			}
		}
	},

	onOperatorTypeSelect: function(e) {
		var value = $("#operatorTypeSelector").val();
		if (value == 'choose') {
			$("#operatorSubtype").hide();
		} else {
			var htmlContent = '<option value="choose" href="#">Choose a subtype...</option>';
			operatorTypes[value].forEach(function(key) {
				htmlContent += '<option value="' + key + '" href="#">' + key + '</option>';
			});
			$('#operatorSubtypeSelector').html(htmlContent);
			$("#operatorSubtype").show();
		}
	},

	onOperatorLabelSelect: function(e) {
		var value = $("#operatorLabelSelector").val();
		if (value == 'choose') {
			$("#operatorSublabel").hide();
		} else {
			var htmlContent = '<option value="choose" href="#">Choose a sublabel...</option>';
			operatorLabels[value].forEach(function(key) {
				htmlContent += '<option value="' + key + '" href="#">' + key + '</option>';
			});
			$('#operatorSublabelSelector').html(htmlContent);
			$("#operatorSublabel").show();
		}
	},

   	/**
	 * Handles Submit on Complex Operator Modal
	 */
	onOperatorModalSubmit: function(e) {
		var subtypeValue = $("#operatorSubtypeSelector").val();
		var sublabelValue = $("#operatorSublabelSelector").val();
		if (sublabelValue != 'choose' && subtypeValue != 'choose') {
			$('#operatorChoice').modal('hide');
		}
	},

   	/**
	 * Handles Cancel on Complex Operator Modal
	 */
	onOperatorModalCancel: function(e) {
		$('#operatorChoice').modal('hide');
		graph.deselectActivities();
	},

	/**
	 * Handles mouse move on graph
	 * Update cursor position & possibleConnection
	 * event.data contains nFixedElements
	 */
	onMouseMove: function(event) {
    	if (!graph.paper.getElementByPoint(event.clientX, event.clientY) ||
			graph.paper.getElementByPoint(event.clientX, event.clientY).id <= event.data.nFixedElements) {
			cursor.attr({x: event.offsetX-1, y: event.offsetY-1});
		}
		if (graph.selectedActivities.length == 1) {
			SingletonPossibleConnection.getInstance().update();
		}
	},

	onSaveButtonClick: function() {
		if (!$('#scenarioForm #id_name').val()) {
			document.getElementById('saveMessage').innerHTML = 'Impposible to save: please set a name to your scenario.';
			document.getElementById('confirmSaveModal').disabled = true;
		} else if (graph.activities.length == 0) {
			document.getElementById('saveMessage').innerHTML = 'Impposible to save: please add at least one activity to your scenario.';
			document.getElementById('confirmSaveModal').disabled = true;
		} else {
			document.getElementById('saveMessage').innerHTML = 'Are you sure that you want to save this scenario?';
			if (window.location.href.indexOf('editor') > -1) {
				document.getElementById('saveMessage').innerHTML += ' Previous version will be lost.';
			}
			document.getElementById('confirmSaveModal').disabled = false;
		}
		$('#saveError').modal('show');
	},
}

var activityHandlers = {
	// Hover handlers
	// this contains the Activity object
	hoverIn: function(event) {
		this.activity.inspectButton.show();
		this.activity.deleteButton.show();
		SingletonPossibleConnection.getInstance().setTo(this.activity.rectangle);
	},
	hoverOut: function(event) {
		this.activity.inspectButton.hide();
		this.activity.deleteButton.hide();
		SingletonPossibleConnection.getInstance().setTo(graph.getCursor());
	},

	// Select the activity if one is already selected
	// event.data contains the Activity object
	onClick: function(event) {
		event.preventDefault();
		if (graph.selectedActivities.length == 1) {
			event.data.activity.select();
		}
	},

	// If edit: stores the edited activity and shows modal
	// If connect: selects activity
	// this contains the Activity object
	getContextMenu: function(activity) {
		return {
		    callback: function(key, options) {
		    	switch (key) {
		    		case "edit":
			        	$('#activitySelector').val(activity.get().dbid);
			        	graph.storeData(activity.get());
						$('#activityChoice').modal('show');
						break;
		    		case "connect":
						if (graph.selectedActivities.length == 0) {
			            	activity.select();
			            }
			            break;
		    		case "complexConnect":
						$('#operatorChoice').modal('show');
						if (graph.selectedActivities.length == 0) {
			            	activity.select();
			            }
			            break;
		    	}
		    },
			items: {
				"edit": {name: "Edit"},
				"connect": {name: "Add simple operator"},
				"complexConnect": {name: "Add complex operator"},
			}
		}
	},

	// Stores origin position
	dragger: function() {
		this.activity.Ox = this.activity.x;
		this.activity.Oy = this.activity.y;
	},
	// Reposition the activity on origin + dx/dy
	move: function(dx, dy) {
		var x = Math.max(this.activity.Ox + dx, this.width/2);
		var y = this.activity.Oy + dy;
	    this.activity.x = x;
	    this.activity.y = y;
	    this.activity.rectangle.attr({x: x - this.width/2, y: y - this.height/2});
	    this.activity.text.attr({x: x, y: y});
	    this.activity.inspectButton.setPosition({x: x-this.width/2, y: y-this.height/2});
	    this.activity.deleteButton.setPosition({x: x+this.width/2, y: y-this.height/2});
	    graph.updateConnections();
	    //r.safari();
	},
	// Reposition the activity on the nearest social plane
	up: function() {
		var y = graph.getNewY(this.activity.y);
		this.activity.y = y;
	    this.activity.rectangle.attr({y: y - this.height/2});
	    this.activity.text.attr({y: y});
	    this.activity.inspectButton.setPosition({y: y-this.height/2});
	    this.activity.deleteButton.setPosition({y: y-this.height/2});
	    graph.updateConnections();
	    
	    // Prevent the click handler on $('#graph') to create a new activity immediately after the drop
	    graph.blockActivityCreation = true;
	    setTimeout(function(){graph.blockActivityCreation = false;}, 0);
	}
}

var connectionHandlers = {
	// Shows button when near connection (on BBox)
	// Event.data contains the connection
	onMouseMove: function(event) {
		var box = event.data.connection.getBBox();
		if (event.offsetX > box.x && event.offsetX < box.x+box.width &&
			event.offsetY > box.y && event.offsetY < box.y+box.height) {
			event.data.connection.inspectButton.show();
			event.data.connection.deleteButton.show();
		} else {
			event.data.connection.inspectButton.hide();
			event.data.connection.deleteButton.hide();
		}
	}
}


var deleteButtonHandlers = {
	// Erase the target of the button
	// Event.data contains the target
	onClick: function(event) {
		// Prevent the click handler on $('#graph') to create a new activity immediately after the drop
		graph.blockActivityCreation = true;
		setTimeout(function(){ graph.blockActivityCreation = false; }, 0);
	    event.data.target.delete();
	}
}


var inspectButtonHandlers = {
	onClick: function(event) {
		graph.inspectedElement = event.data.target;
		event.data.target.inspect();
		$('#inspectContainer').show();
	}
}


var inspectPanelHandlers = {
	onClear: function(event) {
		$('#inspectContainer').hide();
	}
}
