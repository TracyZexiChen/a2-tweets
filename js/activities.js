function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//only completed tweets have an activity type and distance
	let completed_tweets = tweet_array.filter(function(tweet) {
		return tweet.source == 'completed_event';
	});

	//count how many tweets there are of each activity type
	let activityCounts = {};
	for (let i = 0; i < completed_tweets.length; i++) {
		let type = completed_tweets[i].activityType;
		if (activityCounts[type] == undefined) {
			activityCounts[type] = 0;
		}
		activityCounts[type]++;
	}

	//turn the counts into an array that vega-lite can use, sorted from most to least
	let activityData = [];
	for (let type in activityCounts) {
		activityData.push({activityType: type, count: activityCounts[type]});
	}
	activityData.sort(function(a, b) {
		return b.count - a.count;
	});

	document.getElementById('numberActivities').innerText = activityData.length;
	document.getElementById('firstMost').innerText = activityData[0].activityType;
	document.getElementById('secondMost').innerText = activityData[1].activityType;
	document.getElementById('thirdMost').innerText = activityData[2].activityType;

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityData
	  },
	  "mark": "bar",
	  "encoding": {
	    "x": {"field": "activityType", "type": "nominal", "sort": "-y", "title": "Activity type"},
	    "y": {"field": "count", "type": "quantitative", "title": "Number of tweets"}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//make the data for the distance graphs, only using the three most common activities
	let topThree = [activityData[0].activityType, activityData[1].activityType, activityData[2].activityType];
	let distanceData = [];
	for (let i = 0; i < completed_tweets.length; i++) {
		let tweet = completed_tweets[i];
		if (topThree.includes(tweet.activityType)) {
			distanceData.push({
				activityType: tweet.activityType,
				distance: tweet.distance,
				day: tweet.time.toLocaleDateString('en-US', {weekday: 'short'})
			});
		}
	}

	let dayOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	//graph with every single activity as a point
	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Distance of each activity by day of the week.",
	  "data": {
	    "values": distanceData
	  },
	  "mark": "point",
	  "encoding": {
	    "x": {"field": "day", "type": "ordinal", "sort": dayOrder, "title": "Day of the week"},
	    "y": {"field": "distance", "type": "quantitative", "title": "Distance (miles)"},
	    "color": {"field": "activityType", "type": "nominal", "title": "Activity type"}
	  }
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	//same graph but showing the mean distance instead
	distance_vis_aggregated_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Mean distance of each activity by day of the week.",
	  "data": {
	    "values": distanceData
	  },
	  "mark": "point",
	  "encoding": {
	    "x": {"field": "day", "type": "ordinal", "sort": dayOrder, "title": "Day of the week"},
	    "y": {"field": "distance", "type": "quantitative", "aggregate": "mean", "title": "Mean distance (miles)"},
	    "color": {"field": "activityType", "type": "nominal", "title": "Activity type"}
	  }
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, {actions:false});

	//only show one graph at a time, the button switches between them
	document.getElementById('distanceVisAggregated').style.display = 'none';
	document.getElementById('aggregate').addEventListener('click', function() {
		let allGraph = document.getElementById('distanceVis');
		let meanGraph = document.getElementById('distanceVisAggregated');
		if (meanGraph.style.display == 'none') {
			meanGraph.style.display = 'block';
			allGraph.style.display = 'none';
			this.innerText = 'Show all activities';
		} else {
			meanGraph.style.display = 'none';
			allGraph.style.display = 'block';
			this.innerText = 'Show means';
		}
	});

	//find the average distance of each of the top three activities to get the longest and shortest
	let longest = topThree[0];
	let shortest = topThree[0];
	let averages = {};
	for (let i = 0; i < topThree.length; i++) {
		let type = topThree[i];
		let total = 0;
		let count = 0;
		for (let j = 0; j < distanceData.length; j++) {
			if (distanceData[j].activityType == type) {
				total += distanceData[j].distance;
				count++;
			}
		}
		averages[type] = total / count;
		if (averages[type] > averages[longest]) {
			longest = type;
		}
		if (averages[type] < averages[shortest]) {
			shortest = type;
		}
	}
	document.getElementById('longestActivityType').innerText = longest;
	document.getElementById('shortestActivityType').innerText = shortest;

	//compare the average distance on weekdays vs weekends (averaging across the three activities)
	let weekdayTotal = 0;
	let weekdayCount = 0;
	let weekendTotal = 0;
	let weekendCount = 0;
	for (let i = 0; i < distanceData.length; i++) {
		if (distanceData[i].day == "Sat" || distanceData[i].day == "Sun") {
			weekendTotal += distanceData[i].distance;
			weekendCount++;
		} else {
			weekdayTotal += distanceData[i].distance;
			weekdayCount++;
		}
	}
	if (weekendTotal / weekendCount > weekdayTotal / weekdayCount) {
		document.getElementById('weekdayOrWeekendLonger').innerText = 'weekends';
	} else {
		document.getElementById('weekdayOrWeekendLonger').innerText = 'weekdays';
	}
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
