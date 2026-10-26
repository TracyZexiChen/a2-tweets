function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;

	//find the earliest and latest tweet
	let firstDate = tweet_array[0].time;
	let lastDate = tweet_array[0].time;
	for (let i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].time < firstDate) {
			firstDate = tweet_array[i].time;
		}
		if (tweet_array[i].time > lastDate) {
			lastDate = tweet_array[i].time;
		}
	}
	let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	document.getElementById('firstDate').innerText = firstDate.toLocaleDateString('en-US', dateOptions);
	document.getElementById('lastDate').innerText = lastDate.toLocaleDateString('en-US', dateOptions);

	//count how many tweets are in each category
	let completed = 0;
	let live = 0;
	let achievements = 0;
	let misc = 0;
	let written = 0;
	for (let i = 0; i < tweet_array.length; i++) {
		let source = tweet_array[i].source;
		if (source == 'completed_event') {
			completed++;
			//only count written tweets out of the completed events
			if (tweet_array[i].written) {
				written++;
			}
		} else if (source == 'live_event') {
			live++;
		} else if (source == 'achievement') {
			achievements++;
		} else {
			misc++;
		}
	}

	let total = tweet_array.length;
	setSpans('completedEvents', completed);
	setSpans('completedEventsPct', formatPercent(completed / total));
	setSpans('liveEvents', live);
	setSpans('liveEventsPct', formatPercent(live / total));
	setSpans('achievements', achievements);
	setSpans('achievementsPct', formatPercent(achievements / total));
	setSpans('miscellaneous', misc);
	setSpans('miscellaneousPct', formatPercent(misc / total));
	setSpans('written', written);
	setSpans('writtenPct', formatPercent(written / completed));
}

//updates every span with this class name (some classes show up more than once in index.html)
function setSpans(className, value) {
	let spans = document.querySelectorAll('.' + className);
	for (let i = 0; i < spans.length; i++) {
		spans[i].innerText = value;
	}
}

//turns a fraction like 0.9675 into "96.75%"
function formatPercent(fraction) {
	return math.format(fraction * 100, {notation: 'fixed', precision: 2}) + '%';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
