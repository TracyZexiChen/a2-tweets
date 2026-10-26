//keep the written tweets here so the search box can use them
let written_tweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	let tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//only search through tweets that have user-written text
	written_tweets = tweet_array.filter(function(tweet) {
		return tweet.written;
	});
}

function addEventHandlerForSearch() {
	//start with an empty search
	document.getElementById('searchCount').innerText = 0;
	document.getElementById('searchText').innerText = '';

	//the input event fires every time a character is added or deleted
	document.getElementById('textFilter').addEventListener('input', function() {
		let searchText = this.value;
		let table = document.getElementById('tweetTable');
		document.getElementById('searchText').innerText = searchText;

		//clear the table when the search box is empty
		if (searchText == '') {
			table.innerHTML = '';
			document.getElementById('searchCount').innerText = 0;
			return;
		}

		//find the written tweets that contain the search text (ignoring upper/lower case)
		let matches = written_tweets.filter(function(tweet) {
			return tweet.writtenText.toLowerCase().includes(searchText.toLowerCase());
		});
		document.getElementById('searchCount').innerText = matches.length;

		//build all the rows first, then put them in the table at once
		let rows = '';
		for (let i = 0; i < matches.length; i++) {
			rows += matches[i].getHTMLTableRow(i + 1);
		}
		table.innerHTML = rows;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});
